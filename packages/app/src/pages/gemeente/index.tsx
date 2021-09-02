import { GmCollectionHospitalNice } from '@corona-dashboard/common';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { Box } from '~/components/base';
import { TooltipContent } from '~/components/choropleth/tooltips';
import { ErrorBoundary } from '~/components/error-boundary';
import { Heading, Text } from '~/components/typography';
import { gmData } from '~/data/gm';
import { GmComboBox } from '~/domain/layout/components/gm-combo-box';
import { GmLayout } from '~/domain/layout/gm-layout';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import { getLastGeneratedDate } from '~/static-props/get-data';
import { colors } from '~/style/theme';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { DynamicChoropleth } from '../../components/choropleth';

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

  const data = useMemo(() => {
    return gmData.map<GmCollectionHospitalNice>(
      (x) =>
        ({
          gmcode: x.gemcode,
          admissions_on_date_of_reporting: null,
        } as unknown as GmCollectionHospitalNice)
    );
  }, []);

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
            flex="1"
            justifyContent="center"
            height="120vw"
            maxWidth={750}
            maxHeight={960}
            flexDirection="column"
            spacing={3}
          >
            <ErrorBoundary>
              <DynamicChoropleth
                renderTarget="canvas"
                accessibility={{
                  key: 'municipality_navigation_map',
                  features: ['keyboard_choropleth'],
                }}
                map="gm"
                data={data}
                minHeight={650}
                dataConfig={{
                  metricName: 'gemeente' as any,
                  metricProperty: 'admissions_on_date_of_reporting',
                  areaStroke: colors.blue,
                  areaStrokeWidth: 0.5,
                  hoverFill: colors.blue,
                  hoverStrokeWidth: 0.5,
                  noDataFillColor: colors.white,
                }}
                dataOptions={{
                  getLink: reverseRouter.gm.index,
                }}
                formatTooltip={(context) => (
                  <TooltipContent
                    title={context.featureName}
                    link={reverseRouter.gm.index(context.dataItem.gmcode)}
                  />
                )}
              />
            </ErrorBoundary>
          </Box>
        </Box>
      </GmLayout>
    </Layout>
  );
};

export default Municipality;
