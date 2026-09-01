import type { SlotMachineConfig, WinLine } from '../types/slot-machine-config.types.ts'

export interface SlotConfigValidationResult {
    valid: boolean
    errors: string[]
    warnings: string[]
}

export function validateSlotConfig(config: unknown): SlotConfigValidationResult {

    const errors: string[] = []
    const warnings: string[] = []

    if (!config || typeof config !== 'object') {
        return {
            valid: false,
            errors: ['Configuration must be an object.'],
            warnings: []
        }
    }

    const value = config as Partial<SlotMachineConfig>

    // Basic numeric properties
    validatePositiveInteger(value.REEL_COUNT, 'REEL_COUNT', errors)

    validatePositiveInteger(value.SYMBOLS_PER_REEL, 'SYMBOLS_PER_REEL', errors)

    validatePositiveNumber(value.SYMBOL_SIZE, 'SYMBOL_SIZE', errors)

    validateNonNegativeNumber(value.REEL_SPACING, 'REEL_SPACING', errors)

    validateNonNegativeNumber(value.SPIN_DELAY, 'SPIN_DELAY', errors)

    validateNonNegativeNumber(value.STOP_SPIN_DELAY, 'STOP_SPIN_DELAY', errors)

    validatePositiveNumber(value.SPIN_DURATION, 'SPIN_DURATION', errors)

    validateNonNegativeNumber(value.CHECK_WIN_DELAY, 'CHECK_WIN_DELAY', errors)

    validatePositiveNumber(value.BET, 'BET', errors)

    // Boolean properties
    if (typeof value.HAS_FREE_SPINS !== 'boolean') {
        errors.push( 'HAS_FREE_SPINS must be a boolean.')
    }

    // Free spins
    validateNonNegativeInteger(value.NR_OF_FREE_SPINS, 'NR_OF_FREE_SPINS', errors)

    if (value.HAS_FREE_SPINS === false && value.NR_OF_FREE_SPINS !== 0) {
        errors.push('NR_OF_FREE_SPINS must be 0 when HAS_FREE_SPINS is false.')
    }

    if (value.HAS_FREE_SPINS === true && typeof value.NR_OF_FREE_SPINS === 'number' && value.NR_OF_FREE_SPINS === 0) {
        warnings.push('HAS_FREE_SPINS is enabled but NR_OF_FREE_SPINS is 0.')
    }

    // String properties
    validateString(value.SYMBOLS_TYPE, 'SYMBOLS_TYPE', errors)

    validateAvailableSymbolType(value.SYMBOLS_TYPE, 'SYMBOLS_TYPE', errors)

    validateString(value.SOUND_TYPE, 'SOUND_TYPE', errors)

    validateAvailableSoundType(value.SOUND_TYPE, 'SOUND_TYPE', errors)

    validateHexColor(value.BACKGROUND_COLOR, 'BACKGROUND_COLOR', errors)

    validateHexColor(value.FRAME_SPINE_BG_COLOR, 'FRAME_SPINE_BG_COLOR', errors)

    // Opacity
    if (
        typeof value.FRAME_SPINE_BG_COLOR_OPACITY !== 'number' ||
        !Number.isFinite(value.FRAME_SPINE_BG_COLOR_OPACITY) ||
        value.FRAME_SPINE_BG_COLOR_OPACITY < 0 ||
        value.FRAME_SPINE_BG_COLOR_OPACITY > 1
    ) {
        errors.push('FRAME_SPINE_BG_COLOR_OPACITY must be a number between 0 and 1.')
    }

    // Winlines - validation for AI generated WINLINES
    //validateWinLines(value.WINLINES, value.REEL_COUNT, value.SYMBOLS_PER_REEL, errors, warnings)

    // Winlines
    validateWinLines(value.WINLINES, 'WINLINES', errors)

    // Configuration warnings
    validateConfigurationWarnings(value, warnings)

    return {
        valid: errors.length === 0,
        errors,
        warnings
    }
}

// Helpers

function validatePositiveInteger(value: unknown, field: string, errors: string[]): void {
    if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
        errors.push(`${field} must be a positive integer.`)
    }
}

function validateNonNegativeInteger(value: unknown, field: string, errors: string[]): void {
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
        errors.push(`${field} must be a non-negative integer.`)
    }
}

function validatePositiveNumber(value: unknown, field: string, errors: string[]): void {
    if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
        errors.push(`${field} must be a positive number.`)
    }
}

function validateNonNegativeNumber(value: unknown, field: string, errors: string[]): void {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
        errors.push(`${field} must be a non-negative number.`)
    }
}

function validateString(value: unknown, field: string, errors: string[]): void {
    if (typeof value !== 'string') {
        errors.push(`${field} must be a string.`)
    }
}

function validateHexColor(value: unknown, field: string, errors: string[]): void {
    if (typeof value !== 'string' || !/^[0-9a-fA-F]{6}$/.test(value)) {
        errors.push(`${field} must be a 6-character hexadecimal color without #.`)
    }
}

