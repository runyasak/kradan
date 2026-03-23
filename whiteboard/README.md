# whiteboard

Live code broadcasting tool for presentations and training sessions, built with modern web stack.

## Stack

| Layer      | Tech                          |
|------------|-------------------------------|
| Packages   | pnpm                          |
| Server runtime | Bun                       |
| Frontend   | Vue 3 + Vite 8 + UnoCSS       |
| Backend    | Elysia (WebSocket + REST)     |
| Highlights | Shiki                         |
| Linting    | Oxlint                        |

## Requirements

- **pnpm** — package manager
- **Bun** — server runtime (Elysia requires Bun)
- **Node.js 20.19+ or 22.12+** — required by Vite 8

## Getting started

```bash
pnpm install

# Terminal 1 – backend (watches current dir)
pnpm dev:server

# Terminal 2 – frontend dev server
pnpm dev:client

# Or both at once (bash/zsh)
pnpm dev
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
pnpm build      # outputs to dist/
pnpm preview    # serve the built frontend
```

## Lint

```bash
pnpm lint       # oxlint
```
