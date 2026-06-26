<template>
    <section class="col-12">
        <div class="surface-card p-4 border-round shadow-1 flex flex-column gap-4">
            <div class="flex justify-content-between align-items-center">
                <h3 class="text-xl font-bold m-0 text-primary">
                    <i class="pi pi-list mr-2"></i>Interactive Winlines Editor
                </h3>
            </div>

            <Accordion>
                <AccordionPanel value="0">
                    <AccordionHeader>Winlines Matrix Editor</AccordionHeader>
                    <AccordionContent>
                        <div class="flex justify-content-end my-3">
                            <Button 
                                icon="pi pi-plus" 
                                label="Add Winline" 
                                class="p-button-sm w-auto" 
                                severity="secondary"
                                @click="addNewWinline" 
                            />
                        </div>
                        <div class="flex flex-column gap-3 max-h-30rem overflow-y-auto pr-2">
                            <div 
                                v-for="(lineItem, lineIndex) in config.WINLINES" 
                                :key="lineItem.id" 
                                class="p-3 border-1 surface-border border-round flex flex-column md:flex-row align-items-start md:align-items-center justify-content-between gap-3"
                            >
                                <div class="flex flex-row md:flex-column justify-content-between w-full md:w-auto gap-2">
                                    <span class="font-bold text-lg">Line #{{ lineItem.id }}</span>
                                </div>

                                <div 
                                    class="grid-container p-2 border-round grid gap-1"
                                    :style="{
                                        gridTemplateColumns: `repeat(${config.REEL_COUNT}, minmax(30px, 1fr))`
                                    }"
                                >
                                    <div 
                                        v-for="(cellValue, cellIndex) in (config.REEL_COUNT * config.SYMBOLS_PER_REEL)" 
                                        :key="cellIndex"
                                        @click="toggleCell(lineIndex, cellIndex)"
                                        class="w-2rem h-2rem cursor-pointer border-round text-center text-white flex align-items-center justify-content-center transition-colors transition-duration-150 select-none"
                                        :style="{
                                            backgroundColor: lineItem.line[cellIndex] === 1 ? 'var(--p-primary-color, #10b981)' : 'var(--p-surface-700, #3f3f46)',
                                        }"
                                        v-tooltip.top="lineItem.line[cellIndex] === 1 ? 'Active Tile' : 'Inactive Tile'"
                                    >
                                        <i v-if="lineItem.line[cellIndex] === 1" class="pi pi-star-fill"></i>
                                        <i v-else class="pi pi-star"></i>
                                    </div>
                                </div>

                                <div class="align-self-end md:align-self-center">
                                    <Message severity="secondary" size="small">Total Hits: {{ lineItem.line.filter(v => v === 1).length }}</Message>
                                </div>

                                <Button 
                                    icon="pi pi-trash" 
                                    severity="danger" 
                                    text
                                    class="p-button-sm w-auto"
                                    @click="removeWinline(lineIndex)"
                                />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionPanel>
            </Accordion>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { type Winlines } from '@/types/SlotConfig'

    const config = defineModel<Winlines>({ required: true })

    // Helper function to handle slot tile state inversion mutation
    const toggleCell = (lineIndex: number, cellIndex: number) => {
        const targetLine = config.value.WINLINES[lineIndex].line
        
        // Toggle index state value cleanly
        targetLine[cellIndex] = targetLine[cellIndex] === 1 ? 0 : 1
    }

    // Adds a pristine line matching current grid settings array size bounds
    const addNewWinline = () => {
        const nextId = config.value.WINLINES.length > 0 
            ? Math.max(...config.value.WINLINES.map(l => l.id)) + 1 
            : 1
            
        // Calculate size array bound length needed dynamically 
        const totalCells = config.value.REEL_COUNT * config.value.SYMBOLS_PER_REEL
        
        config.value.WINLINES.push({
            id: nextId,
            line: Array(totalCells).fill(0) // Create empty blank row structure
        })
    }

    // Removes selected element row out of registry array index positions
    const removeWinline = (index: number) => config.value.WINLINES.splice(index, 1)
</script>