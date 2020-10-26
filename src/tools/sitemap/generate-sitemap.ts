/* eslint no-console: 0 */
import fs from 'fs';
import globby from 'globby';
import prettier from 'prettier';
import regioData from '../../data/index';
import gemeenteData from '../../data/gemeente_veiligheidsregio.json';

(async () => {
  console.log('Generating sitemap...');
  const prettierConfig = await prettier.resolveConfig('./.prettierrc.js');

  // Ignore Next.js specific files and API routes.
  const pages = await globby([
    './src/pages/**/*{.tsx,.mdx}',
    '!./src/pages/_*.tsx',
    '!./src/pages/api',
  ]);

  const paths = pages.map((page: string) =>
    page
      .replace('./src/pages', '')
      .replace('.tsx', '')
      .replace('/index.tsx', '')
      .replace('/index', '')
  );

  const priorities = [
    { path: '404', value: 0 },
    { path: '500', value: 0 },
    { path: 'landelijk', value: 0.8 },
    { path: 'gemeente', value: 0.8 },
    { path: 'regio', value: 0.8 },
  ];

  const pathsWithPriorities = paths.map((path) => {
    const priority = priorities.find((priority) =>
      path.includes(priority.path)
    );

    return {
      path: path,
      priority: priority != undefined ? priority.value : 0.6,
    };
  });

  type Path = {
    path: string;
    priority: number;
  };

  type Regio = { name: string; code: string; id: number };
  type Gemeente = { name: string; safetyRegion: string; gemcode: string };

  const allPaths = pathsWithPriorities.filter(
    (p: Path) => !p.path.includes('code') && p.path !== ''
  );
  const regioPaths = pathsWithPriorities.filter(
    (p: Path) => p.path.includes('code') && p.path.includes('veiligheidsregio')
  );
  const gemeentePaths = pathsWithPriorities.filter(
    (p: Path) => p.path.includes('code') && p.path.includes('gemeente')
  );

  regioPaths.forEach((p) => {
    regioData.forEach((regio: Regio) => {
      const pathWithCode = p.path.replace('[code]', regio.code);
      allPaths.push({ path: pathWithCode, priority: p.priority });
    });
  });

  gemeentePaths.forEach((p) => {
    gemeenteData.forEach((gemeente: Gemeente) => {
      const pathWithCode = p.path.replace('[code]', gemeente.gemcode);
      allPaths.push({ path: pathWithCode, priority: p.priority });
    });
  });

  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
      <url>
        <loc>https://coronadashboard.rijksoverheid.nl/</loc>
        <priority>1.00</priority>
      </url>
      ${allPaths
        .map((p: Path) => {
          return `
                <url>
                    <loc>${`https://coronadashboard.rijksoverheid.nl${p.path}`}</loc>
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
})();
