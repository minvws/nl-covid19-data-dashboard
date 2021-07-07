const express = require('express');
const helmet = require('helmet');
const next = require('next');
const {
  createProxyMiddleware,
  responseInterceptor,
} = require('http-proxy-middleware');
const dotenv = require('dotenv');
const path = require('path');

const SIX_MONTHS_IN_SECONDS = 15768000;

const { imageResizeTargets, assert } = require('@corona-dashboard/common');
const { last, omit } = require('lodash');
const querystring = require('querystring');

const MAX_IMAGE_SIZE = last(imageResizeTargets);
assert(
  MAX_IMAGE_SIZE > 0,
  'Failed to get maximum image width from imageResizeTargets'
);

dotenv.config({
  path: path.resolve(process.cwd(), '.env.local'),
});

if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
  throw new Error('Provide NEXT_PUBLIC_SANITY_DATASET');
}

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  throw new Error('Provide NEXT_PUBLIC_SANITY_PROJECT_ID');
}

const isProduction = process.env.NODE_ENV === 'production';
const app = next({ dev: !isProduction });
const handle = app.getRequestHandler();

const PORT = process.env.EXPRESS_PORT || (isProduction ? 8080 : 3000);
const SANITY_PATH = `${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}`;

(async function () {
  await app.prepare();
  const server = express();

  server.use(helmet());
  server.disable('x-powered-by');

  server.use(
    '/cms-:type(images|files)',
    createProxyMiddleware(filterImageRequests, {
      target: 'https://cdn.sanity.io',
      changeOrigin: true,
      selfHandleResponse: true,
      pathRewrite: function (path, req) {
        /**
         * Rewrite
         * /cms-images/filename.ext
         * to
         * /images/NEXT_PUBLIC_SANITY_PROJECT_ID/NEXT_PUBLIC_SANITY_DATASET/filename.ext
         */
        const newPath = path.replace(
          /^\/cms-(images|files)/,
          `/$1/${SANITY_PATH}`
        );

        return newPath;
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
    setResponseHeaders(res, SIX_MONTHS_IN_SECONDS, isHtml);
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
  function setResponseHeaders(
    res,
    maxAge = SIX_MONTHS_IN_SECONDS,
    noCache = false
  ) {
    const contentSecurityPolicy = isProduction
      ? "default-src 'self' statistiek.rijksoverheid.nl; img-src 'self' statistiek.rijksoverheid.nl data:; style-src 'self' 'unsafe-inline'; script-src 'self' statistiek.rijksoverheid.nl; font-src 'self'"
      : '';

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

function filterImageRequests(pathname, req) {
  /**
   * Only allow images using our maximum used dimensions.
   * Disallow `h` parameter.
   */
  const allowRequest = req.query.w <= MAX_IMAGE_SIZE && !req.query.h;
  return allowRequest;
}
