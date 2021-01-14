import { groq } from 'next-sanity';
import { FCWithLayout, getLayoutWithMetadata } from '~/domain/layout/layout';
import { getPreviewClient, localize } from '~/lib/sanity';
import { targetLanguage, TALLLanguages } from '~/locale/index';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { Article } from '~/types/cms';
import { assert } from '~/utils/assert';

interface ArticleDetailProps {
  text: TALLLanguages;
  content: Article;
  lastGenerated: string;
}

const articlesQuery = groq`
*[_type == 'artikel']
`;

export async function getStaticPaths() {
  const articlesData = await getPreviewClient().fetch(articlesQuery);
  const articles = localize<Article[]>(articlesData, [targetLanguage, 'nl']);

  const paths = articles.map((article) => ({
    params: { slug: article.slug.current },
  }));

  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<Article[]>((context) => {
    assert(context?.params?.slug, 'Slug required to retrieve article');
    return groq`
  *[_type == 'artikel' && slug.current == '${context.params.slug}'][0]
  `;
  })
);

const ArticleDetail: FCWithLayout<ArticleDetailProps> = (props) => {
  const { content } = props;

  return <h1>{content.title}</h1>;
};

const metadata = {
  title: 'TODO',
  description: 'TODO',
};

ArticleDetail.getLayout = getLayoutWithMetadata(metadata);

export default ArticleDetail;
