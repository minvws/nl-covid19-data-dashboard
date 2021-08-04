import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { GmLayout } from '~/domain/layout/gm-layout';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  getLastGeneratedDate,
  selectGmPageMetricData,
} from '~/static-props/get-data';
import { useReverseRouter } from '~/utils/use-reverse-router';

export { getStaticPaths } from '~/static-paths/gm';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectGmPageMetricData('code', 'difference')
);

const Municipality = (props: StaticProps<typeof getStaticProps>) => {
  const { lastGenerated, municipalityName, sideBarData, selectedGmData } =
    props;
  const router = useRouter();
  const { siteText } = useIntl();
  const reverseRouter = useReverseRouter();

  useEffect(() => {
    const route = reverseRouter.gm.index(router.query.code as string);
    router.replace(route);
  }, [reverseRouter.gm, reverseRouter.vr, router]);

  return (
    <Layout {...siteText.gemeente_index.metadata} lastGenerated={lastGenerated}>
      <GmLayout
        code={selectedGmData.code}
        difference={selectedGmData.difference}
        data={sideBarData}
        municipalityName={municipalityName}
        lastGenerated={lastGenerated}
      />
    </Layout>
  );
};

export default Municipality;