function validateAvailableSymbolType(value: string | undefined, field: string, errors: string[]): void {
    if (!["defaults", "fruits", "egyptians", "sports"].includes(value)) {
        errors.push(`${field} do not support this value - ${value}.`)
    }
}

function validateAvailableSoundType(value: string | undefined, field: string, errors: string[]): void {
    if (!["defaults", "fruits", "cyberpunk", "fantasy"].includes(value)) {
        errors.push(`${field} do not support this value - ${value}.`)
    }
}

function validateWinLines(value: WinLine[] | undefined, field: string, errors: string[]): void {
    if (!Array.isArray(value)) {
        errors.push(`${field} must be a array.`)
    }
}

// Helper function for AI generated WINLINES
/*function validateWinLines(
    winLines: unknown,
    reelCount: unknown,
    symbolsPerReel: unknown,
    errors: string[],
    warnings: string[]
): void {

    if (!Array.isArray(winLines)) {
        errors.push('WINLINES must be an array.')
        return
    }

    if (typeof reelCount !== 'number' || !Number.isInteger(reelCount) || reelCount <= 0) {
        return
    }

    if (typeof symbolsPerReel !== 'number' || !Number.isInteger(symbolsPerReel) || symbolsPerReel <= 0) {
        return
    }

    const expectedLength = reelCount * symbolsPerReel
    const ids = new Set<number>()

    winLines.forEach((winLine: unknown, index: number) => {
        if (!winLine || typeof winLine !== 'object') {
            errors.push(`WINLINES[${index}] must be an object.`)
            return
        }

        const line = winLine as Partial<WinLine>

        // ID
        if (typeof line.id !== 'number' || !Number.isInteger(line.id) || line.id <= 0) {
            errors.push(`WINLINES[${index}].id must be a positive integer.`)
        } else {
            if (ids.has(line.id)) {
                errors.push(`WINLINES contains duplicate id ${line.id}.`)
            }

            ids.add(line.id)
        }

        // Line array
        if (!Array.isArray(line.line)) {
            errors.push(`WINLINES[${index}].line must be an array.`)
            return
        }

        // Line length
        if (line.line.length !== expectedLength) {
            errors.push(`WINLINES[${index}].line must contain exactly ${expectedLength} values.`)
        }

        // Line values
        for (let position = 0; position < line.line.length; position++) {
            const value = line.line[position]

            if (value !== 0 && value !== 1) {
                errors.push(`WINLINES[${index}].line[${position}] can only contain 0 or 1.`)
            }
        }

        // Active positions
        const activePositions = line.line.filter(value => value === 1).length

        if (activePositions !== reelCount) {
            errors.push(`WINLINES[${index}] must contain exactly ${reelCount} active positions.`)
        }
    })

    // Winline IDs must match array position
    winLines.forEach((winLine: unknown, index: number) => {
        if (winLine && typeof winLine === 'object') {
            const line = winLine as Partial<WinLine>
            const expectedId = index + 1

            if (line.id !== expectedId) {
                errors.push(`WINLINES[${index}].id must be ${expectedId}.`)
            }
        }
    })

    // Winline warnings
    if (winLines.length === 0) {
        warnings.push('No WINLINES are configured.')
    }

    if (winLines.length > 50) {
        warnings.push('The configuration contains a high number of WINLINES.')
    }
}
*/

// Configuration warnings
function validateConfigurationWarnings(config: Partial<SlotMachineConfig>, warnings: string[]): void {

    // Reel count
    if (typeof config.REEL_COUNT === 'number' && config.REEL_COUNT > 10) {
        warnings.push('REEL_COUNT is unusually high.')
    }

    // Symbols per reel
    if (typeof config.SYMBOLS_PER_REEL === 'number' && config.SYMBOLS_PER_REEL > 10) {
        warnings.push('SYMBOLS_PER_REEL is unusually high.')
    }

    // Symbol size
    if (typeof config.SYMBOL_SIZE === 'number' && config.SYMBOL_SIZE > 500) {
        warnings.push('SYMBOL_SIZE is unusually large.')
    }

    // Spin duration
    if (typeof config.SPIN_DURATION === 'number' && config.SPIN_DURATION > 5000) {
        warnings.push('SPIN_DURATION is unusually long.')
    }

    // Bet
    if (typeof config.BET === 'number' && config.BET > 1000) {
        warnings.push('BET is unusually high.')
    }

    // Free spins
    if (typeof config.NR_OF_FREE_SPINS === 'number' && config.NR_OF_FREE_SPINS > 50) {
        warnings.push('NR_OF_FREE_SPINS is unusually high.')
    }

    // Timing
    if (
        typeof config.SPIN_DELAY === 'number' &&
        typeof config.STOP_SPIN_DELAY === 'number' &&
        config.SPIN_DELAY + config.STOP_SPIN_DELAY > 5000
    ) {
        warnings.push('The combined spin delays are unusually long.')
    }
}