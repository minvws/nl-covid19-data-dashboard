import { colors, VrCollectionHospitalNice, vrData } from '@corona-dashboard/common';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { Box } from '~/components/base';
import { TooltipContent } from '~/components/choropleth/tooltips';
import { ErrorBoundary } from '~/components/error-boundary';
import { Markdown } from '~/components/markdown';
import { Heading } from '~/components/typography';
import { WarningTile } from '~/components/warning-tile';
import { VrComboBox } from '~/domain/layout/components/vr-combo-box';
import { Layout } from '~/domain/layout/layout';
import { VrLayout } from '~/domain/layout/vr-layout';
import { useIntl } from '~/intl';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { getLastGeneratedDate } from '~/static-props/get-data';
import { space } from '~/style/theme';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { DynamicChoropleth } from '../../components/choropleth';

export const getStaticProps = createGetStaticProps(getLastGeneratedDate);

const VrIndexPage = (props: StaticProps<typeof getStaticProps>) => {
  const breakpoints = useBreakpoints();
  const reverseRouter = useReverseRouter();
  const router = useRouter();
  const { commonTexts } = useIntl();

  const { lastGenerated } = props;

  const metadata = {
    ...commonTexts.veiligheidsregio_index.metadata,
  };
  const code = router.query.code as string;

  const data = useMemo(
    () =>
      vrData.map<VrCollectionHospitalNice>((x) => ({
        date_unix: 0,
        admissions_on_date_of_admission: 0,
        admissions_on_date_of_admission_per_100000: 0,
        admissions_on_date_of_reporting: 0,
        date_of_insertion_unix: 0,
        vrcode: x.code,
      })),
    []
  );

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <VrLayout isLandingPage>
        {!breakpoints.md && (
          <Box bg="white">
            <VrComboBox selectedVrCode={code} />
          </Box>
        )}

        <Box as="article" padding={space[4]} spacing={3}>
          {commonTexts.regionaal_index.belangrijk_bericht && <WarningTile message={commonTexts.regionaal_index.belangrijk_bericht} variant="emphasis" />}

          <Heading level={2} as="h1">
            {commonTexts.veiligheidsregio_index.selecteer_titel}
          </Heading>
          <Markdown content={commonTexts.veiligheidsregio_index.selecteer_toelichting} />

          <Box display="flex" flex="1" justifyContent="center" height="75vh" maxHeight="960px" width="100%" flexDirection="column" spacing={3}>
            <ErrorBoundary>
              <DynamicChoropleth
                accessibility={{
                  key: 'municipality_navigation_map',
                  features: ['keyboard_choropleth'],
                }}
                map="vr"
                data={data}
                minHeight={0}
                dataConfig={{
                  metricName: 'veiligheidsregio' as any,
                  metricProperty: 'admissions_on_date_of_admission',
                  areaStroke: colors.white,
                  areaStrokeWidth: 1,
                  hoverFill: colors.white,
                  hoverStrokeWidth: 3,
                  noDataFillColor: colors.gray2,
                }}
                dataOptions={{
                  getLink: reverseRouter.vr.index,
                }}
                formatTooltip={(context) => <TooltipContent title={context.featureName} link={reverseRouter.vr.index(context.dataItem.vrcode)} />}
              />
            </ErrorBoundary>
          </Box>
        </Box>
      </VrLayout>
    </Layout>
  );
};

export default VrIndexPage;
