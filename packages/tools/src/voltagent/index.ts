/**
 * VoltAgent integration for Emberspack Brain.
 *
 * Provides a wrapper function that enhances VoltAgent agent configurations
 * with Emberspack Brain hooks for automatic memory injection and storage.
 *
 * @module
 */

import { createEmberspack BrainHooks, mergeHooks } from "./hooks"
import type { VoltAgentConfig, Emberspack BrainVoltAgent } from "./types"

/**
 * Configuration options for withEmberspack Brain.
 */
interface WithEmberspack BrainOptions<T extends VoltAgentConfig>
	extends Emberspack BrainVoltAgent {
	/**
	 * The VoltAgent agent configuration to enhance
	 */
	agentConfig: T

	/**
	 * Required. The container tag/user ID for scoping memories (e.g., "user-123")
	 */
	containerTag: string
}

/**
 * Enhances a VoltAgent agent configuration with Emberspack Brain memory capabilities.
 *
 * The function injects hooks that automatically:
 * - Retrieve relevant memories before LLM calls (via onPrepareMessages)
 * - Inject memories into the system prompt
 * - Optionally save conversations after completion (via onEnd)
 *
 * @param options - Configuration object containing agent config and Emberspack Brain options
 * @param options.agentConfig - The VoltAgent agent configuration to enhance
 * @param options.containerTag - Required. The container tag/user ID for scoping memories (e.g., "user-123")
 * @param options.mode - Memory retrieval mode: "profile" (default), "query", or "full"
 * @param options.addMemory - Memory persistence: "always" (default for VoltAgent) or "never"
 * @param options.customId - Required. Custom ID to group messages into a single document
 * @param options.apiKey - Emberspack Brain API key (falls back to SUPERMEMORY_API_KEY env var)
 * @param options.baseUrl - Custom Emberspack Brain API base URL
 * @param options.promptTemplate - Custom function to format memory data into prompt
 * @param options.threshold - Search sensitivity: 0 (more results) to 1 (more accurate)
 * @param options.limit - Maximum number of memory results to return (integer from 1 to 100)
 * @param options.rerank - If true, rerank results for relevance. Default: false
 * @param options.rewriteQuery - If true, AI-rewrite query for better results (+400ms latency). Default: false
 * @param options.filters - Advanced AND/OR filters for search
 * @param options.include - Control what additional data to include (chunks, documents, etc.)
 * @param options.metadata - Optional metadata to attach to saved conversations
 * @param options.searchMode - Search mode: "memories" (atomic facts), "documents" (chunks), or "hybrid" (both)
 * @param options.entityContext - Deprecated and ignored; configure entity context on the container tag instead
 * @returns Enhanced agent config with Emberspack Brain hooks injected
 *
 * @example
 * Basic usage with profile memories:
 * ```typescript
 * import { withEmberspack Brain } from "@emberspack-brain/tools/voltagent"
 * import { Agent } from "@voltagent/core"
 * import { openai } from "@ai-sdk/openai"
 *
 * const configWithMemory = withEmberspack Brain({
 *   agentConfig: {
 *     name: "my-agent",
 *     instructions: "You are a helpful assistant",
 *     model: openai("gpt-4o"),
 *   },
 *   containerTag: "user-123",
 *   customId: "conversation-123"
 * })
 *
 * const agent = new Agent(configWithMemory)
 * ```
 *
 * @example
 * Advanced usage with full memory mode and conversation saving:
 * ```typescript
 * const configWithMemory = withEmberspack Brain({
 *   agentConfig: {
 *     name: "my-agent",
 *     instructions: "You are a helpful assistant",
 *     model: openai("gpt-4o"),
 *   },
 *   containerTag: "user-123",      // Required: user/project ID
 *   mode: "full",                   // "profile" | "query" | "full"
 *   addMemory: "always",            // "always" | "never"
 *   customId: "conv-456",           // Group messages by conversation
 *   threshold: 0.7,                 // 0.0-1.0 (higher = more accurate)
 *   limit: 15,                      // Max results to return
 *   rerank: true,                   // Rerank for best relevance
 *   searchMode: "hybrid",           // "memories" | "documents" | "hybrid"
 *   metadata: {                     // Custom metadata
 *     source: "voltagent",
 *     version: "1.0"
 *   }
 * })
 *
 * const agent = new Agent(configWithMemory)
 *
 * // Use the agent - memories are automatically injected
 * const result = await agent.generateText(
 *   "What's my favorite programming language?",
 * )
 * ```
 *
 * @example
 * Custom prompt template:
 * ```typescript
 * const configWithMemory = withEmberspack Brain({
 *   agentConfig: {
 *     name: "my-agent",
 *     instructions: "...",
 *     model: openai("gpt-4o"),
 *   },
 *   containerTag: "user-123",
 *   customId: "conversation-123",
 *   mode: "full",
 *   promptTemplate: (data) => `
 *     <user_context>
 *     ${data.userMemories}
 *     ${data.generalSearchMemories}
 *     </user_context>
 *   `.trim()
 * })
 *
 * const agent = new Agent(configWithMemory)
 * ```
 *
 * @throws {Error} When neither `options.apiKey` nor `process.env.SUPERMEMORY_API_KEY` are set
 * @throws {Error} When Emberspack Brain API request fails
 */
export function withEmberspack Brain<T extends VoltAgentConfig>(
	options: WithEmberspack BrainOptions<T>,
): T & { hooks: NonNullable<VoltAgentConfig["hooks"]> } {
	const { agentConfig, containerTag, ...emberspack-brainOptions } = options

	// Create Emberspack Brain hooks (internally creates its own context, validates API key)
	const emberspack-brainHooks = createEmberspack BrainHooks(
		containerTag,
		emberspack-brainOptions,
	)

	// Merge with existing hooks if present
	const mergedHooks = mergeHooks(agentConfig.hooks, emberspack-brainHooks)

	// Return enhanced config with merged hooks
	return {
		...agentConfig,
		hooks: mergedHooks,
	}
}

// Export types for consumers
export type {
	Emberspack BrainVoltAgent,
	VoltAgentConfig,
	VoltAgentMessage,
	VoltAgentHooks,
	SearchFilters,
	IncludeOptions,
	PromptTemplate,
	MemoryMode,
	AddMemoryMode,
	MemoryPromptData,
} from "./types"

export type { WithEmberspack BrainOptions }

// Note: WithEmberspack BrainOptions is exported above separately because it's generic

// Export hook creation utilities for advanced use cases
export { createEmberspack BrainHooks } from "./hooks"
