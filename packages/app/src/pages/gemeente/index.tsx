import { Box } from '~/components/base';
import { colors, ArchivedGmCollectionHospitalNiceChoropleth, gmData } from '@corona-dashboard/common';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { DynamicChoropleth } from '../../components/choropleth';
import { ErrorBoundary } from '~/components/error-boundary';
import { getLastGeneratedDate } from '~/static-props/get-data';
import { GmComboBox } from '~/domain/layout/components/gm-combo-box';
import { GmLayout } from '~/domain/layout/gm-layout';
import { Heading } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { Markdown } from '~/components/markdown';
import { Menu, MenuItemLink } from '~/components/aside/menu';
import { space } from '~/style/theme';
import { TooltipContent } from '~/components/choropleth/tooltips';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useIntl } from '~/intl';
import { useMemo } from 'react';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { useRouter } from 'next/router';
import { List } from '@corona-dashboard/icons';

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

        {!breakpoints.md && (
          <Menu>
            <MenuItemLink icon={<List />} title="LijstWeergave" href={'/landelijk'} showArrow isLinkForMainMenu={false} />
          </Menu>
        )}
      </GmLayout>
    </Layout>
  );
};

export default Municipality;
