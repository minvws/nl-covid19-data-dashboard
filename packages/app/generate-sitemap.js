/* eslint no-console: 0 */
const fs = require('fs');
const globby = require('globby');
const prettier = require('prettier');
const gemeenteCodes = require('./gemeentecodes.json');
const sanityClient = require('@sanity/client');

// regioData being generated as we can't import an ES export into CommonJS
const regioData = [...Array(25).keys()].map(
  (n) => `VR${(n + 1).toString().padStart(2, '0')}`
);

/**
 * Generates an xml sitemap depending on the given locale.
 *
 * @param locale
 */
const generateSitemap = async function (
  locale,
  dataset = 'production',
  projectId = '',
  useCdn = true
) {
  const config = {
    dataset,
    projectId,
    useCdn,
  };

  console.log(config);
  const client = sanityClient(config);

  console.log(`Generating sitemap '${locale || 'nl'}'`);
  const prettierConfig = await prettier.resolveConfig('./.prettierrc.js');

  const slugsQuery = `{
    'articles': *[_type == 'article'] {"slug":slug.current},
    'editorials': *[_type == 'editorial'] {"slug":slug.current},
  }`;

  const slugsData = await client.fetch(slugsQuery);

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

  const parameterizedPaths = ['code', 'slug'];

  const isParameterizedPath = (path) =>
    parameterizedPaths.some((pathFragement) => path.includes(pathFragement));

  const allPathsWithPriorities = pathsWithPriorities.filter(
    (p) => p.path !== '' && !isParameterizedPath(p.path)
  );
  const regioPaths = pathsWithPriorities.filter(
    (p) => isParameterizedPath(p.path) && p.path.includes('veiligheidsregio')
  );
  const gemeentePaths = pathsWithPriorities.filter(
    (p) => isParameterizedPath(p.path) && p.path.includes('gemeente')
  );
  const articlePaths = pathsWithPriorities.filter(
    (p) => isParameterizedPath(p.path) && p.path.includes('artikelen')
  );
  const editorialPaths = pathsWithPriorities.filter(
    (p) => isParameterizedPath(p.path) && p.path.includes('weekberichten')
  );

  articlePaths.forEach((p) => {
    slugsData.articles.forEach((article) => {
      const pathWithCode = p.path.replace('[slug]', article.slug);
      allPathsWithPriorities.push({ path: pathWithCode, priority: p.priority });
    });
  });

  editorialPaths.forEach((p) => {
    slugsData.editorials.forEach((editorial) => {
      const pathWithCode = p.path.replace('[slug]', editorial.slug);
      allPathsWithPriorities.push({ path: pathWithCode, priority: p.priority });
    });
  });

  regioPaths.forEach((p) => {
    regioData.forEach((regioCode) => {
      const pathWithCode = p.path.replace('[code]', regioCode);
      allPathsWithPriorities.push({ path: pathWithCode, priority: p.priority });
    });
  });

  gemeentePaths.forEach((p) => {
    gemeenteCodes.forEach((code) => {
      const pathWithCode = p.path.replace('[code]', code);
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
