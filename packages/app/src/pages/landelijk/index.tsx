import { getNlData, getLastGeneratedDate } from '~/static-props/get-data';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import { Layout } from '~/domain/layout/layout';
import { NationalLayout } from '~/domain/layout/national-layout';
import { useIntl } from '~/intl';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getNlData
);

const National = (props: Await<ReturnType<typeof getStaticProps>>['props']) => {
  const { siteText } = useIntl();
  const { data, lastGenerated } = props;
  return (
    <Layout {...siteText.nationaal_metadata} lastGenerated={lastGenerated}>
      <NationalLayout data={data} lastGenerated={lastGenerated} />
    </Layout>
  );
};

export default National;
