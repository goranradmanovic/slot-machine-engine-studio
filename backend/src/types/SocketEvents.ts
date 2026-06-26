import type { SlotMachineConfig } from "./SlotMachineConfig.ts";
import type { configs } from '../configs/config.ts'

export type ConfigVersion = keyof typeof configs

export interface ServerToClientEvents {
    'config-response': (config: SlotMachineConfig) => void,
    'config-error': (error: { message: string})=> void
}

export interface ClientToServerEvents {
    'request-config': (version: ConfigVersion) => void
}