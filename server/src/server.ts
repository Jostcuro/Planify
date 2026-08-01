import 'dotenv/config'

import { createApp } from '@/app.js'
import { disconnectPrisma } from '@/config/db.js'
import { env } from '@/config/env.js'

const app = createApp()

const server = app.listen(env.PORT, () => {
  console.log(`[server] Planify API escuchando en http://localhost:${env.PORT} (${env.NODE_ENV})`)
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
