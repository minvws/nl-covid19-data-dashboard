import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { FCWithLayout } from '~/domain/layout/layout';
import { getMunicipalityLayout } from '~/domain/layout/municipality-layout';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import { getGmData, getLastGeneratedDate } from '~/static-props/get-data';
import { reverseRouter } from '~/utils/reverse-router';
import { useBreakpoints } from '~/utils/useBreakpoints';

export { getStaticPaths } from '~/static-paths/gm';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getGmData
);

const Municipality: FCWithLayout<typeof getStaticProps> = () => {
  const router = useRouter();
  const breakpoints = useBreakpoints();

  useEffect(() => {
    const menuSuffix = !breakpoints.md ? '?menu=1' : '';
    const route =
      reverseRouter.gm.positiefGetesteMensen(router.query.code as string) +
      menuSuffix;

    router.replace(route);
  }, [breakpoints.md, router]);

  return null;
};
Municipality.getLayout = getMunicipalityLayout();

export default Municipality;
