import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Layout } from '~/domain/layout/layout';
import { SafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import { getLastGeneratedDate, getVrData } from '~/static-props/get-data';
import { useReverseRouter } from '~/utils/use-reverse-router';

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getVrData
);

const SafetyRegion = (props: StaticProps<typeof getStaticProps>) => {
  const { data, lastGenerated, safetyRegionName } = props;
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
      <SafetyRegionLayout
        data={data}
        safetyRegionName={safetyRegionName}
        lastGenerated={lastGenerated}
      />
    </Layout>
  );
};

export default SafetyRegion;
