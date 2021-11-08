import {
  colors,
  GmCollectionHospitalNice,
  gmData,
} from '@corona-dashboard/common';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { Box } from '~/components/base';
import { DynamicChoropleth } from '~/components/choropleth';
import { TooltipContent } from '~/components/choropleth/tooltips';
import { ErrorBoundary } from '~/components/error-boundary';
import { Markdown } from '~/components/markdown';
import { Heading } from '~/components/typography';
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
    ...siteText.gemeente_actueel.index.metadata,
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
      <GmLayout isLandingPage code={code} getLink={reverseRouter.actueel.gm}>
        {!breakpoints.md && (
          <Box bg="white">
            <GmComboBox getLink={reverseRouter.actueel.gm} />
          </Box>
        )}

        <Box as="article" p={4}>
          <Heading level={2} as="h1">
            {siteText.gemeente_actueel.index.title}
          </Heading>

          <Markdown content={siteText.gemeente_actueel.index.description} />

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
                map="gm"
                data={data}
                minHeight={650}
                dataConfig={{
                  metricName: 'gemeente' as any,
                  metricProperty: 'admissions_on_date_of_reporting',
                  areaStroke: colors.white,
                  areaStrokeWidth: 1,
                  hoverFill: colors.white,
                  hoverStrokeWidth: 3,
                  noDataFillColor: colors.lightGray,
                }}
                dataOptions={{
                  getLink: reverseRouter.actueel.gm,
                }}
                formatTooltip={(context) => (
                  <TooltipContent
                    title={context.featureName}
                    link={reverseRouter.actueel.gm(context.dataItem.gmcode)}
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
