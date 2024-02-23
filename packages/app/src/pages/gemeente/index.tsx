import { useRouter } from 'next/router';
import { useState } from 'react';
import { GmLayout } from '~/domain/layout/gm-layout';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { getLastGeneratedDate } from '~/static-props/get-data';
import { ChoroplethLayout } from '~/domain/gm_index/choropleth-layout';
import { ListOverview } from '~/domain/gm_index/list-overview';

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

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <GmLayout isLandingPage code={code} showListAsIndexPage={showListAsIndexPage} switchIndexPageType={() => switchIndexPageType(!showListAsIndexPage)}>
        {showListAsIndexPage ? <ListOverview /> : <ChoroplethLayout code={code} switchIndexPageType={() => switchIndexPageType(!showListAsIndexPage)} />}
      </GmLayout>
    </Layout>
  );
};

export default Municipality;
