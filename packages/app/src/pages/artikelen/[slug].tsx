import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { ArticleDetail } from '~/components/articles/article-detail';
import { Box } from '~/components/base';
import { Layout } from '~/domain/layout/layout';
import { getClient, getImageSrc } from '~/lib/sanity';
import { Languages, SiteText } from '~/locale';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { createGetContent, getLastGeneratedDate, getLokalizeTexts } from '~/static-props/get-data';
import { Article, Block, RichContentBlock } from '~/types/cms';
import { assert } from '~/utils/assert';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';

const selectLokalizeTexts = (siteText: SiteText) => ({
  textTopicalPageShared: siteText.pages.topical_page.shared,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

const articlesQuery = `*[_type == 'article'] {"slug":slug.current}`;

export async function getStaticPaths() {
  const articlesData = await (await getClient()).fetch(articlesQuery);

  /**
   * getStaticPaths needs explicit locale routes to function properly...
   */
  const paths = articlesData.flatMap((article: { slug: string }) => [
    {
      params: { slug: article.slug },
      locale: 'en',
    },
    {
      params: { slug: article.slug },
      locale: 'nl',
    },
  ]);

  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  createGetContent<Article>((context) => {
    const { locale } = context;

    assert(context?.params?.slug, `[${getStaticProps.name}:artikelen] Slug required to retrieve article`);
    return `*[_type == 'article' && slug.current == '${context.params.slug}']{
      ...,
      "slug": slug.current,
      "cover": {
        ...cover,
        "${locale}": [
          ...cover.${locale}[]
        ]
      },
      categories,
      "intro": {
        ...intro,
        "${locale}": [
          ...intro.${locale}[]
        ]
      },
      "content": {
        "_type": content._type,
        "${locale}": [
          ...content.${locale}[]
        ]
      }
    }[0]`;
  })
);

const ArticleDetailPage = (props: StaticProps<typeof getStaticProps>) => {
  const { content, lastGenerated, pageText } = props;
  const { locale = 'nl' } = useRouter();

  const { textTopicalPageShared } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);

  const { cover } = content;
  const { asset } = cover;

  const imgPath = asset ? getImageSrc(asset, 1200) : undefined;

  const metadata = {
    title: getTitle(props.content.title, locale),
    description: toPlainText(props.content.intro),
    openGraphImage: imgPath,
    twitterImage: imgPath,
  };

  const breadcrumbsData = useMemo(() => ({ [props.content.slug.current]: props.content.title }), [props.content.slug, props.content.title]);

  return (
    <Layout lastGenerated={lastGenerated} breadcrumbsData={breadcrumbsData} {...metadata}>
      <Box backgroundColor="white">
        <ArticleDetail article={content} text={textTopicalPageShared} />
      </Box>
    </Layout>
  );
};

export default ArticleDetailPage;

function getTitle(title: string, locale: string) {
  const suffix = locale === 'nl' ? 'Dashboard Coronavirus | Rijksoverheid.nl' : 'Dashboard Coronavirus | Government.nl';

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
