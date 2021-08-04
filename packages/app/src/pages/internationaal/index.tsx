import { InLayout } from '~/domain/layout/in-layout';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import { withFeatureNotFoundPage } from '~/lib/features';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import { getLastGeneratedDate } from '~/static-props/get-data';

export const getStaticProps = withFeatureNotFoundPage(
  'inHomePage',
  createGetStaticProps(getLastGeneratedDate)
);

export default function InternationalPage(
  props: StaticProps<typeof getStaticProps>
) {
  const intl = useIntl();
  const { lastGenerated } = props;

  return (
    <Layout
      {...intl.siteText.internationaal_metadata}
      lastGenerated={lastGenerated}
    >
      <InLayout lastGenerated={lastGenerated} />
    </Layout>
  );
}
