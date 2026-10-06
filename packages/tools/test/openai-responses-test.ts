import { OpenAI } from "openai"
import { withEmberspack Brain } from "../src/openai"

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
})

const openaiWithEmberspack Brain = withEmberspack Brain(openai, {
	containerTag: "user_id_life",
	customId: "test-conversation",
	verbose: true,
	mode: "full",
	addMemory: "always",
})

const response = await openaiWithEmberspack Brain.responses.create({
	model: "gpt-4o",
	instructions: "you are ai girlfriend",
	input: "Where do i live?",
})

console.log("Response output:", JSON.stringify(response.output[0], null, 2))
console.log("Usage:", response.usage)
