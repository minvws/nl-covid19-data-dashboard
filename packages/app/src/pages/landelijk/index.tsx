import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import { getLastGeneratedDate } from '~/static-props/get-data';

export const getStaticProps = createGetStaticProps(getLastGeneratedDate);

const National = (props: StaticProps<typeof getStaticProps>) => {
  const { siteText } = useIntl();
  const { lastGenerated } = props;

  const router = useRouter();

  useEffect(() => {
    router.push('/landelijk/vaccinaties');
  }, [router]);

  return (
    <Layout {...siteText.nationaal_metadata} lastGenerated={lastGenerated}>
      <NlLayout />
    </Layout>
  );
};

export default National;
