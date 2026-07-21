import type { SlotMachineConfig } from "./slot-machine-config.types.ts"

export interface ServerToClientEvents {
    'config-response': (config: SlotMachineConfig) => void,
    'config-error': (error: { message: string})=> void
}

export interface ClientToServerEvents {
    'request-config': (version: string) => void
}