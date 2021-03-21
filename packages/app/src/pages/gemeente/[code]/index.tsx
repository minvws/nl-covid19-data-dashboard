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
import { reverseRouter } from '~/utils/reverse-router';
import { useBreakpoints } from '~/utils/useBreakpoints';

export { getStaticPaths } from '~/static-paths/gm';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getGmData
);

const Municipality = (props: StaticProps<typeof getStaticProps>) => {
  const { lastGenerated } = props;
  const { siteText } = useIntl();
  const router = useRouter();
  const breakpoints = useBreakpoints();

  useEffect(() => {
    const menuSuffix = !breakpoints.md ? '?menu=1' : '';
    const route =
      reverseRouter.gm.positiefGetesteMensen(router.query.code as string) +
      menuSuffix;

    router.replace(route);
  }, [breakpoints.md, router]);

  return (
    <Layout {...siteText.gemeente_index.metadata} lastGenerated={lastGenerated}>
      <MunicipalityLayout lastGenerated={lastGenerated} />
    </Layout>
  );
};

export default Municipality;
