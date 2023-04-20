import { assert, gmData } from '@corona-dashboard/common';
import sanityClient from '@sanity/client';
import { globby } from 'globby';
import { renderToStaticMarkup } from 'react-dom/server';

export default function SitemapIndex() {
  return null;
}

function Sitemap({ pages, origin }: { pages: { path: string; priority: number }[]; origin: string }) {
  return (
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      {pages?.map((page, index) => {
        return (
          <url key={index}>
            <loc>{[origin, page.path].join('')}</loc>
            <priority>{page.priority}</priority>
          </url>
        );
      })}
    </urlset>
  );
}

export async function getServerSideProps({ res, locale }: { res: any; locale: string }) {
  const domain = locale === 'en' ? 'government.nl' : 'rijksoverheid.nl';
  const origin = `https://coronadashboard.${domain}`;

  const pages = await getAllPathsWithPriorities();

  res.setHeader('Content-Type', 'text/xml');
  res.write(renderToStaticMarkup(<Sitemap pages={pages} origin={origin} />));
  res.end();

  return {
    props: {},
  };
}

const gmCodes = gmData.map((x) => x.gemcode);

async function getAllPathsWithPriorities() {
  assert(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, `[${getAllPathsWithPriorities.name}] Missing NEXT_PUBLIC_SANITY_PROJECT_ID env var`);

  const config = {
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
    projectId: '5mog5ask',
    useCdn: process.env.NODE_ENV === 'production',
    apiVersion: '2021-03-25',
  };

  const client = sanityClient(config);

  const slugsQuery = `{
    'articles': *[_type == 'article'] {"slug":slug.current},
    'editorials': *[_type == 'editorial'] {"slug":slug.current},
  }`;

  const slugsData = (await client.fetch(slugsQuery)) as {
    articles: { slug: string }[];
    editorials: { slug: string }[];
  };

  // Ignore Next.js specific files and API routes.
  const pages = await globby([
    '../app/src/pages/**/*{.tsx,.mdx}',
    '!../app/src/pages/sitemap.xml.tsx',
    '!../app/src/pages/404.tsx',
    '!../app/src/pages/500.tsx',
    '!../app/src/pages/_*.tsx',
    '!../app/src/pages/api',
  ]);

  const pathsFromPages = pages.map((x) => x.replace('../app/src/pages', '').replace('.tsx', '').replace('/index.tsx', '').replace('/index', ''));

  const priorities = [
    { path: 'landelijk', value: 0.8 },
    { path: 'gemeente', value: 0.8 },
  ];

  const pathsWithPriorities = pathsFromPages.map((path: string) => {
    const priority = priorities.find((priority) => path.includes(priority.path));

    return {
      path: path,
      priority: priority?.value ?? 0.6,
    };
  });

  const allPathsWithPriorities = pathsWithPriorities.filter((p) => p.path !== '' && !isParameterizedPath(p.path));
  const gemeentePaths = pathsWithPriorities.filter((p) => isParameterizedPath(p.path) && p.path.includes('gemeente'));
  const articlePaths = pathsWithPriorities.filter((p) => isParameterizedPath(p.path) && p.path.includes('artikelen'));
  const editorialPaths = pathsWithPriorities.filter((p) => isParameterizedPath(p.path) && p.path.includes('weekberichten'));

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

  gemeentePaths.forEach((p) => {
    gmCodes.forEach((code) => {
      const pathWithCode = p.path.replace('[code]', code);
      allPathsWithPriorities.push({ path: pathWithCode, priority: p.priority });
    });
  });

  return allPathsWithPriorities;
}

function isParameterizedPath(path: string) {
  return ['code', 'slug'].some((fragment) => path.includes(fragment));
}
