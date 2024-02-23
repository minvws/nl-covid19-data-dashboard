import { ArchivedGmCollectionHospitalNiceChoropleth, gmData } from '@corona-dashboard/common';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { Box } from '~/components/base';
import { GmLayout } from '~/domain/layout/gm-layout';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { getLastGeneratedDate } from '~/static-props/get-data';
import { ChoroplethLayout } from '~/domain/gm_index/choropleth-layout';

export const getStaticProps = createGetStaticProps(getLastGeneratedDate);

const Municipality = (props: StaticProps<typeof getStaticProps>) => {
  const { lastGenerated } = props;
  const { commonTexts } = useIntl();
  //const reverseRouter = useReverseRouter();
  const router = useRouter();
  const code = router.query.code as string;

  //const breakpoints = useBreakpoints();

  const [showListAsIndexPage, switchIndexPageType] = useState<boolean>(false);

  const metadata = {
    ...commonTexts.gemeente_index.metadata,
  };

  const data = useMemo(() => {
    return gmData.map<ArchivedGmCollectionHospitalNiceChoropleth>(
      (x) =>
        ({
          gmcode: x.gemcode,
          admissions_on_date_of_reporting: null,
        } as unknown as ArchivedGmCollectionHospitalNiceChoropleth)
    );
  }, []);

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <GmLayout isLandingPage code={code} showListAsIndexPage={showListAsIndexPage} switchIndexPageType={() => switchIndexPageType(!showListAsIndexPage)}>
        {showListAsIndexPage ? <Box>hoi</Box> : <ChoroplethLayout code={code} data={data} switchIndexPageType={() => switchIndexPageType(!showListAsIndexPage)} />}
      </GmLayout>
    </Layout>
  );
};

export default Municipality;
