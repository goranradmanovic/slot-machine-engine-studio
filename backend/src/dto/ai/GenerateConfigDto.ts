import type { SlotMachineConfig } from '../../types/slot-machine-config.types.ts'

export interface GenerateConfigDto {
    prompt: string,
    config: SlotMachineConfig
}