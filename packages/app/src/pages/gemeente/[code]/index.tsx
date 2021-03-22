import { getGmData, getLastGeneratedDate } from '~/static-props/get-data';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import { MunicipalityLayout } from '~/domain/layout/municipality-layout';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';

export { getStaticPaths } from '~/static-paths/gm';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getGmData
);

const Municipality = (props: StaticProps<typeof getStaticProps>) => {
  const { data, lastGenerated } = props;
  const { siteText } = useIntl();

  return (
    <Layout {...siteText.gemeente_index.metadata} lastGenerated={lastGenerated}>
      <MunicipalityLayout data={data} lastGenerated={lastGenerated} />
    </Layout>
  );
};

export default Municipality;
