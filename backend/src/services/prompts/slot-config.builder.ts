import type { SlotMachineConfig } from '../../types/slot-machine-config.types.ts'

export function buildSlotConfigPrompt(currentConfig: SlotMachineConfig, userPrompt: string): string {

    return `
        ========================
        CURRENT CONFIGURATION
        ========================

        ${JSON.stringify(currentConfig, null, 2)}

        ========================
        USER REQUEST
        ========================

        ${userPrompt}

        ========================
        TASK
        ========================

        Modify the current configuration according to the user's request.

        IMPORTANT:

        - Return the complete configuration.
        - Preserve values the user did not request to change.
        - If REEL_COUNT changes, update WINLINES.
        - If SYMBOLS_PER_REEL changes, update WINLINES.
        - Every WINLINES.line must contain exactly: REEL_COUNT * SYMBOLS_PER_REEL values.
        - Every WINLINES.line value must be 0 or 1.
        - WINLINE ids must start at 1 and be sequential.
        - Do not add unsupported properties.
        - Do not remove required properties.

        Return ONLY the JSON object.

        Do not use Markdown.
        Do not use code fences.
        Do not include explanations outside the JSON object.
    `
}