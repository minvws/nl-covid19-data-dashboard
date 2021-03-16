import { getVrData, getLastGeneratedDate } from '~/static-props/get-data';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import { Layout } from '~/domain/layout/layout';
import { SafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import { useIntl } from '~/intl';

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getVrData
);

const SafetyRegion = (props) => {
  const { lastGenerated } = props;
  const { siteText } = useIntl();

  return (
    <Layout
      {...siteText.veiligheidsregio_index.metadata}
      lastGenerated={lastGenerated}
    >
      <SafetyRegionLayout lastGenerated={lastGenerated} />
    </Layout>
  );
};

export default SafetyRegion;
