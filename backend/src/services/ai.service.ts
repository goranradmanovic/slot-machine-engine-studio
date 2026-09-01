import OpenAI from 'openai'
import { aiConfig } from '../config/ai.config.ts'
import { ApiError } from '../utils/api-error.ts'
import type { SlotMachineConfig } from '../types/slot-machine-config.types.ts'
import type { AIGenerateResponseDto } from '../dto/ai/AIGenerateResponseDto.ts'
import { buildSlotConfigPrompt } from './prompts/slot-config.builder.ts'
import { SLOT_CONFIG_SYSTEM_PROMPT } from './prompts/slot-config.prompt.ts'
import { validateSlotConfig } from '../utils/slot-config-validator.ts'
import { generateSlotConfigDiff } from '../utils/slot-config-diff.ts'
import { generateWinLines } from '../utils/winline-generator.ts'

const client = new OpenAI({ 
    apiKey: aiConfig.apiKey,
    baseURL: aiConfig.baseURL
})

export class AiService {

    static async test(): Promise<string> {
        if (!aiConfig.apiKey) throw new ApiError(500, 'Missing AI API key.')
        
        // AI 
        const completion = await client.chat.completions.create({
            model: aiConfig.model,
            messages: [{ role: 'user', content: 'Reply with exactly: AI connection successful.' }]
        })

        console.log(completion.choices[0]?.message.content)

        const content = completion.choices[0]?.message.content

        if (!content) {
            throw new ApiError(500, 'AI returned an empty response.')
        }

        return content.trim()
    }

    // Generate Slot Config
    static async generateConfig(currentConfig: SlotMachineConfig, userPrompt: string): Promise<AIGenerateResponseDto> {

        // Check API configuration
        if (!aiConfig.apiKey) throw new ApiError(500, 'Missing AI API key.')
        if (!aiConfig.model) throw new ApiError(500, 'Missing AI model configuration.')

        // Validate user input
        if (!userPrompt?.trim()) throw new ApiError(400, 'AI prompt is required.')

        // Validate current configuration
        const currentValidation = validateSlotConfig(currentConfig)

        if (!currentValidation.valid) throw new ApiError(400, `Current slot configuration is invalid: ${currentValidation.errors.join('; ')}`)

        // Build prompt
        const prompt = buildSlotConfigPrompt(currentConfig, userPrompt.trim())

        // Call AI
        let completion

        try {
            completion = await client.chat.completions.create({
                model: aiConfig.model,
                temperature: 0.2,
                messages: [
                    { role: 'system', content: SLOT_CONFIG_SYSTEM_PROMPT },
                    { role: 'user', content: prompt }
                ],
                response_format: {
                    type: 'json_object'
                }
            })
        } catch (error) {
            console.log('[AiService] AI request failed: ', error)
            throw new ApiError(502, 'AI service is currently unavailable.')
        }

        // Get response
        const content = completion.choices[0]?.message.content

        if (!content) throw new ApiError(502, 'AI returned an empty response.')

        // Parse JSON
        const parsed = this.parseAiResponse(content)

        // Validate AI response structure
        if (typeof parsed.explanation !== 'string') throw new ApiError(502, 'AI response is missing explanation.')

        if (!Array.isArray(parsed.warnings)) throw new ApiError(502, 'AI response contains invalid warnings.')

        if (!parsed.config || typeof parsed.config !== 'object') throw new ApiError(502, 'AI response contains an invalid configuration.')

        // Validate generated config
        const validation = validateSlotConfig(parsed.config)

        if (!validation.valid) {
            console.error('[AiService] Invalid AI configuration: ', validation.errors)
            throw new ApiError(502, `AI generated an invalid slot configuration: ${validation.errors.join('; ')}`)
        }

        const generatedConfig = parsed.config as SlotMachineConfig
        const changes = generateSlotConfigDiff(currentConfig, generatedConfig)
        const winlines = generateWinLines(generatedConfig.REEL_COUNT, generatedConfig.SYMBOLS_PER_REEL)

        generatedConfig.WINLINES = winlines

        const warnings = [...parsed.warnings]
        const layoutChanged = changes.some(change =>
            change.field === 'REEL_COUNT' || change.field === 'SYMBOLS_PER_REEL'
        )

        if (layoutChanged) warnings.push('Slot layout changed. Paylines were regenerated and should be reviewed before applying.')

        // Return validate results
        return {
            explanation: parsed.explanation,
            warnings: parsed.warnings,
            changes,
            config: generatedConfig
        }
    }

    // Parse AI Response
    private static parseAiResponse(content: string): Record<string, unknown> {
        
        let jsonText = content.trim() 

        // Remove Markdown code fence if AI adds one
        if (jsonText.startsWith('```')) {
            jsonText = jsonText
                        .replace(/^```(?:json)?\s*/i, '')
                        .replace(/\s*```$/i, '')
                        .trim()
        }

        // Try direct JSON parse
        try {
            return JSON.parse(jsonText)
        } catch {
            // Continue below
        }

        // Try extracting JSON object
        const firstBrace = jsonText.indexOf('{')
        const lastBrace = jsonText.indexOf('}')

        if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
            throw new ApiError(502, 'AI returned invalid JSON.')
        }

        const extracted = jsonText.substring(firstBrace, lastBrace + 1)

        try {
            return JSON.parse(extracted)
        } catch {
            throw new ApiError(502, 'AI returned invalid JSON.')
        }
    }
}