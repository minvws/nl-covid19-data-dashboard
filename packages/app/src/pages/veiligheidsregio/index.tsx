import { VrCollectionHospitalNice } from '@corona-dashboard/common';
import { useMemo } from 'react';
import { Box } from '~/components/base';
import { TooltipContent } from '~/components/choropleth/tooltips';
import { ErrorBoundary } from '~/components/error-boundary';
import { Markdown } from '~/components/markdown';
import { Heading } from '~/components/typography';
import { WarningTile } from '~/components/warning-tile';
import { vrData } from '~/data/vr';
import { VrComboBox } from '~/domain/layout/components/vr-combo-box';
import { Layout } from '~/domain/layout/layout';
import { VrLayout } from '~/domain/layout/vr-layout';
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

const VrIndexPage = (props: StaticProps<typeof getStaticProps>) => {
  const breakpoints = useBreakpoints();
  const reverseRouter = useReverseRouter();
  const { siteText } = useIntl();

  const { lastGenerated } = props;

  const metadata = {
    ...siteText.veiligheidsregio_index.metadata,
  };

  const data = useMemo(() => {
    return vrData.map<VrCollectionHospitalNice>(
      (x) =>
        ({
          vrcode: x.code,
          admissions_on_date_of_reporting: null,
        } as unknown as VrCollectionHospitalNice)
    );
  }, []);

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <VrLayout isLandingPage>
        {!breakpoints.md && (
          <Box bg="white">
            <VrComboBox />
          </Box>
        )}

        <Box as="article" p={4} spacing={3}>
          {siteText.regionaal_index.belangrijk_bericht && (
            <WarningTile
              message={siteText.regionaal_index.belangrijk_bericht}
              variant="emphasis"
            />
          )}

          <Heading level={2} as="h1">
            {siteText.veiligheidsregio_index.selecteer_titel}
          </Heading>
          <Markdown
            content={siteText.veiligheidsregio_index.selecteer_toelichting}
          />

          <Box
            display="flex"
            flex="1"
            justifyContent="center"
            height="75vh"
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
                map="vr"
                data={data}
                minHeight={650}
                dataConfig={{
                  metricName: 'veiligheidsregio' as any,
                  metricProperty: 'admissions_on_date_of_reporting',
                  areaStroke: colors.blue,
                  areaStrokeWidth: 0.5,
                  hoverFill: colors.blue,
                  hoverStrokeWidth: 0.5,
                  noDataFillColor: colors.white,
                }}
                dataOptions={{
                  getLink: reverseRouter.vr.index,
                }}
                formatTooltip={(context) => (
                  <TooltipContent
                    title={context.featureName}
                    link={reverseRouter.vr.index(context.dataItem.vrcode)}
                  />
                )}
              />
            </ErrorBoundary>
          </Box>
        </Box>
      </VrLayout>
    </Layout>
  );
};

export default VrIndexPage;
