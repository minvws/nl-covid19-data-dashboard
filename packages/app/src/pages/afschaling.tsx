import Head from 'next/head';
import { MaxWidth } from '~/components-styled/max-width';
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
        <MaxWidth></MaxWidth>
      </div>
    </Layout>
  );
};

export default Afschaling;
