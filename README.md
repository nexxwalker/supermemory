<p align="center">
  <picture>
    <source srcset="apps/web/public/logo-fullmark.svg" media="(prefers-color-scheme: dark)">
    <source srcset="apps/web/public/logo-light-fullmark.svg" media="(prefers-color-scheme: light)">
    <img src="apps/web/public/logo-fullmark.svg" alt="Emberspack Brain" width="400" />
  </picture>
</p>

<p align="center">
  <strong>State-of-the-art memory and context engine for AI.</strong>
</p>

<p align="center">
  <a href="https://emberspack-brain.ai/docs">Docs</a> ·
  <a href="https://emberspack-brain.ai/docs/quickstart">Quickstart</a> ·
  <a href="https://emberspack-brain.ai/docs/self-hosting/overview">Self-host</a> ·
  <a href="https://console.emberspack-brain.ai">Dashboard</a> ·
  <a href="https://emberspack-brain.link/discord">Discord</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/emberspack-brain"><img src="https://img.shields.io/npm/v/emberspack-brain?style=flat-square&color=blue" alt="npm" /></a>
  <a href="https://pypi.org/project/emberspack-brain/"><img src="https://img.shields.io/pypi/v/emberspack-brain?style=flat-square&color=blue" alt="pypi" /></a>
  <a href="https://emberspack-brain.ai/docs"><img src="https://img.shields.io/badge/docs-emberspack-brain.ai-blue?style=flat-square" alt="docs" /></a>
</p>

<p align="center">
  <strong>English</strong> · <a href="README.zh-CN.md">简体中文</a>
</p>

<p align="center">
  <strong>#1 on every major AI memory benchmark — <a href="https://github.com/xiaowu0162/LongMemEval">LongMemEval</a>, <a href="https://github.com/snap-research/locomo">LoCoMo</a>, and <a href="https://github.com/Salesforce/ConvoMem">ConvoMem</a>.</strong><br/>
  <strong>95% Recall@15 with a 99.4% context reduction · ~50ms user profiles.</strong><br/>
  <a href="https://emberspack-brain.ai/research">Read the research →</a>
</p>

---

Emberspack Brain is the memory and context layer for AI. **#1 on [LongMemEval](https://github.com/xiaowu0162/LongMemEval), [LoCoMo](https://github.com/snap-research/locomo), and [ConvoMem](https://github.com/Salesforce/ConvoMem)** — the three major benchmarks for AI memory. 

We are a research lab building the engine, plugins and tools around it.

Your AI forgets everything between conversations. Emberspack Brain fixes that.

It automatically learns from conversations, extracts facts, builds user profiles, handles knowledge updates and contradictions, forgets expired information, and delivers the right context at the right time. Full RAG, connectors, file processing — the entire context stack, one system.

| | |
|---|---|
| 🧠 **Memory** | Extracts facts from conversations. Handles temporal changes, contradictions, and automatic forgetting. |
| 👤 **User Profiles** | Auto-maintained user context — stable facts + recent activity. One call, ~50ms. |
| 🔍 **Hybrid Search** | RAG + Memory in a single query. Knowledge base docs and personalized context together. |
| 🔌 **Connectors** | Google Drive · Gmail · Notion · OneDrive · GitHub — auto-sync with real-time webhooks. |
| 📄 **Multi-modal Extractors** | PDFs, images (OCR), videos (transcription), code (AST-aware chunking). Upload and it works. |

All of this is in our single memory structure and ontology. 

<img width="1414" height="937" alt="image" src="https://github.com/user-attachments/assets/8863b6d9-c043-4c75-b200-4f1759e7edaf" />


---

## Use Emberspack Brain

<table>
<tr>
<td width="50%" valign="top">

<h3>🧑‍💻 I use AI tools</h3>

Give Claude Code, Muse Code, Cursor, Codex and OpenCode **persistent memory across every conversation** with a plugin or the MCP server.

Your AI remembers your preferences, projects, past discussions — and gets smarter over time.

