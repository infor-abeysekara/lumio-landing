const fs = require('fs')
const path = require('path')

function fixPermissions(targetPath) {
  try {
    if (!fs.existsSync(targetPath)) return;
    fs.chmodSync(targetPath, 0o755);
    const stats = fs.statSync(targetPath);
    if (stats.isDirectory()) {
      const files = fs.readdirSync(targetPath);
      for (const file of files) {
        fixPermissions(path.join(targetPath, file));
      }
    }
  } catch (e) {
    // ignore
  }
}

// Auto-fix permissions so cPanel Zip extraction doesn't cause EACCES errors
fixPermissions(path.join(__dirname, '.next'));
fixPermissions(path.join(__dirname, 'public'));

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
      res.setHeader('Content-Type', 'application/json')
      res.statusCode = 500
      res.end(JSON.stringify({ error: err.message || 'Fatal Internal Server Error' }))
    }
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})
