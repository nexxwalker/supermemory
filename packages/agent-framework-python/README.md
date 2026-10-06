# Emberspack Brain Microsoft Agent Framework SDK

Memory tools and middleware for [Microsoft Agent Framework](https://github.com/microsoft/agent-framework) with [Emberspack Brain](https://emberspack-brain.ai) integration.

This package provides both **automatic memory injection middleware** and **manual memory tools** for the Microsoft Agent Framework.

## Installation

Install using uv (recommended):

```bash
uv add emberspack-brain-agent-framework
```

Or with pip:

```bash
pip install emberspack-brain-agent-framework
```

## Quick Start

### Automatic Memory Injection (Recommended)

The easiest way to add memory capabilities is using the `Emberspack BrainChatMiddleware`:

```python
import asyncio
from agent_framework.openai import OpenAIResponsesClient
from emberspack-brain_agent_framework import (
    AgentEmberspack Brain,
    Emberspack BrainChatMiddleware,
    Emberspack BrainMiddlewareOptions,
)

async def main():
    connection = AgentEmberspack Brain(
        api_key="your-emberspack-brain-api-key",
        container_tag="user-123",
    )

    middleware = Emberspack BrainChatMiddleware(
        connection,
        options=Emberspack BrainMiddlewareOptions(
            mode="full",        # "profile", "query", or "full"
            verbose=True,       # Enable logging
            add_memory="always" # Automatically save conversations
        ),
    )

    # Create agent with middleware
    agent = OpenAIResponsesClient().as_agent(
        name="MemoryAgent",
        instructions="You are a helpful assistant with memory.",
        middleware=[middleware],
    )

    # Use normally - memories are automatically injected!
    response = await agent.run(
        "What's my favorite programming language?"
    )
    print(response.text)

asyncio.run(main())
```

### Context Provider (Recommended for Sessions)

The most idiomatic way to add memory in Agent Framework, using the same pattern as the built-in Mem0 integration:

```python
import asyncio
from agent_framework import AgentSession
from agent_framework.openai import OpenAIResponsesClient
from emberspack-brain_agent_framework import AgentEmberspack Brain, Emberspack BrainContextProvider

async def main():
    connection = AgentEmberspack Brain(
        api_key="your-emberspack-brain-api-key",
        container_tag="user-123",
    )

    provider = Emberspack BrainContextProvider(
        connection,
        mode="full",
        store_conversations=True,
    )

    # Create agent with context provider
    agent = OpenAIResponsesClient().as_agent(
        name="MemoryAgent",
        instructions="You are a helpful assistant with memory.",
        context_providers=[provider],
    )

    # Use with a session - memories are automatically fetched and injected
    session = AgentSession()
    response = await agent.run(
        "What's my favorite programming language?",
        session=session,
    )
    print(response.text)

asyncio.run(main())
```

### Using Memory Tools

For explicit tool-based memory access:

```python
import asyncio
from agent_framework.openai import OpenAIResponsesClient
from emberspack-brain_agent_framework import AgentEmberspack Brain, Emberspack BrainTools

async def main():
    connection = AgentEmberspack Brain(
        api_key="your-emberspack-brain-api-key",
        container_tag="user-123",
    )
    tools = Emberspack BrainTools(connection)

    # Create agent
    agent = OpenAIResponsesClient().as_agent(
        name="MemoryAgent",
        instructions="You are a helpful assistant with access to user memories.",
    )

    # Run with memory tools
    response = await agent.run(
        "Remember that I prefer tea over coffee",
        tools=tools.get_tools(),
    )
    print(response.text)

asyncio.run(main())
```

### Combining Middleware and Tools

For maximum flexibility, use both middleware (automatic context injection) and tools (explicit memory operations):

```python
import asyncio
from agent_framework.openai import OpenAIResponsesClient
from emberspack-brain_agent_framework import (
    AgentEmberspack Brain,
    Emberspack BrainChatMiddleware,
    Emberspack BrainMiddlewareOptions,
    Emberspack BrainTools,
)

async def main():
    api_key = "your-emberspack-brain-api-key"
    connection = AgentEmberspack Brain(
        api_key=api_key,
        container_tag="user-123",
    )

    middleware = Emberspack BrainChatMiddleware(
        connection,
        options=Emberspack BrainMiddlewareOptions(mode="full"),
    )

    tools = Emberspack BrainTools(connection)

    agent = OpenAIResponsesClient().as_agent(
        name="MemoryAgent",
        instructions="You are a helpful assistant with memory.",
        middleware=[middleware],
    )

    # Middleware injects context automatically,
    # tools let the agent explicitly search/add memories
    response = await agent.run(
        "What do you remember about me?",
        tools=tools.get_tools(),
    )
    print(response.text)

asyncio.run(main())
```

## Middleware Configuration

### Memory Modes

#### `"profile"` mode (default)
Injects all static and dynamic profile memories into every request.

```python
Emberspack BrainMiddlewareOptions(mode="profile")
```

#### `"query"` mode
Searches for memories relevant to the current user message.

```python
Emberspack BrainMiddlewareOptions(mode="query")
```

#### `"full"` mode
Combines both profile and query modes.

```python
Emberspack BrainMiddlewareOptions(mode="full")
```

### Memory Storage

```python
# Always save conversations as memories
Emberspack BrainMiddlewareOptions(add_memory="always")

# Never save conversations (default)
Emberspack BrainMiddlewareOptions(add_memory="never")
```

### Complete Configuration

```python
connection = AgentEmberspack Brain(
    api_key="your-emberspack-brain-api-key",
    container_tag="user-123",               # Memory scope
    conversation_id="chat-session-456",     # Groups stored conversations
    entity_context="User is on the pro plan", # Optional fixed context
)

middleware = Emberspack BrainChatMiddleware(
    connection,
    options=Emberspack BrainMiddlewareOptions(
        verbose=True,
        mode="full",
        add_memory="always",
    ),
)
```

## API Reference

### Emberspack BrainTools

Memory tools that integrate with Agent Framework's tool system.

```python
connection = AgentEmberspack Brain(
    api_key="your-api-key",
    container_tag="user-123",
)
tools = Emberspack BrainTools(connection)

# Get FunctionTool instances for Agent.run()
agent_tools = tools.get_tools()

# Or use directly
result = await tools.search_memories("user preferences")
result = await tools.add_memory("User prefers dark mode")
result = await tools.get_profile()
```

`search_memories` uses v4 hybrid search, so results can contain either a
structured memory or a source chunk. The old Python-only `include_full_docs`
argument is deprecated and ignored because v4 search does not return full
source documents; it is not exposed to the model as a tool parameter.

### Emberspack BrainChatMiddleware

Chat middleware for automatic memory injection.

```python
middleware = Emberspack BrainChatMiddleware(
    connection,                           # Shared AgentEmberspack Brain connection
    options=Emberspack BrainMiddlewareOptions(...),
)
```

### Emberspack BrainContextProvider

Context provider for the Agent Framework session pipeline (like Mem0):

```python
provider = Emberspack BrainContextProvider(
    connection,                        # Shared AgentEmberspack Brain connection
    mode="full",                      # "profile", "query", or "full"
    store_conversations=True,         # Save conversations after each run
    context_prompt="## Memories\n...",  # Custom header for injected memories
    verbose=True,                     # Enable logging
)
```

## Error Handling

```python
from emberspack-brain_agent_framework import (
    AgentEmberspack Brain,
    Emberspack BrainConfigurationError,
    Emberspack BrainAPIError,
    Emberspack BrainNetworkError,
    Emberspack BrainMemoryOperationError,
)

try:
    connection = AgentEmberspack Brain(container_tag="user-123")
except Emberspack BrainConfigurationError as e:
    print(f"Configuration issue: {e}")
```

### Exception Types

- **`Emberspack BrainError`** - Base class for all Emberspack Brain exceptions
- **`Emberspack BrainConfigurationError`** - Missing API keys, invalid configuration
- **`Emberspack BrainAPIError`** - API request failures (includes status codes)
- **`Emberspack BrainNetworkError`** - Network connectivity issues
- **`Emberspack BrainMemoryOperationError`** - Memory search/add operation failures
- **`Emberspack BrainTimeoutError`** - Operation timeouts

## Environment Variables

- `SUPERMEMORY_API_KEY` - Your Emberspack Brain API key (required)
- `OPENAI_API_KEY` - Your OpenAI API key (required for OpenAI-based agents)

## Dependencies

### Required
- `agent-framework-core>=1.0.0rc3` - Microsoft Agent Framework
- `emberspack-brain>=3.16.0` - Emberspack Brain client with v4 hybrid search support
- `typing-extensions>=4.0.0` - Typing compatibility helpers

## Development

```bash
# Setup
cd packages/agent-framework-python
uv sync --dev

# Run tests
uv run pytest

# Type checking
uv run mypy src/emberspack-brain_agent_framework

# Formatting
uv run black src/ tests/
uv run isort src/ tests/
```

## License

MIT License - see LICENSE file for details.

## Links

- [Emberspack Brain](https://emberspack-brain.ai) - Infinite context memory platform
- [Microsoft Agent Framework](https://github.com/microsoft/agent-framework) - AI agent framework
- [Documentation](https://docs.emberspack-brain.ai) - Full API documentation
