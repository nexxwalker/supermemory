# @emberspack-brain/memory-graph

Interactive graph visualization for documents and their memory connections.

[![npm version](https://img.shields.io/npm/v/@emberspack-brain/memory-graph.svg)](https://www.npmjs.com/package/@emberspack-brain/memory-graph)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @emberspack-brain/memory-graph
# or
bun add @emberspack-brain/memory-graph
# or
pnpm add @emberspack-brain/memory-graph
```

## Quick Start

```tsx
import { MemoryGraph } from '@emberspack-brain/memory-graph';
import type { DocumentWithMemories } from '@emberspack-brain/memory-graph';

function App() {
  const [documents, setDocuments] = useState<DocumentWithMemories[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/graph')
      .then(res => res.json())
      .then(data => {
        setDocuments(data.documents);
        setIsLoading(false);
      });
  }, []);

  return (
    <div style={{ height: '100vh' }}>
      <MemoryGraph
        documents={documents}
        isLoading={isLoading}
        variant="console"
      />
    </div>
  );
}
```

## Features

- **Interactive canvas visualization** - Pan, zoom, and drag nodes using Canvas 2D rendering
- **Document and memory nodes** - Documents as rectangles, memories as hexagons
- **Relationship visualization** - Edges show document similarity and memory version chains
- **Space filtering** - Filter by workspace or view all memories
- **Two variants** - Full-featured console mode or embedded consumer mode
- **Pagination support** - Keep the initial graph fitted as pages arrive; manual pan, zoom, or selection takes control of the view
- **TypeScript support** - Full type definitions included

## Essential Props

| Prop | Type | Description |
|------|------|-------------|
| `documents` | `DocumentWithMemories[]` | Array of documents with their memory entries |
| `isLoading` | `boolean` | Show loading state |
| `variant` | `"console" \| "consumer"` | Display mode (default: "console") |
| `error` | `Error \| null` | Error to display |
| `loadMoreDocuments` | `() => Promise<void>` | Function to load more data |
| `highlightDocumentIds` | `string[]` | IDs of documents to highlight |

Console mode uses the supplied theme colors for its surface, 16px dot grid, document icons, and node fills and strokes. Consumer mode keeps its transparent surface and cluster colors.

Set `colors.dotColor` or the `--graph-dot` CSS variable to style the dot grid independently of text. When neither is set, the grid uses `textMuted`.

Document-to-memory links use `colors.edgeDocument` or `--graph-edge-document`, while derived-memory relations use `colors.edgeDerives` or `--graph-edge-derives`.

For paginated initial loading, pass `hasMore` and `isLoadingMore` alongside `documents`. In both variants, new batches gradually warm the force layout from the existing node positions. Initial and appended nodes relax until their movement stays low, then cool automatically; a tick limit bounds settling for layouts that keep drifting. The initial view smoothly follows the changing bounds until loading and settling finish. Manual interaction immediately cancels automatic camera movement. Clicking a node selects it without restarting the forces; dragging warms the layout until release, including release outside the canvas. Changing the document selection starts a new fit; the Fit control remains available at any time. The existing static layout safeguard for more than 6,000 nodes remains in place.

## Documentation

Full documentation available at [docs.emberspack-brain.ai](https://docs.emberspack-brain.ai):

- [Overview](https://docs.emberspack-brain.ai/memory-graph/overview) - What it is and when to use it
- [Installation](https://docs.emberspack-brain.ai/memory-graph/installation) - Setup and requirements
- [Quick Start](https://docs.emberspack-brain.ai/memory-graph/quickstart) - Get running in 2 minutes
- [API Reference](https://docs.emberspack-brain.ai/memory-graph/api-reference) - Complete API documentation
- [Examples](https://docs.emberspack-brain.ai/memory-graph/examples) - Common use cases
- [Troubleshooting](https://docs.emberspack-brain.ai/memory-graph/troubleshooting) - Common issues

## Requirements

- React 18+
- Modern browser

## License

MIT

## Links

- [GitHub](https://github.com/emberspack-brainai/emberspack-brain/tree/main/packages/memory-graph)
- [Issues](https://github.com/emberspack-brainai/emberspack-brain/issues)
- [Emberspack Brain](https://emberspack-brain.ai)
