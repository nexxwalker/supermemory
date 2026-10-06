import "dotenv/config"
import { openai } from "@ai-sdk/openai"
import { createAnthropic } from "@ai-sdk/anthropic"
import {
	withEmberspack Brain,
	emberspack-brainTools,
	searchMemoriesTool,
	addMemoryTool,
	type MemoryPromptData,
} from "@emberspack-brain/tools/ai-sdk"

async function testMiddleware() {
	console.log("=== Middleware ===")

	// Basic wrapper
	const model = withEmberspack Brain(openai("gpt-4"), {
		containerTag: "user-123",
		customId: "conv-1",
	})
	console.log("✓ withEmberspack Brain basic")

	// With addMemory option
	const modelWithAdd = withEmberspack Brain(openai("gpt-4"), {
		containerTag: "user-123",
		customId: "conv-1",
		addMemory: "always",
	})
	console.log("✓ withEmberspack Brain with addMemory")

	// With verbose logging
	const modelVerbose = withEmberspack Brain(openai("gpt-4"), {
		containerTag: "user-123",
		customId: "conv-1",
		verbose: true,
	})
	console.log("✓ withEmberspack Brain with verbose")
}

async function testSearchModes() {
	console.log("\n=== Search Modes ===")

	const profileModel = withEmberspack Brain(openai("gpt-4"), {
		containerTag: "user-123",
		customId: "conv-1",
		mode: "profile",
	})
	console.log("✓ mode: profile")

	const queryModel = withEmberspack Brain(openai("gpt-4"), {
		containerTag: "user-123",
		customId: "conv-1",
		mode: "query",
	})
	console.log("✓ mode: query")

	const fullModel = withEmberspack Brain(openai("gpt-4"), {
		containerTag: "user-123",
		customId: "conv-1",
		mode: "full",
	})
	console.log("✓ mode: full")
}

async function testCustomPrompt() {
	console.log("\n=== Custom Prompt Template ===")

	const anthropic = createAnthropic({ apiKey: "test-key" })

	const claudePrompt = (data: MemoryPromptData) =>
		`
<context>
  <user_profile>${data.userMemories}</user_profile>
  <relevant_memories>${data.generalSearchMemories}</relevant_memories>
</context>
`.trim()

	const model = withEmberspack Brain(anthropic("claude-3-sonnet-20240229"), {
		containerTag: "user-123",
		customId: "conv-1",
		mode: "full",
		promptTemplate: claudePrompt,
	})
	console.log("✓ Custom prompt template")
}

async function testTools() {
	console.log("\n=== Memory Tools ===")

	// All tools
	const tools = emberspack-brainTools("YOUR_API_KEY")
	console.log("✓ emberspack-brainTools")

	// Individual tools
	const searchTool = searchMemoriesTool("API_KEY", { projectId: "personal" })
	console.log("✓ searchMemoriesTool")

	const addTool = addMemoryTool("API_KEY")
	console.log("✓ addMemoryTool")

	// Combined
	const toolsObj = {
		searchMemories: searchTool,
		addMemory: addTool,
	}
	console.log("✓ Combined tools object")
}

async function main() {
	console.log("AI SDK Integration Tests")
	console.log("========================\n")

	await testMiddleware()
	await testSearchModes()
	await testCustomPrompt()
	await testTools()

	console.log("\n========================")
	console.log("✅ All AI SDK tests passed!")
}

main().catch(console.error)
