import { Box } from '~/components-styled/base';
import { MaxWidth } from '~/components-styled/max-width';
import { FCWithLayout, getLayoutWithMetadata } from '~/domain/layout/layout';
import { EditorialSummary } from '~/domain/topical/editorial-teaser';
import siteText, { targetLanguage } from '~/locale';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
} from '~/static-props/get-data';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<EditorialSummary[]>(
    `*[_type == 'editorial'] | order(publicationDate) {"title":title.${targetLanguage}, slug, "summary":summary.${targetLanguage}, cover}`
  )
);

const EditorialsOverview: FCWithLayout<typeof getStaticProps> = (props) => {
  const { content } = props;

  return (
    <Box backgroundColor="white" py={{ _: 4, md: 5 }}>
      <MaxWidth>{content.map((ed) => ed.title)}</MaxWidth>
    </Box>
  );
};

EditorialsOverview.getLayout = getLayoutWithMetadata(
  siteText.articles_metadata
);

export default EditorialsOverview;
