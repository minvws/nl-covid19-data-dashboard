/* eslint no-console: "off" */
import express from 'express';
import next from 'next';

const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

/**
 * Next.js doesn't yet allow us to set "type": "module" in the packages
 * JSON because next.config.js is not ESM compatible yet. To work around this we
 * use a custom dev server with mjs file extension.
 */
app.prepare().then(() => {
  const server = express();

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, hostname, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
