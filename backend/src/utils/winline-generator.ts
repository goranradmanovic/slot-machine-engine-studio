import type { WinLine } from '../types/slot-machine-config.types.ts'

export function generateWinLines(reelCount: number, symbolsPerReel: number): WinLine[] {

    const winlines: WinLine[] = []

    for (let row = 0; row < symbolsPerReel; row++) {

        const line = new Array(reelCount * symbolsPerReel).fill(0)

        for (let reel = 0; reel < reelCount; reel++) {
            const index = reel * symbolsPerReel + row

            line[index] = 1
        }

        winlines.push({
            id: winlines.length + 1,
            line
        })
    }

    return winlines
}