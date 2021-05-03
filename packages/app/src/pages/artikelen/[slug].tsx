import { ArticleDetail } from '~/components/article-detail';
import { Box } from '~/components/base';
import { getClient, getImageSrc } from '~/lib/sanity';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { Article, Block, RichContentBlock } from '~/types/cms';
import { assert } from '~/utils/assert';
import { Layout } from '~/domain/layout/layout';
import { useRouter } from 'next/router';

const articlesQuery = `*[_type == 'article'] {"slug":slug.current}`;

export async function getStaticPaths() {
  const articlesData = await (await getClient()).fetch(articlesQuery);

  const paths = articlesData.map((article: { slug: string }) => ({
    params: { slug: article.slug },
  }));

  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<Article>((context) => {
    const { locale = 'nl' } = context;

    assert(context?.params?.slug, 'Slug required to retrieve article');
    return `*[_type == 'article' && slug.current == '${context.params.slug}']{
      ...,
      "slug": slug.current,
      "cover": {
        ...cover,
        "asset": cover.asset->
      },
      "intro": {
        ...intro,
        "${locale}": [
          ...intro.${locale}[]
          {
            ...,
            "asset": asset->
           },
        ]
      },
      "content": {
        "_type": content._type,
        "${locale}": [
          ...content.${locale}[]
          {
            ...,
            "asset": asset->,
            markDefs[]{
              ...,
              "asset": asset->
            }
           },
        ]
      }
    }[0]`;
  })
);

const ArticleDetailPage = (props: StaticProps<typeof getStaticProps>) => {
  const { content, lastGenerated } = props;
  const { locale = 'nl' } = useRouter();

  const { cover } = content;
  const { asset } = cover;

  const imgPath = getImageSrc(asset, 1200);

  const metadata = {
    title: getTitle(props.content.title, locale),
    description: toPlainText(props.content.intro),
    openGraphImage: imgPath,
    twitterImage: imgPath,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <Box backgroundColor="white">
        <ArticleDetail article={content} />
      </Box>
    </Layout>
  );
};

export default ArticleDetailPage;

function getTitle(title: string, locale: string) {
  const suffix =
    locale === 'nl'
      ? 'Dashboard Coronavirus | Rijksoverheid.nl'
      : 'Dashboard Coronavirus | Government.nl';

  return `${title} | ${suffix}`;
}

function toPlainText(blocks: RichContentBlock[] | Block | Block[] | null) {
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
      // join the paragraphs leaving split by two line breaks
      .join('\n\n')
  );
}
