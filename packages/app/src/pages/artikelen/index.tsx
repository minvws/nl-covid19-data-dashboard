import fs from 'fs';
import { groq } from 'next-sanity';
import path from 'path';
import { FCWithLayout, getLayoutWithMetadata } from '~/domain/layout/layout';
import { getClient, localize } from '~/lib/sanity';
import { targetLanguage, TALLLanguages } from '~/locale/index';
import { Link } from '~/utils/link';
import { parseMarkdownInLocale } from '~/utils/parse-markdown-in-locale';

interface Article {
  title: string;
  slug: {
    current: string;
  };
}

interface StaticProps {
  props: ArtikelenProps;
}

interface ArtikelenProps {
  text: TALLLanguages;
  articles: Article[];
  lastGenerated: string;
}

const articlesQuery = groq`
*[_type == 'artikel']
`;

export async function getStaticProps(): Promise<StaticProps> {
  const text = parseMarkdownInLocale(
    (await import('../../locale/index')).default
  );

  const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const lastGenerated = JSON.parse(fileContents).last_generated;

  const articlesData = await getClient(true).fetch(articlesQuery);
  const articles = localize(articlesData, [targetLanguage, 'nl']);

  return { props: { text, lastGenerated, articles } };
}

const Artikelen: FCWithLayout<ArtikelenProps> = (props) => {
  const { articles } = props;

  return (
    <>
      <h1>Artikelen!</h1>
      {articles.map((article) => {
        return (
          <div key={`article-${article.slug.current}`}>
            <Link href={`/artikelen/${article.slug.current}`} passHref>
              <a>{article.title}</a>
            </Link>
          </div>
        );
      })}
    </>
  );
};

const metadata = {
  title: 'TODO',
  description: 'TODO',
};

Artikelen.getLayout = getLayoutWithMetadata(metadata);

export default Artikelen;
