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
import { reverseRouter } from '~/utils/reverse-router';
import { useBreakpoints } from '~/utils/useBreakpoints';

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getVrData
);

const SafetyRegion = (props: StaticProps<typeof getStaticProps>) => {
  const { lastGenerated } = props;
  const { siteText } = useIntl();
  const breakpoints = useBreakpoints();
  const router = useRouter();

  useEffect(() => {
    const menuSuffix = !breakpoints.md ? '?menu=1' : '';
    const route =
      reverseRouter.vr.risiconiveau(router.query.code as string) + menuSuffix;

    router.replace(route);
  }, [breakpoints.md, router]);

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
