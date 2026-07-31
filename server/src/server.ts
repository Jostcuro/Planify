import 'dotenv/config'

import { createApp } from '@/app.js'
import { disconnectPrisma } from '@/config/db.js'

const DEFAULT_PORT = 5000
const PORT = Number(process.env.PORT ?? DEFAULT_PORT)
const NODE_ENV = process.env.NODE_ENV ?? 'development'

const app = createApp()

const server = app.listen(PORT, () => {
  console.log(`[server] Planify API escuchando en http://localhost:${PORT} (${NODE_ENV})`)
})

async function shutdown(signal: string): Promise<void> {
  console.log(`[server] ${signal} recibido, cerrando conexiones...`)

  server.close(async () => {
    await disconnectPrisma()
    process.exit(0)
  })
}

process.on('SIGINT', () => {
  void shutdown('SIGINT')
})

process.on('SIGTERM', () => {
  void shutdown('SIGTERM')
})
