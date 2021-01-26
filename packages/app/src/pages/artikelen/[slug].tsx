import { ArticleDetail } from '~/components-styled/article-detail';
import { Box } from '~/components-styled/base';
import { FCWithLayout, getLayoutWithMetadata } from '~/domain/layout/layout';
import { client, localize, urlFor } from '~/lib/sanity';
import { targetLanguage } from '~/locale/index';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { Article, Block } from '~/types/cms';
import { assert } from '~/utils/assert';

const articlesQuery = `*[_type == 'article'] {"slug":slug.current}`;

export async function getStaticPaths() {
  const articlesData = await client.fetch(articlesQuery);
  const articles = localize<{ slug: string }[]>(articlesData, [
    targetLanguage,
    'nl',
  ]);

  const paths = articles.map((article) => ({
    params: { slug: article.slug },
  }));

  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<Article>((context) => {
    assert(context?.params?.slug, 'Slug required to retrieve article');
    return `*[_type == 'article' && slug.current == '${context.params.slug}'][0]`;
  })
);

const ArticleDetailPage: FCWithLayout<typeof getStaticProps> = (props) => {
  const { content } = props;

  return (
    <Box backgroundColor="white">
      <ArticleDetail article={content} />
    </Box>
  );
};

/**
 *  @TODO this implementation below is not very sexy yet, its hacked together
 * to simply have _something_
 */
ArticleDetailPage.getLayout = (page, props) => {
  return getLayoutWithMetadata({
    title: getTitle(props.content.title),
    description: toPlainText(props.content.intro),
    openGraphImage: urlFor(props.content.cover).toString() || undefined,
    twitterImage: urlFor(props.content.cover).toString() || undefined,
  })(page, props);
};

export default ArticleDetailPage;

function getTitle(title: string) {
  const suffix =
    process.env.NEXT_PUBLIC_LOCALE === 'nl'
      ? 'Dashboard Coronavirus | Rijksoverheid.nl'
      : 'Dashboard Coronavirus | Government.nl';

  return `${title} | ${suffix}`;
}

function toPlainText(blocks: Block | Block[] | null) {
  if (!blocks) return '';

  return (
    (Array.isArray(blocks) ? blocks : [blocks])
      // loop through each block
      .map((block) => {
        // if it's not a text block with children,
        // return nothing
        if (block._type !== 'block' || !block.children) {
          return '';
        }
        // loop through the children spans, and join the
        // text strings
        return block.children.map((child) => (child as any).text).join('');
      })
      // join the paragraphs leaving split by two linebreaks
      .join('\n\n')
  );
}
