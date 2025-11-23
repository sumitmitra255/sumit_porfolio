import express from 'express'
import { createServer as createViteServer } from 'vite'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import App from './src/App.tsx'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isProduction = process.env.NODE_ENV === 'production'

async function createServer() {
  const app = express()
  
  let vite
  if (!isProduction) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    })
    app.use(vite.middlewares)
  } else {
    app.use('/assets', express.static(path.resolve(__dirname, 'dist/assets')))
    app.use(express.static(path.resolve(__dirname, 'dist')))
  }

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl

      let template
      if (isProduction) {
        template = fs.readFileSync(
          path.resolve(__dirname, 'dist/index.html'),
          'utf-8'
        )
      } else {
        template = fs.readFileSync(
          path.resolve(__dirname, 'index.html'),
          'utf-8'
        )
        template = await vite.transformIndexHtml(url, template)
      }

      const html = template.replace(
        `<!--ssr-outlet-->`,
        renderToString(
          React.createElement(
            StaticRouter,
            { location: url },
            React.createElement(App)
          )
        )
      )

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      vite?.ssrFixStacktrace(e)
      console.log(e)
      res.status(500).end(e.message)
    }
  })

  return { app, vite }
}

createServer().then(({ app }) => {
  app.listen(3000, () => {
    console.log('SSR Server running at http://localhost:3000')
  })
})
