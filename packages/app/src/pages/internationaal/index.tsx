import { InternationalLayout } from '~/domain/layout/international-layout';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import { getLastGeneratedDate } from '~/static-props/get-data';

export const getStaticProps = createGetStaticProps(getLastGeneratedDate);

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
      <InternationalLayout lastGenerated={lastGenerated} />
    </Layout>
  );
}
