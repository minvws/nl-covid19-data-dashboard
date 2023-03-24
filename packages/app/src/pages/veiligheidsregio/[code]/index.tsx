import { Layout } from '~/domain/layout/layout';
import { VrLayout } from '~/domain/layout/vr-layout';
import { useIntl } from '~/intl';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { getLastGeneratedDate, selectVrData } from '~/static-props/get-data';
export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(getLastGeneratedDate, selectVrData());

const VrIndexPage = (props: StaticProps<typeof getStaticProps>) => {
  const { lastGenerated } = props;
  const { commonTexts } = useIntl();

  return (
    <Layout {...commonTexts.veiligheidsregio_index.metadata} lastGenerated={lastGenerated}>
      <VrLayout />
    </Layout>
  );
};

export default VrIndexPage;
