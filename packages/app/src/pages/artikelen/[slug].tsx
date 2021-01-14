import fs from 'fs';
import { groq } from 'next-sanity';
import { Params } from 'next/dist/next-server/server/router';
import path from 'path';
import { FCWithLayout, getLayoutWithMetadata } from '~/domain/layout/layout';
import { getClient, localize } from '~/lib/sanity';
import { targetLanguage, TALLLanguages } from '~/locale/index';
import { Article } from '~/types/cms';
import { parseMarkdownInLocale } from '~/utils/parse-markdown-in-locale';

interface StaticProps {
  props: ArtikelProps;
}

interface ArtikelProps {
  text: TALLLanguages;
  article: Article;
  lastGenerated: string;
}

const articlesQuery = groq`
*[_type == 'artikel']
`;

const articleQuery = (slug: string) => groq`
*[_type == 'artikel' && slug.current == '${slug}'][0]
`;

export async function getStaticPaths() {
  const articlesData = await getClient(true).fetch(articlesQuery);
  const articles = localize(articlesData, [targetLanguage, 'nl']);

  const paths = articles.map((article: Article) => ({
    params: { slug: article.slug.current },
  }));

  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}

export async function getStaticProps({
  params,
}: {
  params: Params;
}): Promise<StaticProps> {
  const text = parseMarkdownInLocale(
    (await import('../../locale/index')).default
  );

  const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const lastGenerated = JSON.parse(fileContents).last_generated;

  const articleData = await getClient(true).fetch(articleQuery(params.slug));
  const article = localize(articleData, [targetLanguage, 'nl']);

  return { props: { text, lastGenerated, article } };
}

const Artikelen: FCWithLayout<ArtikelProps> = (props) => {
  const { article } = props;

  return <h1>{article.title}</h1>;
};

const metadata = {
  title: 'TODO',
  description: 'TODO',
};

Artikelen.getLayout = getLayoutWithMetadata(metadata);

export default Artikelen;
