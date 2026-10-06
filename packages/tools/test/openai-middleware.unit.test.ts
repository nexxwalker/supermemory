import type OpenAI from "openai"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { withEmberspack Brain } from "../src/openai"

describe("OpenAI middleware memory context", () => {
	const originalApiKey = process.env.SUPERMEMORY_API_KEY

	beforeEach(() => {
		process.env.SUPERMEMORY_API_KEY = "sm_test_key"
	})

	afterEach(() => {
		if (originalApiKey === undefined) delete process.env.SUPERMEMORY_API_KEY
		else process.env.SUPERMEMORY_API_KEY = originalApiKey
		vi.unstubAllGlobals()
	})

	it("replaces prior SDK context in chat system messages", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				json: async () => ({
					profile: { static: [{ memory: "Fresh profile fact" }], dynamic: [] },
					searchResults: { results: [] },
				}),
			}),
		)
		const originalCreate = vi.fn(() =>
			Object.assign(Promise.resolve({ choices: [] }), {
				asResponse: async () => new Response(),
			}),
		)
		const client = {
			chat: { completions: { create: originalCreate } },
		} as unknown as OpenAI
		const wrapped = withEmberspack Brain(client, {
			containerTag: "user-a",
			customId: "conversation-a",
			mode: "profile",
			addMemory: "never",
		})

		await wrapped.chat.completions.create({
			model: "gpt-4o-mini",
			messages: [
				{
					role: "system",
					content:
						'Be helpful.\n\n<emberspack-brain context="user-memories" readonly>\nStale profile fact\n</emberspack-brain>',
				},
				{ role: "user", content: "What do you remember?" },
			],
		})

		const forwarded = originalCreate.mock.calls[0]?.[0]
		const content = String(forwarded.messages[0].content)
		expect(content).toContain("Be helpful.")
		expect(content).toContain("Fresh profile fact")
		expect(content).not.toContain("Stale profile fact")
		expect(
			content.match(/<emberspack-brain context="user-memories" readonly>/g),
		).toHaveLength(1)
	})
})
