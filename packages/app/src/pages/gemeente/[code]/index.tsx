import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Layout } from '~/domain/layout/layout';
import { MunicipalityLayout } from '~/domain/layout/municipality-layout';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import { getGmData, getLastGeneratedDate } from '~/static-props/get-data';
import { useReverseRouter } from '~/utils/use-reverse-router';

export { getStaticPaths } from '~/static-paths/gm';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getGmData
);

const Municipality = (props: StaticProps<typeof getStaticProps>) => {
  const { data, lastGenerated } = props;
  const router = useRouter();
  const { siteText } = useIntl();
  const reverseRouter = useReverseRouter();

  useEffect(() => {
    const route = reverseRouter.gm.index(router.query.code as string);
    router.replace(route);
  }, [reverseRouter.gm, reverseRouter.vr, router]);

  return (
    <Layout {...siteText.gemeente_index.metadata} lastGenerated={lastGenerated}>
      <MunicipalityLayout data={data} lastGenerated={lastGenerated} />
    </Layout>
  );
};

export default Municipality;
