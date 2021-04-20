import { Layout } from '~/domain/layout/layout';
import { NationalLayout } from '~/domain/layout/national-layout';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  getLastGeneratedDate,
  selectDefaultNlData,
} from '~/static-props/get-data';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectDefaultNlData()
);

const National = (props: StaticProps<typeof getStaticProps>) => {
  const { siteText } = useIntl();
  const { selectedNlData: data, lastGenerated } = props;
  return (
    <Layout {...siteText.nationaal_metadata} lastGenerated={lastGenerated}>
      <NationalLayout data={data} lastGenerated={lastGenerated} />
    </Layout>
  );
};

export default National;
