import { isEmpty } from 'lodash';
import Head from 'next/head';
import { Box } from '~/components-styled/base';
import { ContentBlock } from '~/components-styled/cms/content-block';
import { RichContent } from '~/components-styled/cms/rich-content';
import { Heading } from '~/components-styled/typography';
import { WarningTile } from '~/components-styled/warning-tile';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { AfschalingsPage } from '~/types/cms';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<AfschalingsPage>(
    (_context) => `*[_type == 'afschalingPage'][0]`
  )
);

const Afschaling = (props: StaticProps<typeof getStaticProps>) => {
  const { siteText } = useIntl();
  const { lastGenerated, content } = props;

  return (
    <Layout {...siteText.over_metadata} lastGenerated={lastGenerated}>
      <Head>
        <link
          key="dc-type"
          rel="dcterms:type"
          href="https://standaarden.overheid.nl/owms/terms/webpagina"
        />
        <link
          key="dc-type-title"
          rel="dcterms:type"
          href="https://standaarden.overheid.nl/owms/terms/webpagina"
          title="webpagina"
        />
      </Head>

      <Box bg="white" pt="5em" pb="3em">
        <ContentBlock spacing={3}>
          <Box
            borderBottom="1px"
            borderBottomColor="border"
            borderBottomStyle="solid"
          >
            <Heading level={1}>{content.pageTitle}</Heading>
            <RichContent blocks={content.pageDescription} />
          </Box>
          {!isEmpty(
            siteText.nationaal_actueel.risiconiveaus.belangrijk_bericht
          ) && (
            <Box mb={3}>
              <WarningTile
                message={
                  siteText.nationaal_actueel.risiconiveaus.belangrijk_bericht
                }
                variant="emphasis"
              />
            </Box>
          )}
          <Heading level={2}>{content.explanationTitle}</Heading>
          <RichContent blocks={content.explanationDescription} />
        </ContentBlock>
      </Box>
    </Layout>
  );
};

export default Afschaling;
