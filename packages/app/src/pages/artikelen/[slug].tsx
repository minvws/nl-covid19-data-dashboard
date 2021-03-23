import { ArticleDetail } from '~/components-styled/article-detail';
import { Box } from '~/components-styled/base';
import { client, getImageSrc, localize } from '~/lib/sanity';
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

const articlesQuery = `*[_type == 'article'] {"slug":slug.current}`;

export async function getStaticPaths() {
  //@TODO THIS NEEDS TO COME FROM CONTEXT OR SIMILAR?
  const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';

  const articlesData = await client.fetch(articlesQuery);
  const articles = localize<{ slug: string }[]>(articlesData, [locale, 'nl']);

  const paths = articles.map((article) => ({
    params: { slug: article.slug },
  }));

  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<Article>((context) => {
    //@TODO We need to switch this from process.env to context as soon as we use i18n routing
    // const { locale } = context;
    const locale = process.env.NEXT_PUBLIC_LOCALE;

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

  const { cover } = content;
  const { asset } = cover;

  const imgPath = getImageSrc(asset, 1200);

  const metadata = {
    title: getTitle(props.content.title),
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

function getTitle(title: string) {
  const suffix =
    process.env.NEXT_PUBLIC_LOCALE === 'nl'
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
