import type { SlotMachineConfig } from "../../types/slot-machine-config.types.ts"
import type { ConfigChangeDto } from "./ConfigChangeDto.ts"

export interface AIGenerateResponseDto {
    explanation: string,
    warnings: string[],
    changes: ConfigChangeDto[]
    config: Partial<SlotMachineConfig>
}