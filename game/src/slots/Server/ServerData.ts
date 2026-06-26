import {SlotMachineConfig} from "../SlotMachineConfig";
import {SymbolConfig, SYMBOLS, SymbolType} from "../../utils/SymbolsConfig";
import {Winline, WinLineResult} from "./Winline";

export class ServerData {
    private config: SlotMachineConfig;
    private symbolsConfig: SymbolConfig[];
    private winLine: Winline;
    public isFreeSpins: boolean = false;
    private remainingFreeSpins: number = 0;

    constructor(config: SlotMachineConfig) {
        this.config = config;
        this.symbolsConfig = SYMBOLS;
        this.winLine = new Winline(config, SYMBOLS);
    }

    public getServerData(bet: number = 1): ServerResult {
        const symbols: SymbolType[][] = this.generateRandomGrid();
        let freeSpinsState: string | null = null;
        if (this.remainingFreeSpins === 0) {
            this.isFreeSpins = false;
        }
        if (this.isFreeSpins) {
            this.remainingFreeSpins--;
            if (this.remainingFreeSpins === 0) {
                freeSpinsState = 'end';
            }
        }

        const flatSymbolsGrid = this.flattenSymbolsGrid(symbols);
        const winningLines: WinLineResult[] = this.winLine.checkWinLinesWin(flatSymbolsGrid, bet);
        // Check for scatter symbols (free spins)
        const scatterResult = this.winLine.checkScatters(flatSymbolsGrid, bet);

        if (scatterResult.win > 0) {
            winningLines.push(scatterResult);
            this.isFreeSpins = true;
            freeSpinsState = 'start';
            this.remainingFreeSpins += scatterResult.freeSpins;
        }
        const totalWin: number = winningLines.reduce((sum: number, line: WinLineResult) => sum + line.win, 0);

        return {
            symbols,
            winningLines,
            totalWin,
            bet,
            freeSpinsAwarded: scatterResult.freeSpins || this.remainingFreeSpins,
            freeSpinsState: freeSpinsState,
            scatterWin: scatterResult.win
        };
    }

    private generateRandomGrid(): SymbolType[][] {
        const grid: SymbolType[][] = [];

        let scatterSymbol: SymbolConfig | undefined = this.symbolsConfig.find((symbol) => symbol.isScatter);
        // during FS we change the scatter symbol weight to make it less likely to appear
        if (scatterSymbol !== undefined) {
            if (this.isFreeSpins) {
                if (scatterSymbol.weightDuringFS != null) {
                    scatterSymbol.weight = scatterSymbol.weightDuringFS;
                }
            } else {
                if (scatterSymbol.defaultWeight != null) {
                    scatterSymbol.weight = scatterSymbol.defaultWeight;
                }
            }
        }
        // Calculate total weight for weighted random selection
        const totalWeight = this.symbolsConfig.reduce((sum, symbol) => sum + symbol.weight, 0);

        // Generate symbols for each reel
        for (let i = 0; i < this.config.REEL_COUNT; i++) {
            const reel: SymbolType[] = [];

            for (let j = 0; j < this.config.SYMBOLS_PER_REEL; j++) {
                // Generate a random number between 0 and totalWeight
                const randomWight = Math.random() * totalWeight;
                let weightSum = 0;
                let selectedSymbol: SymbolType = this.symbolsConfig[0].type;

                // Find which symbol corresponds to the random value
                for (const symbol of this.symbolsConfig) {
                    weightSum += symbol.weight;
                    if (randomWight <= weightSum) {
                        selectedSymbol = symbol.type;
                        break;
                    }
                }
                reel.push(selectedSymbol);
            }
            grid.push(reel);
        }

        return grid;
    }

    // Convert symbols grid for easier win line evaluation
    private flattenSymbolsGrid(grid: SymbolType[][]): SymbolType[] {
        const flatSymbolsGrid: SymbolType[] = [];

        for (let i = 0; i < this.config.REEL_COUNT; i++) {
            for (let j = 0; j < this.config.SYMBOLS_PER_REEL; j++) {
                flatSymbolsGrid.push(grid[i][j]);
            }
        }

        return flatSymbolsGrid;
    }
}

export interface ServerResult {
    symbols: SymbolType[][];
    winningLines: WinLineResult[];
    totalWin: number;
    bet: number;
    freeSpinsAwarded: number;
    freeSpinsState: string | null;
    scatterWin: number;
}

