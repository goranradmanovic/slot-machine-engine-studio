import {SymbolConfig, SymbolType} from "../../utils/SymbolsConfig";
import {SlotMachineConfig} from "../SlotMachineConfig";

export class Winline {
    private config: SlotMachineConfig;
    private symbolsConfig: SymbolConfig[];
    private scatterConfig: SymbolConfig | undefined;

    constructor(config: SlotMachineConfig, symbolsConfig: SymbolConfig[]) {
        this.config = config;
        this.symbolsConfig = symbolsConfig;
        // Get scatter symbol config
        this.scatterConfig = this.symbolsConfig.find((symbol: SymbolConfig) => symbol.isScatter);
    }

    // Evaluate each win line against the symbols grid
    public checkWinLinesWin(symbols: SymbolType[], bet: number): WinLineResult[] {
        const results: WinLineResult[] = [];

        for (const winline of this.config.WINLINES) {
            const winPositions = winline.line.reduce((result: number[], value: number, index: number) => {
                if (value === 1) result.push(index);
                return result;
            }, []);

            const lineSymbols: SymbolType[] = winPositions.map((pos: number) => symbols[pos]);
             console.log(lineSymbols);
            const result = this.checkWinLine(lineSymbols, winline.id, bet);
            console.log(result);

            if (result) {
                results.push(result);
            }
        }

        return results;
    }

    // Evaluate a single line for wins
    private checkWinLine(lineSymbols: SymbolType[], lineId: number, bet: number): WinLineResult | undefined {
        const winLineSymbol: SymbolType = lineSymbols[0];
        let count: number = 1;

        // Skip scatter symbols in regular win lines
        if (this.isSymbolScatter(winLineSymbol)) {
            return {
                winLineId: -1,
                winLine: [],
                symbols: [],
                symbolType: winLineSymbol,
                symbolCount: 0,
                win: 0
            };
        }

        // Count consecutive matching symbols
        for (let i = 1; i < lineSymbols.length; i++) {
            const currentSymbol = lineSymbols[i];

            if (currentSymbol === winLineSymbol) {
                count++;
            } else {
                break;
            }
        }

        // Find the corresponding symbol config
        const symbolConfig = this.symbolsConfig.find(symbol => symbol.type === winLineSymbol);

        // Calculate win
        let win: number = 0;
        if (symbolConfig && symbolConfig.payout[count]) {
            win = symbolConfig.payout[count] * bet;
            return {
                winLineId: lineId,
                winLine: this.config.WINLINES[lineId - 1].line,
                symbols: lineSymbols.slice(0, count),
                symbolType: winLineSymbol,
                symbolCount: count,
                win
            };
        }

        return undefined;
    }

    private isSymbolScatter(symbolType: SymbolType): boolean {
        const symbolConfig = this.symbolsConfig.find((symbol) => symbol.type === symbolType);
        return symbolConfig?.isScatter || false;
    }

    // Evaluate scatter symbols (free spins) across the entire grid
    public checkScatters(symbols: SymbolType[], bet: number): WinLineResult & { freeSpins: number } {
        const isScatterPresent = symbols.some(symbol => symbol === this.scatterConfig?.type);
        if (!this.scatterConfig || !isScatterPresent) {
            return { winLineId: -1, winLine: [], symbols: [], symbolType: SymbolType.CIRCLE, symbolCount: 0, win: 0, freeSpins: 0 };
        }

        let minNrOfFreeeSpins: number = 3;
        if (this.scatterConfig.freeSpins) {
            minNrOfFreeeSpins = Number(Object.keys(this.scatterConfig.freeSpins)[0]);
        }
        let scatterSymbols: SymbolType[] = [];
        let scatterIndices = [];

        for (let i = 0; i < symbols.length; i++) {
            if (symbols[i] === this.scatterConfig?.type) {
                scatterSymbols.push(symbols[i]);
                scatterIndices.push(i);
            }
        }

        const scatterCount = scatterSymbols.length;

        // Generate win line
        let winLine = new Array(this.config.REEL_COUNT * this.config.SYMBOLS_PER_REEL).fill(0);
        if (scatterCount >= minNrOfFreeeSpins) {
            scatterIndices.forEach(index => {
                winLine[index] = 1;
            });
        }

        // Calculate win and free spins
        let win = 0;
        let freeSpins = 0;
        if (scatterCount >= minNrOfFreeeSpins) {
            // Find the highest applicable payout for the scatter count
            const payoutEntries = Object.entries(this.scatterConfig.payout).map(([count, value]) => [parseInt(count), value]);
            payoutEntries.sort((a, b) => b[0] - a[0]); // Sort by count descending

            // Find first payout that's less than or equal to our scatter count
            for (const [count, value] of payoutEntries) {
                if (scatterCount >= count) {
                    win = value * bet;
                    break;
                }
            }
            // Handle free spins similarly if they exist
            if (this.scatterConfig.freeSpins) {
                const freeSpinEntries = Object.entries(this.scatterConfig.freeSpins).map(([count, value]) => [parseInt(count), value]);
                freeSpinEntries.sort((a, b) => b[0] - a[0]); // Sort by count descending

                // Find first free spin count that's less than or equal to our scatter count
                for (const [count, value] of freeSpinEntries) {
                    if (scatterCount >= count) {
                        freeSpins = value;
                        break;
                    }
                }
            }
        }

        return {
            winLineId: -1,
            winLine: scatterCount >= minNrOfFreeeSpins ? winLine : [],
            symbols: scatterSymbols,
            symbolType: this.scatterConfig.type,
            symbolCount: scatterCount,
            win,
            freeSpins
        };
    }
}

export interface WinLineResult {
    winLineId: number;
    winLine: number[];
    symbols: SymbolType[];
    symbolType: SymbolType;
    symbolCount: number;
    win: number;
    freeSpins?: number;
}