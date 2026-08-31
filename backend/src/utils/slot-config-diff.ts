import type { SlotMachineConfig } from '../types/slot-machine-config.types.ts'
import type { ConfigChangeDto } from '../dto/ai/ConfigChangeDto.ts'

const LABELS: Record<string, string> = {
    REEL_COUNT: 'Reel Count',
    SYMBOLS_PER_REEL: 'Symbols Per Reel',
    SYMBOL_SIZE: 'Symbol Size',
    SYMBOLS_TYPE: 'Symbols Theme',
    SOUND_TYPE: 'Sound Theme',
    BACKGROUND_COLOR: 'Background Color',
    FRAME_SPINE_BG_COLOR: 'Frame Background Color',
    FRAME_SPINE_BG_COLOR_OPACITY: 'Frame Background Opacity',
    REEL_SPACING: 'Reel Spacing',
    HAS_FREE_SPINS: 'Free Spins Enabled',
    NR_OF_FREE_SPINS: 'Number of Free Spins',
    SPIN_DELAY: 'Spin Delay',
    STOP_SPIN_DELAY: 'Stop Spin Delay',
    SPIN_DURATION: 'Spin Duration',
    CHECK_WIN_DELAY: 'Check Win Delay',
    BET: 'Bet',
    WINLINES: 'Paylines'
}

export function generateSlotConfigDiff(previous: SlotMachineConfig, next: SlotMachineConfig): ConfigChangeDto[] {
    
    const changes: ConfigChangeDto[] = []
    const keys = Object.keys(previous) as (keyof SlotMachineConfig)[]

    for (const key of keys) {
        const oldValue = previous[key]
        const newValue = next[key]

        if (!isEqual(oldValue, newValue)) {
            if (key === 'WINLINES') {
                changes.push({
                    field: key,
                    label: LABELS[key] ?? key,
                    from: `${oldValue.length} paylines`,
                    to: `${newValue.length} paylines`
                })

                continue
            }

            changes.push({
                field: key,
                label: LABELS[key] ?? key,
                from: oldValue,
                to: newValue
            })
        }
    }

    return changes
}

function isEqual(a: unknown, b: unknown): boolean {
    return JSON.stringify(a) === JSON.stringify(b)
}