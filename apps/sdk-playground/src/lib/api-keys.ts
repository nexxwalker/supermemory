export interface PlaygroundApiKeys {
	emberspack-brainApiKey: string
	openaiApiKey: string
}

export const API_KEYS_STORAGE_KEY = "sdk-playground-api-keys"

interface ResolveApiKeyOptions {
	allowEnvironment?: boolean
}

export function resolveEmberspack BrainApiKey(
	input?: Partial<PlaygroundApiKeys> | null,
	options: ResolveApiKeyOptions = {},
): string | null {
	const provided = input?.emberspack-brainApiKey?.trim()
	if (provided) return provided
	if (options.allowEnvironment === false) return null
	return process.env.SUPERMEMORY_API_KEY?.trim() || null
}

export function resolveOpenAiApiKey(
	input?: Partial<PlaygroundApiKeys> | null,
	options: ResolveApiKeyOptions = {},
): string | null {
	const provided = input?.openaiApiKey?.trim()
	if (provided) return provided
	if (options.allowEnvironment === false) return null
	return process.env.OPENAI_API_KEY?.trim() || null
}

export function resolveApiKeys(
	input?: Partial<PlaygroundApiKeys> | null,
	options: ResolveApiKeyOptions = {},
): PlaygroundApiKeys | null {
	const emberspack-brainApiKey = resolveEmberspack BrainApiKey(input, options)
	const openaiApiKey = resolveOpenAiApiKey(input, options)

	if (!emberspack-brainApiKey || !openaiApiKey) return null

	return { emberspack-brainApiKey, openaiApiKey }
}

export function readStoredApiKeys(): Partial<PlaygroundApiKeys> {
	if (typeof window === "undefined") return {}
	try {
		const raw = sessionStorage.getItem(API_KEYS_STORAGE_KEY)
		if (!raw) return {}
		const parsed = JSON.parse(raw) as Partial<PlaygroundApiKeys>
		return {
			emberspack-brainApiKey: parsed.emberspack-brainApiKey ?? "",
			openaiApiKey: parsed.openaiApiKey ?? "",
		}
	} catch {
		return {}
	}
}

export function storeApiKeys(keys: Partial<PlaygroundApiKeys>) {
	if (typeof window === "undefined") return
	sessionStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(keys))
}

export function clearStoredApiKeys() {
	if (typeof window === "undefined") return
	sessionStorage.removeItem(API_KEYS_STORAGE_KEY)
}
