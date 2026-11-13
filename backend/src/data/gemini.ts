import { GoogleGenAI } from "@google/genai"
import { getGeminiKey } from "../utils.js"

const ai = new GoogleGenAI({ apiKey: getGeminiKey() })
// Modeller provas i ordning. Om den första inte svarar försöker vi med nästa.
const models = [ process.env.GEMINI_MODEL || "gemini-3.6-flash", "gemini-3.8-flash" ]

const instruction = "Du sammanfattar chattkonversationer. Svara på svenska med 2-3 korta meningar. " + 
"Beskriv vad som diskuterats och eventuella beslut. Hitta inte på något."

export async function summarize(conversation: string): Promise<string> {
	let lastError: unknown 

	for (const model of models) {
		try {
			const response = await ai.models.generateContent({
				model,
				contents: conversation,
				config: { systemInstruction: instruction }
			})
			return response.text ?? ""
		} catch (error) {
			console.error(`Gemini (${model}) svarade inte:`, (error as Error).message)
			lastError = error
		}
	}
	throw lastError
}