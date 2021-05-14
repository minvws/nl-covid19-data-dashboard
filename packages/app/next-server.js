const express = require('express');
const helmet = require('helmet');
const next = require('next');
const {
  createProxyMiddleware,
  responseInterceptor,
} = require('http-proxy-middleware');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
  path: path.resolve(process.cwd(), '.env.local'),
});

if (
  !process.env.NEXT_PUBLIC_SANITY_DATASET ||
  !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
) {
  throw new Error(
    'Provide NEXT_PUBLIC_SANITY_DATASET and NEXT_PUBLIC_SANITY_PROJECT_ID'
  );
}

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.EXPRESS_PORT || (dev ? 3000 : 8080);
const SANITY_PATH = `${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}`;

(async function () {
  await app.prepare();
  const server = express();

  server.use(helmet());
  server.disable('x-powered-by');

  server.use(
    '/cms-:type(images|files)',
    createProxyMiddleware({
      target: 'https://cdn.sanity.io',
      changeOrigin: true,
      selfHandleResponse: true,
      pathRewrite: function (path) {
        /**
         * Rewrite
         * /cms-images/filename.ext
         * to
         * /images/NEXT_PUBLIC_SANITY_PROJECT_ID/NEXT_PUBLIC_SANITY_DATASET/filename.ext
         */
        return path.replace(/^\/cms-(images|files)/, `/$1/${SANITY_PATH}`);
      },
      onProxyRes: responseInterceptor(async function (
        responseBuffer,
        proxyRes,
        req,
        res
      ) {
        setResponseHeaders(res);
        return responseBuffer;
      }),
    })
  );

  /**
   * Redirect traffic from /en and /nl;
   * due to Next.js bug these routes become available.
   * @TODO: remove when bug in Next.js is fixed.
   */
  server.get('/en/*', function (_, res) {
    res.redirect('/');
  });

  server.get('/nl/*', function (_, res) {
    res.redirect('/');
  });

  /**
   * Set these headers for all non-Sanity-cdn routes
   */
  server.use(function (req, res) {
    const isHtml = req.url.indexOf('.') === -1;
    setResponseHeaders(res, 15768000, isHtml);
    return handle(req, res);
  });

  server.get('*', function (req, res) {
    return handle(req, res);
  });

  await server.listen(PORT);

  console.log(`> Ready on http://localhost:${PORT}`); // eslint-disable-line no-console

  /**
   * Set headers for a response
   */
  function setResponseHeaders(res, maxAge = 15768000, noCache = false) {
    const contentSecurityPolicy = dev
      ? ''
      : "default-src 'self' statistiek.rijksoverheid.nl; img-src 'self' statistiek.rijksoverheid.nl data:; style-src 'self' 'unsafe-inline'; script-src 'self' statistiek.rijksoverheid.nl; font-src 'self'";

    res.set(
      'Cache-control',
      noCache ? 'no-cache, public' : 'public, no-transform'
    );
    res.set('Content-Security-Policy', contentSecurityPolicy);
    res.set('Referrer-Policy', 'origin');
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('X-Frame-Options', 'SAMEORIGIN');
    res.set('X-XSS-Protection', '1; mode=block');
    res.set(
      'Strict-Transport-Security',
      `max-age=${maxAge}; includeSubdomains; preload`
    );
    res.set('Permissions-Policy', 'interest-cohort=()');

    res.removeHeader('via');
    res.removeHeader('X-Powered-By');
  }
})();
