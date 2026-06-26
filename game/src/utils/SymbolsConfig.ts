export enum SymbolType {
    CIRCLE = '1',
    STAR_CIRCLE = '2',
    TRAPEZOID = '3',
    EMPTY_TRAPEZOID = '4',
    STAR = '5'
}

// Symbol configuration with weights
export interface SymbolConfig {
    type: SymbolType;
    weight: number; // Higher weight = more common
    defaultWeight?: number,
    weightDuringFS?: number
    payout: {
        [count: number]: number;
    };
    isScatter?: boolean;
    freeSpins?: {
        [count: number]: number;
    };
}

// Define symbols with their relative weights and payouts
export const SYMBOLS: SymbolConfig[] = [
    {
        type: SymbolType.CIRCLE,
        weight: 20, // Most common
        payout: { 3: 5, 4: 10 }
    },
    {
        type: SymbolType.STAR_CIRCLE,
        defaultWeight: 5,
        weight: 5, // Extremely rare
        weightDuringFS: 2,
        payout: { 3: 5, 4: 10 }, // Small direct payout
        isScatter: true,
        freeSpins: { 3: 2, 4: 3 } // Number of free spins awarded
    },
    {
        type: SymbolType.TRAPEZOID,
        weight: 15,
        payout: { 3: 10, 4: 20 }
    },
    {
        type: SymbolType.EMPTY_TRAPEZOID,
        weight: 10,
        payout: { 3: 20, 4: 40 }
    },
    {
        type: SymbolType.STAR,
        weight: 5,
        payout: { 3: 50, 4: 100 }
    }
];
