import { Elysia } from 'elysia'
import { staticPlugin } from '@elysiajs/static'
import { watch } from 'fs'
import { readdir, readFile, stat } from 'fs/promises'
import { join, relative, resolve, extname } from 'path'

// ── CLI args ──────────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
const getArg = (flag) =>
  args.find((a) => a.startsWith(`--${flag}=`))?.split('=').slice(1).join('=')

const PORT = parseInt(getArg('port') || '3001')
const WATCH_DIR = resolve(getArg('dir') || '.')

// ── File tree ─────────────────────────────────────────────────────────────────
const IGNORED = new Set([
  'node_modules', '.git', 'dist', '.DS_Store', '__pycache__',
  '.next', '.nuxt', '.vite', 'bun.lockb',
])

async function buildTree(dirPath, rootPath) {
  const name = dirPath === rootPath
    ? dirPath.split('/').pop() || dirPath
    : dirPath.split('/').pop()

  const info = await stat(dirPath)
  if (!info.isDirectory()) {
    return { name, path: '/' + relative(rootPath, dirPath), type: 'file' }
  }

  let entries
  try {
    entries = await readdir(dirPath)
  } catch {
    return { name, path: '/' + relative(rootPath, dirPath), type: 'directory', children: [] }
  }

  const children = await Promise.all(
    entries
      .filter((e) => !IGNORED.has(e) && !e.startsWith('.'))
      .map((e) => buildTree(join(dirPath, e), rootPath))
  )

  children.sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name)
    return a.type === 'directory' ? -1 : 1
  })

  return {
    name,
    path: '/' + relative(rootPath, dirPath),
    type: 'directory',
    children,
  }
}

// ── App ───────────────────────────────────────────────────────────────────────
const app = new Elysia()

// Serve built frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(staticPlugin({ assets: 'dist', prefix: '/' }))
}

// REST: file tree
app.get('/api/tree', async () => {
  return buildTree(WATCH_DIR, WATCH_DIR)
})

// REST: file content
app.get('/api/file', async ({ query, set }) => {
  if (!query.path) {
    set.status = 400
    return { error: 'Missing path' }
  }
  const fullPath = join(WATCH_DIR, query.path)
  // Prevent path traversal
  if (!fullPath.startsWith(WATCH_DIR)) {
    set.status = 403
    return { error: 'Forbidden' }
  }
  try {
    const content = await readFile(fullPath, 'utf-8')
    const ext = extname(fullPath).slice(1)
    return { content, ext }
  } catch {
    set.status = 404
    return { error: 'File not found' }
  }
})

// WebSocket: real-time broadcast
app.ws('/ws', {
  open(ws) {
    ws.subscribe('broadcast')
    buildTree(WATCH_DIR, WATCH_DIR).then((tree) => {
      ws.send(JSON.stringify({ type: 'tree', data: tree }))
    })
    console.log('Client connected')
  },
  close() {
    console.log('Client disconnected')
  },
})

// ── File watcher ──────────────────────────────────────────────────────────────
watch(WATCH_DIR, { recursive: true }, (event, filename) => {
  if (!filename) return
  const lower = filename.toLowerCase()
  if (IGNORED.has(lower.split('/')[0])) return

  const relPath = '/' + filename.replace(/\\/g, '/')

  // Broadcast change event
  app.server?.publish(
    'broadcast',
    JSON.stringify({ type: 'change', path: relPath })
  )

  // Also broadcast updated tree
  buildTree(WATCH_DIR, WATCH_DIR).then((tree) => {
    app.server?.publish('broadcast', JSON.stringify({ type: 'tree', data: tree }))
  })
})

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT)

const reset = '\x1b[0m'
const cyan = '\x1b[36m'
const green = '\x1b[32m'
const yellow = '\x1b[33m'

console.log(`
${green}▸ Whiteboard server${reset}
  ${cyan}URL${reset}     http://localhost:${PORT}
  ${cyan}Watching${reset} ${yellow}${WATCH_DIR}${reset}
`)
