export interface WinLine {
    id: number,
    line: number[]
}

export interface SlotMachineConfig {
    REEL_COUNT: number
    SYMBOLS_PER_REEL: number
    SYMBOL_SIZE: number
    SYMBOLS_TYPE: string;
    SOUND_TYPE: string;
    BACKGROUND_COLOR: string,
    FRAME_SPINE_BG_COLOR: string,
    FRAME_SPINE_BG_COLOR_OPACITY: number,
    REEL_SPACING: number
    HAS_FREE_SPINS: boolean
    NR_OF_FREE_SPINS: number
    SPIN_DELAY: number
    STOP_SPIN_DELAY: number
    SPIN_DURATION: number
    CHECK_WIN_DELAY: number
    BET: number
    WINLINES: WinLine[]
}