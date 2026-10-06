export const MEMORY_CONTEXT_START =
	'<emberspack-brain context="user-memories" readonly>'
export const MEMORY_CONTEXT_END = "</emberspack-brain>"

const MEMORY_CONTEXT_PATTERN =
	/(?:\r?\n)?<emberspack-brain context="user-memories" readonly>[\s\S]*?<\/emberspack-brain>/g

const SUPERMEMORY_TAG_PATTERN = /<\s*\/?\s*emberspack-brain\b[^>]*>/gi

/** Prevent retrieved text from terminating or nesting the SDK-owned block. */
function escapeMemoryContextDelimiters(memories: string): string {
	return memories.replace(SUPERMEMORY_TAG_PATTERN, (tag) =>
		tag.replace("<", "&lt;").replace(">", "&gt;"),
	)
}

/** Remove every context block previously owned by the Emberspack Brain middleware. */
export function stripMemoryContext(content: string): string {
	return content.replace(MEMORY_CONTEXT_PATTERN, "")
}

/** Mark retrieved memory context so a later turn can replace it safely. */
export function wrapMemoryContext(memories: string): string {
	const normalized = memories.trim()
	if (!normalized) return ""
	const escaped = escapeMemoryContextDelimiters(normalized)
	return `${MEMORY_CONTEXT_START}\n${escaped}\n${MEMORY_CONTEXT_END}`
}

/** Replace prior middleware context while preserving caller-authored instructions. */
export function replaceMemoryContext(
	content: string,
	memories: string,
): string {
	const preserved = stripMemoryContext(content)
	const memoryContext = wrapMemoryContext(memories)
	if (!memoryContext) return preserved
	// The newline belongs to the SDK-owned block and is removed with it, so caller
	// whitespace round-trips while Markdown/XML boundaries remain valid.
	return preserved ? `${preserved}\n${memoryContext}` : memoryContext
}
