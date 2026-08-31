import type { SlotConfig } from './SlotConfig'

export interface ConfigChange {
    field: string
    label: string
    from: unknown
    to: unknown
}

export interface GenerateConfigRequest {
    prompt: string
    config: SlotConfig
}

export interface GenerateConfigResponse {
    explanation: string
    warnings: string[]
    changes: ConfigChange[]
    config: SlotConfig
}