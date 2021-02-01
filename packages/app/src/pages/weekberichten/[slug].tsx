import { Box } from '~/components-styled/base';
import { EditorialDetail } from '~/components-styled/editorial-detail';
import { FCWithLayout, getLayoutWithMetadata } from '~/domain/layout/layout';
import { client, localize } from '~/lib/sanity';
import { targetLanguage } from '~/locale/index';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { Block, Editorial } from '~/types/cms';
import { assert } from '~/utils/assert';
import { imageResizeTargets } from '@corona-dashboard/common';
import { findClosestSize } from '~/utils/findClosestSize';

const editorialsQuery = `*[_type == 'editorial'] {"slug":slug.current}`;

export async function getStaticPaths() {
  const editorialData = await client.fetch(editorialsQuery);
  const editorials = localize<{ slug: string }[]>(editorialData, [
    targetLanguage,
    'nl',
  ]);

  const paths = editorials.map((editorial) => ({
    params: { slug: editorial.slug },
  }));

  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<Editorial>((context) => {
    assert(context?.params?.slug, 'Slug required to retrieve article');
    return `
      *[_type == 'editorial' && slug.current == '${context.params.slug}'][0]{
        ...,
        "cover": {
          ...cover,
          "asset": cover.asset->
        },
        "content": {
          "_type": content._type,
          "nl": [
            ...content.nl[]
            {
              ...,
              "asset": asset->
            },
          ],
          "en": [
            ...content.en[]
            {
              ...,
              "asset": asset->
            },
          ],
        }
      }
    `;
  })
);

const EditorialDetailPage: FCWithLayout<typeof getStaticProps> = (props) => {
  const { content } = props;

  return (
    <Box backgroundColor="white">
      <EditorialDetail editorial={content} />
    </Box>
  );
};

/**
 *  @TODO this implementation below is not very sexy yet, its hacked together
 * to simply have _something_
 */
EditorialDetailPage.getLayout = (page, props) => {
  const { cover } = props.content;
  const { asset } = cover;

  const url = `https://coronadashboard.rijksoverheid.nl/cms/${
    asset.assetId
  }-${findClosestSize(1200, imageResizeTargets)}.${asset.extension}`;

  return getLayoutWithMetadata({
    title: getTitle(props.content.title),
    description: toPlainText(props.content.intro),
    openGraphImage: url,
    twitterImage: url,
  })(page, props);
};

export default EditorialDetailPage;

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
