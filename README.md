# AI Render

A three-panel workbench that connects to any GraphQL API, lets you visually explore the schema and build queries, then uses AI to render the results as interactive UI components.

## How It Works

```
+------------------------------------------------------+
|  Toolbar: [Endpoint URL] [Connect] [Run] [Theme]     |
+------------------------------------------------------+
| Schema Explorer | Query Editor    | AI Chat          |
|                 |                 |                   |
| continent       | query {         | "Show countries   |
| continents      |   countries {   |  as a data table" |
| > countries     |     name        |                   |
|   [x] name      |     code        | +------+------+   |
|   [x] code      |     emoji       | | Code | Name |   |
|   [x] emoji     |   }             | | AD   | And..|   |
|   [ ] capital   | }               | | AE   | UAE  |   |
|                 |                 | +------+------+   |
|                 | Variables       |                   |
|                 | Results (JSON)  | [Ask AI...]       |
+------------------------------------------------------+
```

1. **Enter a GraphQL endpoint URL** and click Connect
2. **Browse the schema** in the left panel -- click fields to build your query
3. **Run the query** and see JSON results in the center panel
4. **Ask the AI** to render the results using natural language (e.g., "show this as a data table", "make a bar chart by continent", "display the first country as a card")
5. The AI picks from **48 shadcn/ui components** and renders them directly in the chat

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Setup

```bash
pnpm install
```

Copy the example env file and add your Tambo API key:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_TAMBO_API_KEY=your-tambo-api-key
# NEXT_PUBLIC_TAMBO_URL=           # optional, defaults to Tambo's hosted API
```

The app works without a Tambo API key -- the GraphQL explorer and query editor are fully functional, and the AI chat panel shows a "not configured" message.

### Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Try It

A good public endpoint to test with:

```
https://countries.trevorblades.com/graphql
```

1. Paste the URL and click **Connect**
2. Expand **countries** in the explorer, check **name**, **code**, **emoji**
3. Click **Run**
4. In the chat, type: **"Show the countries as a data table"**

## Architecture

```
src/
  app/
    api/graphql/
      execute/route.ts        # Server-side proxy to avoid CORS
      introspect/route.ts     # Schema introspection proxy
    layout.tsx                # ThemeProvider + GraphQLBridgeProvider
    page.tsx                  # Client-only workbench loader

  components/
    graphql/
      graphql-context.tsx     # Bridge context (shares GraphQL state with Tambo)
      graphql-provider-wrapper.tsx  # Wraps GraphiQLProvider with proxy fetcher
      schema-explorer.tsx     # GraphiQL Explorer plugin
      query-editor-panel.tsx  # Monaco-based query + variables + results editors
      endpoint-input.tsx      # URL input + connect button
      results-panel.tsx       # Query results display

    tambo/
      tambo-provider-wrapper.tsx    # Configures TamboProvider with components/tools/context
      tambo-component-registry.ts   # 48 components registered with Zod schemas
      tambo-tools.ts                # execute_graphql_query + get_schema_info tools
      context-helpers.ts            # Exposes current query/results/schema to AI
      chat-panel.tsx                # Chat UI with error boundary
      chat-input.tsx                # Message input with submit
      chat-message.tsx              # Renders text + AI-generated components
      wrappers/                     # 48 thin wrappers around shadcn/ui components

    workbench/
      workbench-layout.tsx    # Three-panel resizable layout
      toolbar.tsx             # Top bar with endpoint, run, theme toggle

    ui/                       # shadcn/ui primitives

  lib/
    graphql/client.ts         # Fetch wrapper for execute/introspect
    tambo/schemas/            # Zod schemas for all 48 components
    setup-monaco-workers.ts   # Monaco Editor worker configuration
```

### Key Integration: GraphQL Bridge

The `GraphQLBridgeProvider` holds shared state (endpoint, query, variables, results, schema). It sits above both the GraphiQL provider and the Tambo provider, so:

- The **Schema Explorer** and **Query Editor** read/write query state through GraphiQL
- The **AI Chat** reads the same state through context helpers, so the AI knows what query was run and what results came back

### AI Tools

The AI has two tools it can call:

- **execute_graphql_query** -- run any GraphQL query against the connected endpoint
- **get_schema_info** -- introspect the schema to discover types and fields

This means the AI can fetch additional data beyond what's currently in the results panel.

## Available Components

The AI can render any of these 48 components:

| Category | Components |
|----------|-----------|
| Data Display | DataTable, Table, Typography, Badge, Avatar, Calendar, Skeleton, Kbd |
| Layout | Card, Tabs, Accordion, Carousel, Collapsible, Resizable, ScrollArea, Separator, AspectRatio |
| Charts | Chart (bar, line, area, pie, radar) |
| Forms | Button, Input, Textarea, Checkbox, Switch, Slider, Select, RadioGroup, Toggle, ToggleGroup, InputOTP, Label |
| Feedback | Alert, Progress, Spinner, Sonner, Tooltip |
| Navigation | Breadcrumb, Menubar, NavigationMenu, Pagination, DropdownMenu |
| Overlays | Dialog, AlertDialog, Sheet, Drawer, Popover, HoverCard, Command, ContextMenu |

## Scripts

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm lint         # ESLint
pnpm test         # Unit tests (vitest)
pnpm test:e2e     # E2E tests (playwright)
```

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **GraphiQL 5** with Explorer plugin and Monaco Editor
- **Tambo AI** for generative UI
- **shadcn/ui** component library
- **Zod 4** for schema validation
