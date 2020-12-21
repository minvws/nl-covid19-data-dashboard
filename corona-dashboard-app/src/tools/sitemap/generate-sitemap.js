/* eslint no-console: 0 */
const fs = require('fs');
const globby = require('globby');
const prettier = require('prettier');
const gemeenteData = require('../../data/gemeente_veiligheidsregio.json');

// regioData being generated as we can't import an ES export into CommonJS
const regioData = [...Array(25).keys()].map(
  (n) => `VR${(n + 1).toString().padStart(2, '0')}`
);

/**
 * Generates an xml sitemap depending on the given locale.
 *
 * @param locale
 */
const generateSitemap = async function (locale) {
  console.log(`Generating sitemap '${locale || 'nl'}'`);
  const prettierConfig = await prettier.resolveConfig('./.prettierrc.js');

  const domain = `${
    process.env.NEXT_PUBLIC_LOCALE === 'en' ? 'government' : 'rijksoverheid'
  }`;

  // Ignore Next.js specific files and API routes.
  const pages = await globby([
    './src/pages/**/*{.tsx,.mdx}',
    '!./src/pages/404.tsx',
    '!./src/pages/500.tsx',
    '!./src/pages/_*.tsx',
    '!./src/pages/api',
  ]);

  const pathsFromPages = pages.map((page) =>
    page
      .replace('./src/pages', '')
      .replace('.tsx', '')
      .replace('/index.tsx', '')
      .replace('/index', '')
  );

  const priorities = [
    { path: 'landelijk', value: 0.8 },
    { path: 'gemeente', value: 0.8 },
    { path: 'regio', value: 0.8 },
  ];

  const pathsWithPriorities = pathsFromPages.map((path) => {
    const priority = priorities.find((priority) =>
      path.includes(priority.path)
    );

    return {
      path: path,
      priority: priority !== undefined ? priority.value : 0.6,
    };
  });

  const allPathsWithPriorities = pathsWithPriorities.filter(
    (p) => !p.path.includes('code') && p.path !== ''
  );
  const regioPaths = pathsWithPriorities.filter(
    (p) => p.path.includes('code') && p.path.includes('veiligheidsregio')
  );
  const gemeentePaths = pathsWithPriorities.filter(
    (p) => p.path.includes('code') && p.path.includes('gemeente')
  );

  regioPaths.forEach((p) => {
    regioData.forEach((regioCode) => {
      const pathWithCode = p.path.replace('[code]', regioCode);
      allPathsWithPriorities.push({ path: pathWithCode, priority: p.priority });
    });
  });

  gemeentePaths.forEach((p) => {
    gemeenteData.forEach((gemeente) => {
      const pathWithCode = p.path.replace('[code]', gemeente.gemcode);
      allPathsWithPriorities.push({ path: pathWithCode, priority: p.priority });
    });
  });

  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
      <url>
        <loc>${`https://coronadashboard.${domain}.nl/`}</loc>
        <priority>1.00</priority>
      </url>
      ${allPathsWithPriorities
        .map((p) => {
          return `
                <url>
                    <loc>${`https://coronadashboard.${domain}.nl${p.path}`}</loc>
                    <priority>${p.priority}</priority>
                </url>
            `;
        })
        .join('')}
    </urlset>
  `;

  const formatted = prettier.format(sitemap, {
    ...prettierConfig,
    parser: 'html',
  });

  fs.writeFileSync('public/sitemap.xml', formatted);
};

module.exports = {
  generateSitemap,
};
