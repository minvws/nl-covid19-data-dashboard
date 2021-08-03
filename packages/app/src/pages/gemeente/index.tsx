import { useRouter } from 'next/router';
import { Box } from '~/components/base';
import { GmNavigationMap } from '~/components/choropleth';
import { TooltipContent } from '~/components/choropleth/tooltips';
import { Heading, Text } from '~/components/typography';
import { GmComboBox } from '~/domain/layout/components/gm-combo-box';
import { GmLayout } from '~/domain/layout/gm-layout';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import { getLastGeneratedDate } from '~/static-props/get-data';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useReverseRouter } from '~/utils/use-reverse-router';

export const getStaticProps = createGetStaticProps(getLastGeneratedDate);

const Municipality = (props: StaticProps<typeof getStaticProps>) => {
  const { lastGenerated } = props;
  const { siteText } = useIntl();
  const reverseRouter = useReverseRouter();
  const router = useRouter();
  const code = router.query.code as string;

  const breakpoints = useBreakpoints();

  const metadata = {
    ...siteText.gemeente_index.metadata,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <GmLayout isLandingPage lastGenerated={lastGenerated} code={code}>
        {!breakpoints.md && (
          <Box bg="white">
            <GmComboBox />
          </Box>
        )}

        <Box as="article" p={4}>
          <Heading level={2} as="h1">
            {siteText.gemeente_index.selecteer_titel}
          </Heading>
          <Text>{siteText.gemeente_index.selecteer_toelichting}</Text>

          <Box
            display="flex"
            justifyContent="center"
            width="100%"
            height="120vw"
            maxWidth={750}
            maxHeight={960}
            margin="0 auto"
          >
            <GmNavigationMap
              tooltipContent={(context) => (
                <TooltipContent
                  title={context.gemnaam}
                  link={reverseRouter.gm.index(context.gmcode)}
                />
              )}
            />
          </Box>
        </Box>
      </GmLayout>
    </Layout>
  );
};

export default Municipality;
