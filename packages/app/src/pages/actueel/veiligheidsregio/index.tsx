import {
  colors,
  VrCollectionHospitalNice,
  vrData,
} from '@corona-dashboard/common';
import { useMemo } from 'react';
import { Box } from '~/components/base';
import { DynamicChoropleth } from '~/components/choropleth';
import { TooltipContent } from '~/components/choropleth/tooltips';
import { ErrorBoundary } from '~/components/error-boundary';
import { Markdown } from '~/components/markdown';
import { Heading } from '~/components/typography';
import { WarningTile } from '~/components/warning-tile';
import { VrComboBox } from '~/domain/layout/components/vr-combo-box';
import { Layout } from '~/domain/layout/layout';
import { VrLayout } from '~/domain/layout/vr-layout';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import { getLastGeneratedDate } from '~/static-props/get-data';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useReverseRouter } from '~/utils/use-reverse-router';

export const getStaticProps = createGetStaticProps(getLastGeneratedDate);

const VrIndexPage = (props: StaticProps<typeof getStaticProps>) => {
  const breakpoints = useBreakpoints();
  const reverseRouter = useReverseRouter();
  const { siteText } = useIntl();

  const { lastGenerated } = props;

  const metadata = {
    ...siteText.veiligheidsregio_actueel.index.metadata,
  };

  const data = useMemo(() => {
    return vrData.map<VrCollectionHospitalNice>(
      (x) =>
        ({
          vrcode: x.code,
          admissions_on_date_of_admission: null,
        } as unknown as VrCollectionHospitalNice)
    );
  }, []);

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <VrLayout isLandingPage getLink={reverseRouter.actueel.vr}>
        {!breakpoints.md && (
          <Box bg="white">
            <VrComboBox getLink={reverseRouter.actueel.vr} />
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
            {siteText.veiligheidsregio_actueel.index.title}
          </Heading>

          <Markdown
            content={siteText.veiligheidsregio_actueel.index.description}
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
                accessibility={{
                  key: 'municipality_navigation_map',
                  features: ['keyboard_choropleth'],
                }}
                map="vr"
                data={data}
                minHeight={650}
                dataConfig={{
                  metricName: 'veiligheidsregio' as any,
                  metricProperty: 'admissions_on_date_of_admission',
                  areaStroke: colors.white,
                  areaStrokeWidth: 1,
                  hoverFill: colors.white,
                  hoverStrokeWidth: 3,
                  noDataFillColor: colors.lightGray,
                }}
                dataOptions={{
                  getLink: reverseRouter.actueel.vr,
                }}
                formatTooltip={(context) => (
                  <TooltipContent
                    title={context.featureName}
                    link={reverseRouter.actueel.vr(context.dataItem.vrcode)}
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
