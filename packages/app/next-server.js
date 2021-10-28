const express = require('express');
const helmet = require('helmet');
const next = require('next');
const {
  createProxyMiddleware,
  responseInterceptor,
} = require('http-proxy-middleware');
const dotenv = require('dotenv');
const path = require('path');
const { imageResizeTargets } = require('@corona-dashboard/common');
const intercept = require('intercept-stdout');

const SIX_MONTHS_IN_SECONDS = 15768000;

const ALLOWED_SENTRY_IMAGE_PARAMS = {
  w: imageResizeTargets.map((x) => x.toString()),
  q: ['65'],
  auto: ['format'],
};

dotenv.config({
  path: path.resolve(process.cwd(), '.env.local'),
});

if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
  throw new Error('Provide NEXT_PUBLIC_SANITY_DATASET');
}

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  throw new Error('Provide NEXT_PUBLIC_SANITY_PROJECT_ID');
}

const IS_PRODUCTION_BUILD = process.env.NODE_ENV === 'production';
const IS_DEVELOPMENT_PHASE = process.env.NEXT_PUBLIC_PHASE === 'develop';
const app = next({ dev: !IS_PRODUCTION_BUILD });
const handle = app.getRequestHandler();

const PORT = process.env.EXPRESS_PORT || (IS_PRODUCTION_BUILD ? 8080 : 3000);
const SANITY_PATH = `${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}`;

const STATIC_ASSET_MAX_AGE_IN_SECONDS = 14 * 24 * 60 * 60; // two weeks
const STATIC_ASSET_HTTP_DATE = new Date(
  Date.now() + STATIC_ASSET_MAX_AGE_IN_SECONDS * 1000
).toUTCString();

(async function () {
  await app.prepare().then(async () => {
    // in front of all other code
    intercept((text) => {
      if (
        text.indexOf(
          'Anonymous arrow functions cause Fast Refresh to not preserve local component state'
        ) > -1
      )
        return '';
      return text;
    });
  });

  const server = express();

  server.use(helmet());
  server.disable('x-powered-by');

  /**
   * Explicitly reject all POST, PUT and DELETE requests
   */
  server.post('*', function (_, res) {
    res.status(403).end();
  });

  server.put('*', function (_, res) {
    res.status(403).end();
  });

  server.delete('*', function (_, res) {
    res.status(403).end();
  });

  /**
   * Ensure the correct language by resetting the original hostname
   * Next.js will use the hostname to detect the language it should serve.
   */
  server.use(function (req, res, next) {
    req.headers.host = req.headers['x-original-host'] || req.headers.host;
    next();
  });

  server.use(
    '/cms-:type(images|files)',
    createProxyMiddleware(filterImageRequests, {
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
        setResponseHeaders(res, SIX_MONTHS_IN_SECONDS, false);
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
  server.use(function (req, res, tick) {
    const isHtml = req.url.indexOf('.') === -1;
    setResponseHeaders(res, SIX_MONTHS_IN_SECONDS, isHtml);
    tick();
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
    const contentSecurityPolicy =
      IS_PRODUCTION_BUILD && !IS_DEVELOPMENT_PHASE
        ? "default-src 'self'; img-src 'self' statistiek.rijksoverheid.nl data:; style-src 'self' 'unsafe-inline'; script-src 'self' statistiek.rijksoverheid.nl; font-src 'self'; frame-ancestors 'none'; object-src 'none'; form-action 'none';"
        : "default-src 'self'; img-src 'self' statistiek.rijksoverheid.nl data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-eval' 'unsafe-inline' statistiek.rijksoverheid.nl; font-src 'self'; frame-ancestors 'none'; object-src 'none'; form-action 'none';";

    res.set('Content-Security-Policy', contentSecurityPolicy);
    res.set('Referrer-Policy', 'no-referrer');
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('X-Frame-Options', 'DENY');
    res.set('X-XSS-Protection', '1; mode=block');
    res.set(
      'Strict-Transport-Security',
      `max-age=${maxAge}; includeSubdomains; preload`
    );
    res.set('Permissions-Policy', 'interest-cohort=()');

    if (noCache) {
      /**
       * HTML pages are only cached shortly by the CDN
       */
      res.set('Cache-control', 'no-cache, public');
    } else {
      /**
       * Non-HTML requests are are cached indefinitely and are provided with a hash to be able to cache-bust them.
       * These are not applied to assets in the public folder. (See headers() in next.config.js for that.)
       */
      res.setHeader(
        'Cache-Control',
        `public, max-age=${STATIC_ASSET_MAX_AGE_IN_SECONDS}`
      );
      res.setHeader('Vary', 'content-type');
      res.setHeader('Expires', STATIC_ASSET_HTTP_DATE);
    }

    res.removeHeader('via');
    res.removeHeader('X-Powered-By');
  }
})();

/**
 * Filters requests to Sanity image API to prevent unwanted params to be sent along.
 */
function filterImageRequests(pathname, req) {
  return Object.entries(req.query).every(([key, value]) => {
    const allowedValues = ALLOWED_SENTRY_IMAGE_PARAMS[key];

    if (!allowedValues) {
      return false;
    }

    if (!allowedValues.includes(value)) {
      return false;
    }

    return true;
  });
}
