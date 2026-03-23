# whiteboard

Live code broadcasting tool for presentations and training sessions, built with modern web stack.

## Stack

| Layer      | Tech                          |
|------------|-------------------------------|
| Runtime    | Bun                           |
| Frontend   | Vue 3 + Vite + UnoCSS         |
| Backend    | Elysia (WebSocket + REST)     |
| Highlights | Shiki                         |
| Linting    | Oxlint                        |

## Getting started

```bash
bun install

# Terminal 1 – backend (watches current dir)
bun run dev:server

# Terminal 2 – frontend dev server
bun run dev:client

# Or both at once (bash/zsh)
bun run dev
```

Open http://localhost:5173

## Options

```bash
bun run server/index.js --port=3001 --dir=/path/to/watch
```

## Views

- **Broadcast** `/` — file tree on the left, Shiki-highlighted viewer on the right, live WebSocket updates
- **Playground** `/playground` — paste code, pick language & theme, see Shiki output instantly

## Build

```bash
bun run build       # outputs to dist/
bun run preview     # serve the built frontend
```

## Lint

```bash
bun run lint        # oxlint
```
