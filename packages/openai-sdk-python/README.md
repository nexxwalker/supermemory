# Emberspack Brain OpenAI Python SDK

Memory tools and middleware for OpenAI with Emberspack Brain integration.

This package provides both **automatic memory injection middleware** and **manual memory tools** for the official [OpenAI Python SDK](https://github.com/openai/openai-python) using [Emberspack Brain](https://emberspack-brain.ai) capabilities.

## Installation

Install using uv (recommended):

```bash
uv add emberspack-brain-openai-sdk
```

Or with pip:

```bash
pip install emberspack-brain-openai-sdk
```

For async HTTP support (recommended):

```bash
uv add emberspack-brain-openai-sdk[async]
# or
pip install 'emberspack-brain-openai-sdk[async]'
```

## Quick Start

### Automatic Memory Injection (Recommended)

The easiest way to add memory capabilities to your OpenAI client is using the `with_emberspack-brain()` wrapper:

```python
import asyncio
from openai import AsyncOpenAI
from emberspack-brain_openai import with_emberspack-brain, OpenAIMiddlewareOptions

async def main():
    # Create OpenAI client
    openai = AsyncOpenAI(api_key="your-openai-api-key")

    # Wrap with Emberspack Brain middleware
    openai_with_memory = with_emberspack-brain(
        openai,
        OpenAIMiddlewareOptions(
            container_tag="user-123",  # Required: unique identifier for user's memories
            custom_id="chat-123",      # Required: groups messages into documents
            mode="full",               # "profile", "query", or "full"
            verbose=True,              # Enable logging
            add_memory="always",       # Automatically save conversations (default)
            api_key="your-emberspack-brain-api-key",  # Or use SUPERMEMORY_API_KEY
            # base_url="https://api.emberspack-brain.ai",  # Optional custom endpoint
        )
    )

    # Use normally - memories are automatically injected!
    response = await openai_with_memory.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": "What's my favorite programming language?"}
        ]
    )

    print(response.choices[0].message.content)

asyncio.run(main())
```

### Using Memory Tools with OpenAI

```python
import asyncio
import openai
from emberspack-brain_openai import Emberspack BrainTools, execute_memory_tool_calls

async def main():
    # Initialize OpenAI client
    client = openai.AsyncOpenAI(api_key="your-openai-api-key")

    # Initialize Emberspack Brain tools
    tools = Emberspack BrainTools(
        api_key="your-emberspack-brain-api-key",
        config={"project_id": "my-project"}
    )

    # Chat with memory tools
    response = await client.chat.completions.create(
        model="gpt-5",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant with access to user memories."
            },
            {
                "role": "user",
                "content": "Remember that I prefer tea over coffee"
            }
        ],
        tools=tools.get_tool_definitions()
    )

    # Handle tool calls if present
    if response.choices[0].message.tool_calls:
        tool_results = await execute_memory_tool_calls(
            api_key="your-emberspack-brain-api-key",
            tool_calls=response.choices[0].message.tool_calls,
            config={"project_id": "my-project"}
        )
        print("Tool results:", tool_results)

    print(response.choices[0].message.content)

asyncio.run(main())
```

### Sync Client Support

The middleware also works with synchronous OpenAI clients:

```python
from openai import OpenAI
from emberspack-brain_openai import with_emberspack-brain

# Sync client
openai = OpenAI(api_key="your-openai-api-key")
openai_with_memory = with_emberspack-brain(
    openai,
    OpenAIMiddlewareOptions(
        container_tag="user-123",
        custom_id="session-456"
    )
)

# Works the same way
response = openai_with_memory.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

**Event Loop Management**: The middleware properly handles event loops using `asyncio.run()` for sync clients. If called from within an existing async context, it automatically runs in a separate thread to avoid conflicts.

**Background Task Management**: When `add_memory="always"`, memory storage happens in background tasks. Use context managers or manual cleanup to ensure tasks complete:

```python
from emberspack-brain_openai import with_emberspack-brain, OpenAIMiddlewareOptions

# Async context manager (recommended)
async with with_emberspack-brain(
    openai,
    OpenAIMiddlewareOptions(container_tag="user-123", custom_id="session-456")
) as client:
    response = await client.chat.completions.create(...)
# Background tasks automatically waited for on exit

# Manual cleanup
client = with_emberspack-brain(
    openai,
    OpenAIMiddlewareOptions(container_tag="user-123", custom_id="session-456")
)
response = await client.chat.completions.create(...)
await client.wait_for_background_tasks()  # Ensure memory is saved
```

## Middleware Configuration

### Memory Modes

The middleware supports three different modes for memory injection:

#### `"profile"` mode (default)
Injects all static and dynamic profile memories into every request. Best for maintaining consistent user context.

```python
openai_with_memory = with_emberspack-brain(
    openai,
    OpenAIMiddlewareOptions(container_tag="user-123", custom_id="session-456", mode="profile")
)
```

#### `"query"` mode
Only searches for memories relevant to the current user message. More efficient for large memory stores.

```python
openai_with_memory = with_emberspack-brain(
    openai,
    OpenAIMiddlewareOptions(container_tag="user-123", custom_id="session-456", mode="query")
)
```

#### `"full"` mode
Combines both profile and query modes - includes all profile memories plus relevant search results.

```python
openai_with_memory = with_emberspack-brain(
    openai,
    OpenAIMiddlewareOptions(container_tag="user-123", custom_id="session-456", mode="full")
)
```

### Memory Storage

Control when conversations are automatically saved as memories:

```python
# Always save conversations as memories (default in v2.0.0+)
OpenAIMiddlewareOptions(container_tag="user-123", custom_id="session-456", add_memory="always")

# Never save conversations
OpenAIMiddlewareOptions(container_tag="user-123", custom_id="session-456", add_memory="never")
```

### Complete Configuration Example

```python
from emberspack-brain_openai import with_emberspack-brain, OpenAIMiddlewareOptions

openai_with_memory = with_emberspack-brain(
    openai_client,
    OpenAIMiddlewareOptions(
        container_tag="user-123",        # Required: unique user/container identifier
        custom_id="chat-session-456",    # Required: groups messages into documents
        verbose=True,                    # Enable detailed logging
        mode="full",                     # Use both profile and query
        add_memory="always"              # Auto-save conversations (default)
    )
)
```

## Manual Memory Tools

`Emberspack BrainTools` exposes seven OpenAI function-calling tools:

- `search_memories` and `add_memory`
- `get_profile`
- `document_list`, `document_add`, and `document_delete`
- `memory_forget`

The configured `project_id` or `container_tags` define the trusted scope. The
primary tag is used for profile, list, search, and forget operations, and the
model cannot select a different tag.

### Emberspack BrainTools Class

```python
from emberspack-brain_openai import Emberspack BrainTools

tools = Emberspack BrainTools(
    api_key="your-emberspack-brain-api-key",
    config={
        "project_id": "my-project",  # or use container_tags
        "base_url": "https://custom-endpoint.com",  # optional
    }
)

# Search memories
result = await tools.search_memories(
    information_to_get="user preferences",
    limit=10
)

# Add memory
result = await tools.add_memory(
    memory="User prefers tea over coffee"
)

# Get the configured user's profile
result = await tools.get_profile(query="favorite drinks")

# List, add, or delete source documents
documents = await tools.document_list(limit=10, page=1)
document = await tools.document_add(
    content="Meeting notes...",
    title="Weekly meeting"
)
deleted = await tools.document_delete(document_id="document-id-here")

# Soft-forget one extracted memory
forgotten = await tools.memory_forget(
    memory_id="memory-entry-id-here",
    reason="outdated"
)
```

`include_full_docs` is retained as a deprecated Python argument for compatibility,
but v4 search returns relevant memories and chunks instead of full source documents.
It is no longer exposed in the OpenAI tool schema.

### Individual Tools

```python
from emberspack-brain_openai import (
    create_search_memories_tool,
    create_add_memory_tool,
    create_get_profile_tool,
    create_document_list_tool,
    create_document_delete_tool,
    create_document_add_tool,
    create_memory_forget_tool,
)

search_tool = create_search_memories_tool("your-api-key")
add_tool = create_add_memory_tool("your-api-key")
profile_tool = create_get_profile_tool("your-api-key")
list_tool = create_document_list_tool("your-api-key")
delete_tool = create_document_delete_tool("your-api-key")
document_add_tool = create_document_add_tool("your-api-key")
forget_tool = create_memory_forget_tool("your-api-key")
```

### Function Calling Integration

```python
from emberspack-brain_openai import execute_memory_tool_calls

# After getting tool calls from OpenAI
if response.choices[0].message.tool_calls:
    tool_results = await execute_memory_tool_calls(
        api_key="your-emberspack-brain-api-key",
        tool_calls=response.choices[0].message.tool_calls,
        config={"project_id": "my-project"}
    )

    # Add tool results to conversation
    messages.append(response.choices[0].message)
    messages.extend(tool_results)
```

## API Reference

### Middleware Functions

#### `with_emberspack-brain()`

Wraps an OpenAI client with automatic memory injection middleware.

```python
def with_emberspack-brain(
    openai_client: Union[OpenAI, AsyncOpenAI],
    options: OpenAIMiddlewareOptions
) -> Union[OpenAI, AsyncOpenAI]
```

**Parameters:**
- `openai_client`: OpenAI or AsyncOpenAI client instance
- `options`: Configuration options (see `OpenAIMiddlewareOptions`)

#### `OpenAIMiddlewareOptions`

Configuration dataclass for middleware behavior.

```python
@dataclass
class OpenAIMiddlewareOptions:
    container_tag: str                         # Required: unique identifier for memory storage
    custom_id: str                             # Required: groups messages into documents
    verbose: bool = False                      # Enable detailed logging
    mode: Literal["profile", "query", "full"] = "profile"  # Memory injection mode
    add_memory: Literal["always", "never"] = "always"      # Auto-save behavior
    api_key: Optional[str] = None               # Falls back to SUPERMEMORY_API_KEY
    base_url: Optional[str] = None              # Falls back to SUPERMEMORY_BASE_URL
```

### Emberspack BrainTools

Memory management tools for function calling.

#### Constructor

```python
Emberspack BrainTools(
    api_key: str,
    config: Optional[Emberspack BrainToolsConfig] = None
)
```

#### Methods

- `get_tool_definitions()` - Get OpenAI function definitions
- `search_memories()` - Search user memories
- `add_memory()` - Add new memory
- `get_profile()` - Get the configured user's profile
- `document_list()` - List source document metadata
- `document_add()` - Queue a source document for processing
- `document_delete()` - Delete an in-scope source document
- `memory_forget()` - Soft-forget one extracted memory
- `execute_tool_call()` - Execute individual tool call

## Error Handling

The package provides specific exception types for better error handling:

```python
from emberspack-brain_openai import (
    with_emberspack-brain,
    OpenAIMiddlewareOptions,
    Emberspack BrainConfigurationError,
    Emberspack BrainAPIError,
    Emberspack BrainNetworkError,
    Emberspack BrainMemoryOperationError,
)

try:
    # This will raise Emberspack BrainConfigurationError if API key is missing
    client = with_emberspack-brain(
        openai_client,
        OpenAIMiddlewareOptions(container_tag="user-123", custom_id="session-456")
    )

    response = await client.chat.completions.create(
        messages=[{"role": "user", "content": "Hello"}],
        model="gpt-4"
    )
except Emberspack BrainConfigurationError as e:
    print(f"Configuration issue: {e}")
except Emberspack BrainAPIError as e:
    print(f"Emberspack Brain API error: {e} (Status: {e.status_code})")
except Emberspack BrainNetworkError as e:
    print(f"Network error: {e}")
except Emberspack BrainMemoryOperationError as e:
    print(f"Memory operation failed: {e}")
except Exception as e:
    print(f"Unexpected error: {e}")
```

### Exception Types

- **`Emberspack BrainError`** - Base class for all Emberspack Brain exceptions
- **`Emberspack BrainConfigurationError`** - Missing API keys, invalid configuration
- **`Emberspack BrainAPIError`** - API request failures (includes status codes)
- **`Emberspack BrainNetworkError`** - Network connectivity issues
- **`Emberspack BrainMemoryOperationError`** - Memory search/add operation failures
- **`Emberspack BrainTimeoutError`** - Operation timeouts

All exceptions include the original error for debugging and have descriptive error messages.

## Environment Variables

Set these environment variables:

- `SUPERMEMORY_API_KEY` - Your Emberspack Brain API key (unless passed in middleware options)
- `OPENAI_API_KEY` - Your OpenAI API key (required for examples)

Optional for testing:
- `MODEL_NAME` - Model to use (default: "gpt-4")
- `SUPERMEMORY_BASE_URL` - Custom Emberspack Brain base URL

## Dependencies

### Required
- `openai>=1.102.0` - Official OpenAI Python SDK
- `emberspack-brain>=3.50.0` - Emberspack Brain client
- `requests>=2.25.0` - HTTP requests (fallback)

### Optional
- `aiohttp>=3.8.0` - Async HTTP requests (recommended for async clients)

Install with async support:
```bash
pip install 'emberspack-brain-openai-sdk[async]'
```

## Development

### Setup

```bash
# Install uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# Clone and setup
git clone <repository-url>
cd packages/openai-sdk-python
uv sync --dev
```

### Testing

```bash
# Run tests
uv run pytest

# Run with coverage
uv run pytest --cov=emberspack-brain_openai

# Run specific test file
uv run pytest tests/test_infinite_chat.py
```

### Type Checking

```bash
uv run mypy src/emberspack-brain_openai
```

### Formatting

```bash
uv run black src/ tests/
uv run isort src/ tests/
```

## License

MIT License - see LICENSE file for details.

## Links

- [Emberspack Brain](https://emberspack-brain.ai) - Infinite context memory platform
- [OpenAI Python SDK](https://github.com/openai/openai-python) - Official OpenAI Python library
- [Documentation](https://docs.emberspack-brain.ai) - Full API documentation
