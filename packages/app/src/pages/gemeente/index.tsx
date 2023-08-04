import { colors, GmCollectionHospitalNiceChoropleth, gmData } from '@corona-dashboard/common';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { Box } from '~/components/base';
import { TooltipContent } from '~/components/choropleth/tooltips';
import { ErrorBoundary } from '~/components/error-boundary';
import { Markdown } from '~/components/markdown';
import { Heading } from '~/components/typography';
import { GmComboBox } from '~/domain/layout/components/gm-combo-box';
import { GmLayout } from '~/domain/layout/gm-layout';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { getLastGeneratedDate } from '~/static-props/get-data';
import { space } from '~/style/theme';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { DynamicChoropleth } from '../../components/choropleth';

export const getStaticProps = createGetStaticProps(getLastGeneratedDate);

const Municipality = (props: StaticProps<typeof getStaticProps>) => {
  const { lastGenerated } = props;
  const { commonTexts } = useIntl();
  const reverseRouter = useReverseRouter();
  const router = useRouter();
  const code = router.query.code as string;

  const breakpoints = useBreakpoints();

  const metadata = {
    ...commonTexts.gemeente_index.metadata,
  };

  const data = useMemo(() => {
    return gmData.map<GmCollectionHospitalNiceChoropleth>(
      (x) =>
        ({
          gmcode: x.gemcode,
          admissions_on_date_of_reporting: null,
        } as unknown as GmCollectionHospitalNiceChoropleth)
    );
  }, []);

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <GmLayout isLandingPage code={code}>
        {!breakpoints.md && (
          <Box bg="white">
            <GmComboBox selectedGmCode={code} />
          </Box>
        )}

        <Box as="article" padding={space[4]}>
          <Heading level={2} as="h1">
            {commonTexts.gemeente_index.selecteer_titel}
          </Heading>
          <Markdown content={commonTexts.gemeente_index.selecteer_toelichting} />

          <Box display="flex" flex="1" justifyContent="center" height="75vh" width="100%" maxHeight="960px" flexDirection="column" spacing={3}>
            <ErrorBoundary>
              <DynamicChoropleth
                accessibility={{
                  key: 'municipality_navigation_map',
                  features: ['keyboard_choropleth'],
                }}
                map="gm"
                data={data}
                minHeight={0}
                dataConfig={{
                  metricName: 'gemeente' as any,
                  metricProperty: 'admissions_on_date_of_admission',
                  areaStroke: colors.white,
                  areaStrokeWidth: 1,
                  hoverFill: colors.white,
                  hoverStrokeWidth: 3,
                  noDataFillColor: colors.gray2,
                }}
                dataOptions={{
                  getLink: reverseRouter.gm.index,
                }}
                formatTooltip={(context) => <TooltipContent title={context.featureName} link={reverseRouter.gm.index(context.dataItem.gmcode)} />}
              />
            </ErrorBoundary>
          </Box>
        </Box>
      </GmLayout>
    </Layout>
  );
};

export default Municipality;
