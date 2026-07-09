<template>
  <section class="col-12">
    <div class="surface-card p-4 border-round shadow-1 flex flex-column gap-3">
        <div class="flex justify-content-between align-items-center">
          <div>
            <h3 class="text-xl font-bold m-0 text-primary">
              <i class="pi pi-wave-pulse mr-2"></i>Engine Math Simulator
            </h3>
            <p class="text-sm text-color-secondary m-0">
              Run a simulation based on your config.
            </p>
          </div>
          <div>
            <Button 
              :label="isSimulating ? 'Simulating...' : 'Run 100k Spins'" 
              :icon="isSimulating ? 'pi pi-spin pi-spinner' : 'pi pi-play'" 
              @click="runSimulation" 
              severity="warn"
              :disabled="reset"
            />

            <Button
              v-if="reset"
              @click="resetSimulation" 
              icon="pi pi-refresh" 
              label="Reset" 
              severity="success"
              :disabled="isSimulating"
              class="ml-3"
            />
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="my-4" v-if="isSimulating || currentProgress > 0">
          <div class="flex justify-content-between text-xs text-gray-400 mb-1">
              <span>Progressing Output State</span>
              <span>{{ stats.totalSimulated.toLocaleString() }} / {{ totalSpinsToRun.toLocaleString() }}</span>
          </div>
          <ProgressBar :value="currentProgress" :showValue="false" style="height: 6px;" />
        </div>

        <!-- Metrics Grid View -->
        <div class="grid">
          <div class="col">
            <Panel header="Calculated RTP">
              <span class="text-xl font-bold text-green-400">{{ calculatedRTP }}</span>
            </Panel> 
          </div>
          <div class="col-4">
            <Panel header="Hit Frequency">
              <span class="text-xl font-bold text-blue-400">{{ hitFrequency }}</span>
            </Panel>
          </div>
          <div class="col-4">
            <Panel header="Bonus Trigger Frequency">
              <span class="text-xl font-bold text-purple-400">{{ freeSpinsFrequency }}</span>
            </Panel>
          </div>
          <div class="col-4">
            <Panel header="Total Volatility Turnover">
              <span class="text-xl text-white font-semibold">${{ stats.totalBet.toLocaleString(undefined, {minimumFractionDigits: 2}) }}</span>
            </Panel>
          </div>
          <div class="col-4">
            <Panel header="Total Payout Accumulation">
              <span class="text-xl text-white font-semibold">${{ stats.totalWin.toLocaleString(undefined, {minimumFractionDigits: 2}) }}</span>
            </Panel>
          </div>
          <div class="col-4">
            <Panel header="Max Single Payout">
              <span class="text-xl text-orange-400 font-bold">${{ stats.maxWin.toLocaleString(undefined, {minimumFractionDigits: 2}) }}</span>
            </Panel>
          </div>
        </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  /**
   * The Math Behind the SimulationTo run a simulation based on your config, we simulate a virtual Random Number Generator (RNG) selecting a stop position for each reel, 
   * evaluating the resulting grid against your WINLINES, adding up payouts, and calculating statistics:
   * Total Bet: Total Bet = Simulated Spins} x BET
   * Win: The sum of all base game wins + free spin round wins.
   * RTP (Return to Player): RTP = ( Total Win / Total Bet) x 100
   * Hit Frequency: Hit Frequency = ( Spins with a Win > 0 / Total Simulated Spins) x 100
   */

  import { ref, computed } from 'vue';
  import { type SlotConfig } from '@/types/SlotConfig'

  const props = defineProps<{
    config: SlotConfig
  }>();

  interface Stats {
    totalSimulated: number,
    totalBet: number,
    totalWin: number,
    winningSpinsCount: number,
    freeSpinsTriggeredCount: number,
    maxWin: number
  }

  // --- Simulation State ---
  const isSimulating = ref<boolean>(false)
  const totalSpinsToRun = ref<number>(100000) // 100k spins is standard for a quick studio test
  const currentProgress = ref<number>(0)

  // Results tracking
  const stats = ref<Stats>({
    totalSimulated: 0,
    totalBet: 0,
    totalWin: 0,
    winningSpinsCount: 0,
    freeSpinsTriggeredCount: 0,
    maxWin: 0
  })

  const reset = ref<boolean>(false)

  // --- Mocking Missing Math Data for Execution ---
  // In production, these arrays should ideally come from your JSON file!
  const mockSymbols = ['A', 'B', 'C', 'D', 'WILD', 'SCATTER']
  const mockPaytable: Record<string, Record<number, number>> = {
    'A':     { 3: 10, 4: 50 },
    'B':     { 3: 5,  4: 25 },
    'C':     { 3: 2,  4: 10 },
    'D':     { 3: 1,  4: 5 },
    'WILD':  { 3: 20, 4: 100 },
  }

  // Create mock reel strips based on your 4 reels configuration
  const mockReelStrips: string[][] = Array.from({ length: props.config.REEL_COUNT }, () => 
    Array.from({ length: 30 }, () => mockSymbols[Math.floor(Math.random() * mockSymbols.length)])
  )

  // --- Computed Metrics ---
  const calculatedRTP = computed(() => {
    if (stats.value.totalBet === 0) return '0.00%'
    return `${((stats.value.totalWin / stats.value.totalBet) * 100).toFixed(2)}%`
  })

  const hitFrequency = computed(() => {
    if (stats.value.totalSimulated === 0) return '0.00%';
    return `${((stats.value.winningSpinsCount / stats.value.totalSimulated) * 100).toFixed(2)}%`
  })

  const freeSpinsFrequency = computed(() => {
    if (stats.value.totalSimulated === 0) return 'Never'
    if (stats.value.freeSpinsTriggeredCount === 0) return '0.00%'
    return `1 in ${Math.round(stats.value.totalSimulated / stats.value.freeSpinsTriggeredCount)} spins`
  })

  const resetSimulation = () => {
    stats.value = {
      totalSimulated: 0,
      totalBet: 0,
      totalWin: 0,
      winningSpinsCount: 0,
      freeSpinsTriggeredCount: 0,
      maxWin: 0
    }

    currentProgress.value = 0
    reset.value = false
  }

  // --- Core Simulation Logic ---
  const runSimulation = () => {
    isSimulating.value = true
    currentProgress.value = 0
    
    // Reset stats
    resetSimulation()

    const chunkSize = 2500 // Processes iterations in batches to keep UI responsive
    
    const executeChunk = () => {
      if (stats.value.totalSimulated >= totalSpinsToRun.value) {
        isSimulating.value = false
        return
      }

      const currentBatchMax = Math.min(chunkSize, totalSpinsToRun.value - stats.value.totalSimulated)

      for (let i = 0; i < currentBatchMax; i++) {
        let spinWin = 0
        stats.value.totalSimulated++
        stats.value.totalBet += props.config.BET

        // 1. Generate Virtual Grid Outcome (4 reels x 6 visible rows = 24 flat indices)
        const visibleGrid: string[] = []

        for (let r = 0; r < props.config.REEL_COUNT; r++) {
          const strip = mockReelStrips[r]
          const stopPointer = Math.floor(Math.random() * strip.length)
          
          for (let row = 0; row < props.config.SYMBOLS_PER_REEL; row++) {
            const index = (stopPointer + row) % strip.length
            visibleGrid.push(strip[index])
          }
        }

        // 2. Evaluate Payouts Across Registered Winlines
        props.config.WINLINES.forEach((winline) => {
          let matchingCount = 0
          let targetSymbol = ''

          // Follow line configuration mapping
          for (let cellIndex = 0; cellIndex < winline.line.length; cellIndex++) {
            if (winline.line[cellIndex] === 1) {
              const currentSymbol = visibleGrid[cellIndex]
              
              if (!targetSymbol) {
                targetSymbol = currentSymbol
                matchingCount = 1
              } else if (currentSymbol === targetSymbol || currentSymbol === 'WILD') {
                matchingCount++
              } else {
                break // Line combination broken left-to-right
              }
            }
          }

          // Apply paytable matches
          if (mockPaytable[targetSymbol] && mockPaytable[targetSymbol][matchingCount]) {
            spinWin += mockPaytable[targetSymbol][matchingCount] * (props.config.BET / 100)
          }
        })

        // 3. Count Free Spins Triggers (Example: Evaluates total Scatters on screen)
        const scatterCount = visibleGrid.filter(sym => sym === 'SCATTER').length

        if (props.config.HAS_FREE_SPINS && scatterCount >= 3) {
          stats.value.freeSpinsTriggeredCount++
          // Rough mock evaluation of feature reward payload
          spinWin += (props.config.BET * props.config.NR_OF_FREE_SPINS) * 0.5
        }

        // 4. Update Stats Aggregation
        if (spinWin > 0) {
          stats.value.winningSpinsCount++
          stats.value.totalWin += spinWin

          if (spinWin > stats.value.maxWin) {
            stats.value.maxWin = spinWin
          }
        }
      }

      // Calculate percentage completed
      currentProgress.value = Math.round((stats.value.totalSimulated / totalSpinsToRun.value) * 100)
      
      // Call next iteration asynchronously
      requestAnimationFrame(executeChunk)
      
      reset.value = true
    }

    requestAnimationFrame(executeChunk)
  }
</script>