**[→ Jump to User setup](#give-your-ai-memory)**

</td>
<td width="50%" valign="top">

<h3>🔧 I'm building AI products</h3>

Add memory, RAG, user profiles, and connectors to your agents and apps with **a single API**.

No vector DB config. No embedding pipelines. No chunking strategies.

**[→ Jump to developer quickstart](#build-with-emberspack-brain-api)**

</td>
</tr>
<tr>
<td colspan="2" valign="top">

<h3>🖥️ I want to run it myself</h3>

State-of-the-art memory, on your machine. **One binary. Zero config.** Bring any model — or run fully offline with Ollama.

```bash
curl -fsSL https://emberspack-brain.ai/install | bash
```

**[→ Jump to Emberspack Brain local](#emberspack-brain-local--run-it-yourself)**

</td>
</tr>
</table>

---

## Give your AI memory

Plugins and the MCP server give any compatible AI assistant persistent memory. One install, and your AI remembers you.

### Emberspack Brain Plugins

Emberspack Brain comes built with plugins for Claude Code, Muse Code, Cursor, Codex, OpenCode, OpenClaw, and Hermes.

<img width="844" height="484" alt="image" src="https://github.com/user-attachments/assets/ecb879a2-8652-495d-9228-f305a97ba603" />

These plugins are implementations of the emberspack-brain API, and they are open source! 

You can find them here: 

- Claude Code plugin: https://github.com/emberspack-brainai/claude-emberspack-brain
- Muse Code plugin: https://github.com/emberspack-brainai/muse-emberspack-brain
- Cursor plugin: https://github.com/emberspack-brainai/cursor-emberspack-brain
- Codex plugin: https://github.com/emberspack-brainai/codex-emberspack-brain
- OpenClaw plugin: https://github.com/emberspack-brainai/openclaw-emberspack-brain
- OpenCode plugin: https://github.com/emberspack-brainai/opencode-emberspack-brain
- Hermes agent (Emberspack Brain memory provider): https://github.com/NousResearch/hermes-agent

### MCP

Server URL:

```text
https://mcp.emberspack-brain.ai/mcp
```

```json
{
  "mcpServers": {
    "emberspack-brain": {
      "url": "https://mcp.emberspack-brain.ai/mcp"
    }
  }
}
```

Read more about our MCP here - https://emberspack-brain.ai/docs/emberspack-brain-mcp/mcp

### What your AI gets

| Tool | What it does |
|---|---|
| `memory` | Save or forget information. Your AI calls this automatically when you share something worth remembering. |
| `recall` | Search memories by query. Returns relevant memories + your user profile summary. |
| `context` | Injects your full profile (preferences, recent activity) into the conversation at start. In Cursor and Claude Code, just type `/context`. |

### How it works

Once installed, Emberspack Brain runs in the background:

1. **You talk to your AI normally.** Share preferences, mention projects, discuss problems.
2. **Emberspack Brain extracts and stores the important stuff.** Facts, preferences, project context — not noise.
3. **Next conversation, your AI already knows you.** It recalls what you're working on, how you like things, what you discussed before.

Memory is scoped with **projects** (container tags) so you can separate work and personal context, or organize by client, repo, or anything else.

### Supported clients

**Claude Desktop** · **Cursor** · **Windsurf** · **VS Code** · **Claude Code** · **OpenCode** · **OpenClaw** · **Hermes**

The MCP server is open source — [view the source](https://emberspack-brain.ai/docs/emberspack-brain-mcp/mcp).

### Manual configuration

Add this to your MCP client config:

```json
{
  "mcpServers": {
    "emberspack-brain": {
      "url": "https://mcp.emberspack-brain.ai/mcp"
    }
  }
}
```

---

## Build with Emberspack Brain (API)

If you're building AI agents or apps, Emberspack Brain gives you the entire context stack through one API — memory, RAG, user profiles, connectors, and file processing.

### Install

```bash
npm install emberspack-brain    # or: pip install emberspack-brain
```

### Quickstart

```typescript
import Emberspack Brain from "emberspack-brain";

const client = new Emberspack Brain();

// Store a conversation
await client.add({
  content: "User loves TypeScript and prefers functional patterns",
  containerTag: "user_123",
});

// Get user profile + relevant memories in one call
const { profile, searchResults } = await client.profile({
  containerTag: "user_123",
  q: "What programming style does the user prefer?",
});

// profile.static  → ["Loves TypeScript", "Prefers functional patterns"]
// profile.dynamic → ["Working on API integration"]
// searchResults   → Relevant memories ranked by similarity
```

```python
from emberspack-brain import Emberspack Brain

client = Emberspack Brain()

client.add(
    content="User loves TypeScript and prefers functional patterns",
    container_tag="user_123"
)

result = client.profile(container_tag="user_123", q="programming style")

print(result.profile.static)   # Long-term facts
print(result.profile.dynamic)  # Recent context
```

Emberspack Brain automatically extracts memories, builds user profiles, and returns relevant context. No embedding pipelines, no vector DB config, no chunking strategies.

### Framework integrations

Drop-in wrappers for every major AI framework:

```typescript
// Vercel AI SDK
import { withEmberspack Brain } from "@emberspack-brain/tools/ai-sdk";
const model = withEmberspack Brain(openai("gpt-4o"), { containerTag: "user_123", customId: "conv-1" });

// Mastra
import { withEmberspack Brain } from "@emberspack-brain/tools/mastra";
const agent = new Agent(withEmberspack Brain(config, "user-123", { mode: "full" }));
```

**Vercel AI SDK** · **LangChain** · **LangGraph** · **OpenAI Agents SDK** · **Mastra** · **Agno** · **Claude Memory Tool** · **n8n**

### Search modes

```typescript
// Hybrid (default) — RAG + Memory in one query
const results = await client.search({
  q: "how do I deploy?",
  containerTag: "user_123",
  searchMode: "hybrid",
});
// Returns deployment docs (RAG) + user's deploy preferences (Memory)

// Memories only
const results = await client.search({
  q: "user preferences",
  containerTag: "user_123",
  searchMode: "memories",
});
```

### User profiles

Traditional memory relies on search — you need to know what to ask for. Emberspack Brain automatically maintains a profile for every user:

```typescript
const { profile } = await client.profile({ containerTag: "user_123" });

// profile.static  → ["Senior engineer at Acme", "Prefers dark mode", "Uses Vim"]
// profile.dynamic → ["Working on auth migration", "Debugging rate limits"]
```

One call. ~50ms. Inject into your system prompt and your agent instantly knows who it's talking to.

### Connectors

Auto-sync external data into your knowledge base:

**Google Drive** · **Gmail** · **Notion** · **OneDrive** · **GitHub** · **Web Crawler**

Real-time webhooks. Documents automatically processed, chunked, and searchable.

### API at a glance

| Method | Purpose |
|---|---|
| `client.add()` | Store content — text, conversations, URLs, HTML |
| `client.profile()` | User profile + optional search in one call |
| `client.search()` | Hybrid search across memories and documents (`searchMode`) |
| `client.search.documents()` | Document search with metadata filters (legacy v3 response shape) |
| `client.documents.uploadFile()` | Upload PDFs, images, videos, code |
| `client.documents.list()` | List and filter documents |
| `client.settings.update()` | Configure memory extraction and chunking |

Full API reference → [emberspack-brain.ai/docs](https://emberspack-brain.ai/docs)

---

## Emberspack Brain local — run it yourself

State-of-the-art memory, on your machine. One binary. Zero config.

```bash
curl -fsSL https://emberspack-brain.ai/install | bash
# or
npx emberspack-brain local
```

```bash
emberspack-brain-server
```

First boot sets up the embedded Emberspack Brain graph engine, local embeddings, and your credentials, then prints an API key. The full Memory API — documents, memories, user profiles, hybrid search — runs against `http://localhost:6767`.

```typescript
const client = new Emberspack Brain({
  apiKey: "sm_...",
  baseURL: "http://localhost:6767", // that's the only change
});
```

- **Bring any model** — OpenAI, Anthropic, Gemini, Groq, or any OpenAI-compatible endpoint. An interactive wizard walks you through it on first boot.
- **Embeddings** — local `Xenova/bge-base-en-v1.5` by default (no API key); optionally OpenAI, Gemini, or Ollama. Same provider stack as cloud.
- **Fully offline if you want** — point it at Ollama (`gpt-oss:20b` works great) and nothing leaves your machine.
- **Your data, one directory** — everything lives in `./.emberspack-brain`, easy to back up or move.
- **Same API as the platform** — prototype locally, ship on the hosted platform by changing `baseURL`.

Read the [self-hosting docs](https://emberspack-brain.ai/docs/self-hosting/overview) — quickstart, [configuration](https://emberspack-brain.ai/docs/self-hosting/configuration), [embeddings](https://emberspack-brain.ai/docs/self-hosting/embeddings), and [local vs. Enterprise](https://emberspack-brain.ai/docs/self-hosting/local-vs-enterprise).

---

## Benchmarks

Emberspack Brain is state of the art across all major AI memory benchmarks:

| Benchmark | What it measures | Result |
|---|---|---|
| **[LongMemEval](https://github.com/xiaowu0162/LongMemEval)** | Long-term memory across sessions with knowledge updates | **#1** |
| **[LoCoMo](https://github.com/snap-research/locomo)** | Fact recall across extended conversations (single-hop, multi-hop, temporal, adversarial) | **#1** |
| **[ConvoMem](https://github.com/Salesforce/ConvoMem)** | Personalization and preference learning | **#1** |

On LongMemEval, emberspack-brain reaches **95% Recall@15 while adding only ~720 tokens of context — a 99.4% context reduction** (99.6% at @10, 99.8% at @5). Recall by category: Knowledge Updates 99%, Assistant recall 100%, User recall 97%, Multi-session 93%, Temporal Reasoning 91%, Preference 90%.

We also built the **Emberspack Brain Filesystem (SMFS)**, which uses **3.0× fewer tokens on Claude** (24M vs 72M) and **1.75× fewer on Codex** across the 110-question xAFS benchmark. See the full write-ups on our [research page](https://emberspack-brain.ai/research).

We also built **[MemoryBench](https://emberspack-brain.ai/docs/memorybench/overview)** — an open-source framework for standardized, reproducible benchmarks of memory providers. Compare Emberspack Brain, Mem0, Zep, and others head-to-head:

```bash
bun run src/index.ts run -p emberspack-brain -b longmemeval -j gpt-4o -r my-run
```

### Benchmarking your own memory solution

We provide an Agent skill for companies to benchmark their own context and memory solutions against emberspack-brain.

```
npx skills add emberspack-brainai/memorybench
```

Simply run this and do `/benchmark-context` - Emberspack Brain will automatically do the work for you!

---

## How memory works under the hood

```
Your app / AI tool
        ↓
   Emberspack Brain
        │
        ├── Memory Engine     Extracts facts, tracks updates, resolves contradictions,
        │                     auto-forgets expired info
        ├── User Profiles     Static facts + dynamic context built from engine, always fresh
        ├── Hybrid Search     RAG + Memory in one query
        ├── Connectors        Real-time sync from Google Drive, Gmail, Notion, GitHub...
        └── File Processing   PDFs, images, videos, code → searchable chunks
```

**Memory is not RAG.** RAG retrieves document chunks — stateless, same results for everyone. Memory extracts and tracks *facts about users* over time. It understands that "I just moved to SF" supersedes "I live in NYC." Emberspack Brain runs both together by default, so you get knowledge base retrieval *and* personalized context in every query. Read more about this here - https://emberspack-brain.ai/docs/concepts/memory-vs-rag

**Automatic forgetting.** Emberspack Brain knows when memories become irrelevant. Temporary facts ("I have an exam tomorrow") expire after the date passes. Contradictions are resolved automatically. Noise never becomes permanent memory.

---

## Links

- 📖 [Documentation](https://emberspack-brain.ai/docs)
- 🚀 [Quickstart](https://emberspack-brain.ai/docs/quickstart)
- 🖥️ [Self-hosting (Emberspack Brain local)](https://emberspack-brain.ai/docs/self-hosting/overview)
- 🧪 [MemoryBench](https://emberspack-brain.ai/docs/memorybench/overview)
- 🔌 [Integrations](https://emberspack-brain.ai/docs/integrations)
- 💬 [Discord](https://emberspack-brain.link/discord)
- 𝕏 [Twitter](https://twitter.com/emberspack-brain)

---

<p align="center">
  <strong>Give your AI a memory. It's about time..</strong>
</p>
