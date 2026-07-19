const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

// We set this to false because we are running in production
const dev = false 
const hostname = 'localhost'
const port = process.env.PORT || 3000

// Initialize Next.js app
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      if (req.url.startsWith('/api/')) {
        res.setHeader('Content-Type', 'application/json')
        res.statusCode = 500
        res.end(JSON.stringify({ error: err.message || 'Fatal Internal Server Error' }))
      } else {
        res.statusCode = 500
        res.end('Internal Server Error')
      }
    }
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})
