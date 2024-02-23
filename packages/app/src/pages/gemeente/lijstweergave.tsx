import { getLastGeneratedDate } from '~/static-props/get-data';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { useIntl } from '~/intl';
import { useRouter } from 'next/router';
import { GmLayout, Layout } from '~/domain/layout';
import { Box } from '~/components/base';

export const getStaticProps = createGetStaticProps(getLastGeneratedDate);

const ListOverview = (props: StaticProps<typeof getStaticProps>) => {
  const { lastGenerated } = props;
  const { commonTexts } = useIntl();
  //const reverseRouter = useReverseRouter();
  const router = useRouter();
  const code = router.query.code as string;
  // const breakpoints = useBreakpoints();

  const metadata = {
    ...commonTexts.gemeente_list_overview.metadata,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <GmLayout isLandingPage code={code}>
        <Box></Box>
      </GmLayout>
    </Layout>
  );
};
export default ListOverview;
