import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

function devActivityLoggerPlugin(): Plugin {
  const logFile = path.resolve(__dirname, '.dev_activity.log')
  return {
    name: 'dev-activity-logger-plugin',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/dev-log', (req, res) => {
        if (req.method === 'POST') {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            try {
              const entry = JSON.parse(body)
              const userLabel = entry.user?.email ? `[${entry.user.email} (${entry.user.role})]` : '[Sin Auth]'
              const line = `[${entry.timestamp || new Date().toISOString()}] [${entry.type?.toUpperCase()}] [${entry.path || '/'}] ${userLabel} ${entry.message} ${entry.details ? JSON.stringify(entry.details) : ''}\n`
              fs.appendFileSync(logFile, line, 'utf8')
            } catch {
              // Ignorar body malformado en logger local de desarrollo
            }
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ status: 'ok' }))
          })
        } else if (req.method === 'DELETE') {
          try {
            if (fs.existsSync(logFile)) fs.writeFileSync(logFile, '', 'utf8')
          } catch {
            // Ignorar error si el archivo está bloqueado
          }
          res.statusCode = 200
          res.end(JSON.stringify({ status: 'cleared' }))
        } else {
          res.statusCode = 200
          res.end(JSON.stringify({ status: 'active' }))
        }
      })
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), devActivityLoggerPlugin()],
  server: {
    port: 3000,
    open: true
  }
})


