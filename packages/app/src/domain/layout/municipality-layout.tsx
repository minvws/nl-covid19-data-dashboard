import { Municipal } from '@corona-dashboard/common';
import Head from 'next/head';
import { useRouter } from 'next/router';
import RioolwaterMonitoring from '~/assets/rioolwater-monitoring.svg';
import GetestIcon from '~/assets/test.svg';
import VirusIcon from '~/assets/virus.svg';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import { Category } from '~/components/aside/category';
import {
  CategoryMenu,
  Menu,
  MetricMenuItemLink,
} from '~/components/aside/menu';
import { Box } from '~/components/base';
import { ErrorBoundary } from '~/components/error-boundary';
import { AppContent } from '~/components/layout/app-content';
import { SidebarMetric } from '~/components/sidebar-metric';
import { Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { getSafetyRegionForMunicipalityCode } from '~/utils/get-safety-region-for-municipality-code';
import { Link } from '~/utils/link';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { MunicipalityComboBox } from './components/municipality-combo-box';

export const gmPageMetricNames = [
  'code',
  'tested_overall',
  'deceased_rivm',
  'hospital_nice',
  'sewer',
  'difference',
] as const;

export type GmPageMetricNames = typeof gmPageMetricNames[number];

export type MunicipalPageMetricData = Pick<Municipal, GmPageMetricNames>;

type MunicipalityLayoutProps = {
  lastGenerated: string;
  children?: React.ReactNode;
} & (
  | {
      data: MunicipalPageMetricData;
      municipalityName: string;
    }
  | {
      /**
       * the route `/gemeente` can render without sidebar and thus without `data`
       */
      isLandingPage: true;
      data?: undefined;
      municipalityName?: undefined;
    }
);

/**
 * MunicipalityLayout is a composition of persistent layouts.
 *
 * ## States
 *
 * ### Mobile
 * - /gemeente -> only show aside
 * - /gemeente/[metric] -> only show content (children)
 *
 * ### Desktop
 * - /gemeente -> shows aside and content (children)
 * - /gemeente/[metric] -> shows aside and content (children)
 *
 * More info on persistent layouts:
 * https://adamwathan.me/2019/10/17/persistent-layout-patterns-in-nextjs/
 */
export function MunicipalityLayout(props: MunicipalityLayoutProps) {
  const { children, data, municipalityName } = props;

  const { siteText } = useIntl();
  const router = useRouter();
  const reverseRouter = useReverseRouter();
  const code = router.query.code as string;

  const showMetricLinks = router.route !== '/gemeente';

  const isMainRoute =
    router.route === '/gemeente' || router.route === `/gemeente/[code]`;

  const safetyRegion = getSafetyRegionForMunicipalityCode(code);

  return (
    <>
      <Head>
        <link
          key="dc-spatial"
          rel="dcterms:spatial"
          href="https://standaarden.overheid.nl/owms/terms/Nederland"
        />
        <link
          key="dc-spatial-title"
          rel="dcterms:spatial"
          href="https://standaarden.overheid.nl/owms/terms/Nederland"
          title="Nederland"
        />
      </Head>
      <AppContent
        hideMenuButton={isMainRoute}
        searchComponent={
          <Box
            backgroundColor="white"
            maxWidth={{ _: '38rem', md: undefined }}
            mx="auto"
          >
            <MunicipalityComboBox />
          </Box>
        }
        sidebarComponent={
          <>
            {showMetricLinks && (
              <Box
                as="nav"
                /** re-mount when route changes in order to blur anchors */
                key={router.asPath}
                id="metric-navigation"
                aria-label={siteText.aria_labels.metriek_navigatie}
                role="navigation"
                backgroundColor="white"
                maxWidth={{ _: '38rem', md: undefined }}
                mx="auto"
              >
                <Box>
                  <Category>{municipalityName}</Category>
                  {safetyRegion && (
                    <Text pl={3}>
                      {siteText.common.veiligheidsregio_label}{' '}
                      <Link href={reverseRouter.vr.index(safetyRegion.code)}>
                        <a>{safetyRegion.name}</a>
                      </Link>
                    </Text>
                  )}
                </Box>
                <Menu>
                  {data && (
                    <>
                      <CategoryMenu
                        title={siteText.gemeente_layout.headings.ziekenhuizen}
                      >
                        <MetricMenuItemLink
                          href={reverseRouter.gm.ziekenhuisopnames(code)}
                          icon={<Ziekenhuis />}
                          title={
                            siteText.gemeente_ziekenhuisopnames_per_dag
                              .titel_sidebar
                          }
                        >
                          <SidebarMetric
                            data={data}
                            scope="gm"
                            metricName="hospital_nice"
                            metricProperty="admissions_on_date_of_reporting"
                            localeTextKey="gemeente_ziekenhuisopnames_per_dag"
                            differenceKey="hospital_nice__admissions_on_date_of_reporting_moving_average"
                          />
                        </MetricMenuItemLink>
                      </CategoryMenu>
                      <CategoryMenu
                        title={siteText.gemeente_layout.headings.besmettingen}
                      >
                        <MetricMenuItemLink
                          href={reverseRouter.gm.positiefGetesteMensen(code)}
                          icon={<GetestIcon />}
                          title={
                            siteText.gemeente_positief_geteste_personen
                              .titel_sidebar
                          }
                        >
                          <SidebarMetric
                            data={data}
                            scope="gm"
                            metricName="tested_overall"
                            metricProperty="infected"
                            localeTextKey="gemeente_positief_geteste_personen"
                            differenceKey="tested_overall__infected_moving_average"
                          />
                        </MetricMenuItemLink>

                        <MetricMenuItemLink
                          href={reverseRouter.gm.sterfte(code)}
                          icon={<VirusIcon />}
                          title={
                            siteText.veiligheidsregio_sterfte.titel_sidebar
                          }
                        >
                          <SidebarMetric
                            data={data}
                            scope="gm"
                            metricName="deceased_rivm"
                            metricProperty="covid_daily"
                            localeTextKey="gemeente_sterfte"
                            differenceKey="deceased_rivm__covid_daily"
                          />
                        </MetricMenuItemLink>
                      </CategoryMenu>
                    </>
                  )}
                  <CategoryMenu
                    title={siteText.gemeente_layout.headings.vroege_signalen}
                  >
                    <MetricMenuItemLink
                      href={data?.sewer && reverseRouter.gm.rioolwater(code)}
                      icon={<RioolwaterMonitoring />}
                      title={
                        siteText.gemeente_rioolwater_metingen.titel_sidebar
                      }
                    >
                      {data?.sewer ? (
                        <SidebarMetric
                          data={data}
                          scope="gm"
                          metricName="sewer"
                          metricProperty="average"
                          localeTextKey="gemeente_rioolwater_metingen"
                          differenceKey="sewer__average"
                          annotationKey="riool_normalized"
                        />
                      ) : (
                        siteText.gemeente_rioolwater_metingen.nodata_sidebar
                      )}
                    </MetricMenuItemLink>
                  </CategoryMenu>
                </Menu>
              </Box>
            )}
          </>
        }
      >
        <ErrorBoundary>{children}</ErrorBoundary>
      </AppContent>
    </>
  );
}
