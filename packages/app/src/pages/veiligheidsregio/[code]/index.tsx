import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Layout } from '~/domain/layout/layout';
import { VrLayout } from '~/domain/layout/vr-layout';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  getLastGeneratedDate,
  selectVrPageMetricData,
} from '~/static-props/get-data';
import { useReverseRouter } from '~/utils/use-reverse-router';

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectVrPageMetricData()
);

const VrIndexPage = (props: StaticProps<typeof getStaticProps>) => {
  const { selectedVrData: data, lastGenerated, vrName } = props;
  const { siteText } = useIntl();
  const router = useRouter();
  const reverseRouter = useReverseRouter();

  useEffect(() => {
    const route = reverseRouter.vr.index(router.query.code as string);
    router.replace(route);
  }, [reverseRouter.vr, router]);

  return (
    <Layout
      {...siteText.veiligheidsregio_index.metadata}
      lastGenerated={lastGenerated}
    >
      <VrLayout data={data} vrName={vrName} lastGenerated={lastGenerated} />
    </Layout>
  );
};

export default VrIndexPage;
