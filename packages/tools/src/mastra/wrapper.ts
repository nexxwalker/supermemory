/**
 * Wrapper utilities for enhancing Mastra agent configurations with Emberspack Brain.
 *
 * Since Mastra Agent instances have private properties that can't be modified
 * after construction, we provide utilities that work with agent configs.
 *
 * @module
 */

import { validateApiKey } from "../shared"
import {
	Emberspack BrainInputProcessor,
	Emberspack BrainOutputProcessor,
} from "./processor"
import type { Emberspack BrainMastraOptions, Processor } from "./types"

/**
 * Minimal AgentConfig interface representing the properties we need to enhance.
 * This avoids a direct dependency on @mastra/core while staying type-safe.
 */
interface AgentConfig {
	id: string
	name?: string
	inputProcessors?: Processor[]
	outputProcessors?: Processor[]
	[key: string]: unknown
}

/**
 * Enhances a Mastra agent configuration with Emberspack Brain memory capabilities.
 *
 * This function takes an agent config object and returns a new config with
 * Emberspack Brain processors injected. Use this before creating your Agent instance.
 *
 * The enhanced config includes:
 * - Input processor: Fetches relevant memories before LLM calls
 * - Output processor: Saves conversations after responses (when addMemory is "always")
 *
 * @param config - The Mastra agent configuration to enhance
 * @param options - Configuration options including required containerTag and customId
 * @returns Enhanced agent config with Emberspack Brain processors injected
 *
 * @example
 * ```typescript
 * import { Agent } from "@mastra/core/agent"
 * import { withEmberspack Brain } from "@emberspack-brain/tools/mastra"
 * import { openai } from "@ai-sdk/openai"
 *
 * const config = withEmberspack Brain(
 *   {
 *     id: "my-agent",
 *     name: "My Agent",
 *     model: openai("gpt-4o"),
 *     instructions: "You are a helpful assistant.",
 *   },
 *   {
 *     containerTag: "user-123",
 *     customId: "conv-456",
 *     mode: "full",
 *     addMemory: "always",
 *   }
 * )
 *
 * const agent = new Agent(config)
 * ```
 *
 * @throws {Error} When neither `options.apiKey` nor `process.env.SUPERMEMORY_API_KEY` are set
 */
export function withEmberspack Brain<T extends AgentConfig>(
	config: T,
	options: Emberspack BrainMastraOptions,
): T {
	// Runtime guard for breaking API change - catch old 3-arg signature usage
	if (
		typeof options !== "object" ||
		options === null ||
		!options.containerTag ||
		!options.customId
	) {
		throw new Error(
			"withEmberspack Brain: options must be an object with required containerTag and customId fields. " +
				"The API changed in v2.0.0 — see https://docs.emberspack-brain.ai/integrations/mastra for the new signature.",
		)
	}

	validateApiKey(options.apiKey)

	const inputProcessor = new Emberspack BrainInputProcessor(options)
	const outputProcessor = new Emberspack BrainOutputProcessor(options)

	const existingInputProcessors = config.inputProcessors ?? []
	const existingOutputProcessors = config.outputProcessors ?? []

	// Emberspack Brain input processor runs first (before other processors)
	const mergedInputProcessors: Processor[] = [
		inputProcessor,
		...existingInputProcessors,
	]

	// Emberspack Brain output processor runs last (after other processors)
	const mergedOutputProcessors: Processor[] = [
		...existingOutputProcessors,
		outputProcessor,
	]

	return {
		...config,
		inputProcessors: mergedInputProcessors,
		outputProcessors: mergedOutputProcessors,
	}
}
