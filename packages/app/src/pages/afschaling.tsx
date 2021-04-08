import { isEmpty } from 'lodash';
import Head from 'next/head';
import { Box } from '~/components-styled/base';
import { MaxWidth } from '~/components-styled/max-width';
import { WarningTile } from '~/components-styled/warning-tile';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import { getLastGeneratedDate } from '~/static-props/get-data';

export const getStaticProps = createGetStaticProps(getLastGeneratedDate);

const Afschaling = (props: StaticProps<typeof getStaticProps>) => {
  const { siteText } = useIntl();
  const { lastGenerated } = props;

  const reproduction_is_below_threshold = false;
  const intensive_care_is_below_threshold = true;
  const hospital_nice_is_below_threshold = false;

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

      <div>
        <MaxWidth>
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

          <Box py={5}>
            <Box>test</Box>
          </Box>
        </MaxWidth>
      </div>
    </Layout>
  );
};

export default Afschaling;
