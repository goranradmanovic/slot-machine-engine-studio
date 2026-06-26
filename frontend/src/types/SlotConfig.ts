export interface WinLine {
    id: number;
    line: number[];
}

export interface SlotConfig {
    REEL_COUNT: number;
    SYMBOLS_PER_REEL: number;
    SYMBOL_SIZE: number;
    SYMBOLS_TYPE: string;
    SOUND_TYPE: string;
    BACKGROUND_COLOR: string,
    FRAME_SPINE_BG_COLOR: string,
    FRAME_SPINE_BG_COLOR_OPACITY: number,
    REEL_SPACING: number;
    HAS_FREE_SPINS: boolean;
    NR_OF_FREE_SPINS: number;
    SPIN_DELAY: number;
    STOP_SPIN_DELAY: number;
    SPIN_DURATION: number;
    CHECK_WIN_DELAY: number;
    BET: number;
    WINLINES: WinLine[];
}

export interface ReelLayoutConfig {
    REEL_COUNT: number,
    SYMBOLS_PER_REEL: number,
    SYMBOL_SIZE: number,
    REEL_SPACING: number
}

export interface TimingsBetting {
    SPIN_DURATION: number,
    SPIN_DELAY: number,
    STOP_SPIN_DELAY: number,
    CHECK_WIN_DELAY: number,
    BET: number
}

export interface FreeSpins {
    HAS_FREE_SPINS: boolean,
    NR_OF_FREE_SPINS: number
}

export interface ActiveWinlines {
    WINLINES: WinLine[]
}

export interface Winlines {
    REEL_COUNT: number,
    SYMBOLS_PER_REEL: number
    WINLINES: WinLine[]
}

export interface Symbols {
    SYMBOLS_TYPE: string
}

export interface Audio {
    SOUND_TYPE: string
}

export interface Canvas {
    BACKGROUND_COLOR: string,
    FRAME_SPINE_BG_COLOR: string,
    FRAME_SPINE_BG_COLOR_OPACITY: number
}