import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { FCWithLayout } from '~/domain/layout/layout';
import { getSafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import { getLastGeneratedDate, getVrData } from '~/static-props/get-data';
import { reverseRouter } from '~/utils/reverse-router';
import { useBreakpoints } from '~/utils/useBreakpoints';

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getVrData
);

const SafetyRegion: FCWithLayout<typeof getStaticProps> = () => {
  const router = useRouter();
  const breakpoints = useBreakpoints();

  useEffect(() => {
    const menuSuffix = !breakpoints.md ? '?menu=1' : '';
    const route =
      reverseRouter.vr.risiconiveau(router.query.code as string) + menuSuffix;

    router.replace(route);
  }, [breakpoints.md, router]);

  return null;
};

SafetyRegion.getLayout = getSafetyRegionLayout();

export default SafetyRegion;
