import Head from 'next/head';
import { useRouter } from 'next/router';
import RioolwaterMonitoring from '~/assets/rioolwater-monitoring.svg';
import GetestIcon from '~/assets/test.svg';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import { Category } from '~/components-styled/aside/category';
import {
  CategoryMenu,
  Menu,
  MetricMenuItemLink,
} from '~/components-styled/aside/menu';
import { Box } from '~/components-styled/base';
import { AppContent } from '~/components-styled/layout/app-content';
import { SidebarMetric } from '~/components-styled/sidebar-metric';
import { Text } from '~/components-styled/typography';
import { getLayout } from '~/domain/layout/layout';
import siteText from '~/locale/index';
import { Municipal } from '~/types/data';
import { getSafetyRegionForMunicipalityCode } from '~/utils/getSafetyRegionForMunicipalityCode';
import { Link } from '~/utils/link';
import { MunicipalityComboBox } from './components/municipality-combo-box';

interface MunicipalityLayoutProps {
  lastGenerated: string;
  data?: Municipal;
  municipalityName?: string;
  children?: React.ReactNode;
}

export function getMunicipalityLayout() {
  return function (
    page: React.ReactNode,
    pageProps: MunicipalityLayoutProps
  ): React.ReactNode {
    const lastGenerated = pageProps.lastGenerated;
    return getLayout(
      siteText.gemeente_metadata,
      lastGenerated
    )(<MunicipalityLayout {...pageProps}>{page}</MunicipalityLayout>);
  };
}

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
function MunicipalityLayout(props: MunicipalityLayoutProps) {
  const { children, data, municipalityName } = props;
  const router = useRouter();
  const { code } = router.query;

  const showMetricLinks = router.route !== '/gemeente';

  const isMainRoute =
    router.route === '/gemeente' || router.route === `/gemeente/[code]`;

  const safetyRegion = getSafetyRegionForMunicipalityCode(code as string);

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
        searchComponent={<MunicipalityComboBox />}
        sidebarComponent={
          <>
            {showMetricLinks && (
              <nav
                /** re-mount when route changes in order to blur anchors */
                key={router.asPath}
                role="navigation"
                id="metric-navigation"
                aria-label={siteText.aria_labels.metriek_navigatie}
              >
                <Box>
                  <Category marginBottom={0}>{municipalityName}</Category>
                  {safetyRegion && (
                    <Text pl={3}>
                      {siteText.common.veiligheidsregio_label}{' '}
                      <Link
                        href={`/veiligheidsregio/${safetyRegion.code}/positief-geteste-mensen`}
                      >
                        <a>{safetyRegion.name}</a>
                      </Link>
                    </Text>
                  )}
                </Box>
                <Menu>
                  {data && (
                    <>
                      <CategoryMenu
                        title={siteText.gemeente_layout.headings.besmettingen}
                      >
                        <MetricMenuItemLink
                          href={`/gemeente/${code}/positief-geteste-mensen`}
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
                            differenceKey="tested_overall__infected"
                          />
                        </MetricMenuItemLink>
                      </CategoryMenu>
                      <CategoryMenu
                        title={siteText.gemeente_layout.headings.ziekenhuizen}
                      >
                        <MetricMenuItemLink
                          href={`/gemeente/${code}/ziekenhuis-opnames`}
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
                            differenceKey="hospital_nice__admissions_on_date_of_reporting"
                          />
                        </MetricMenuItemLink>
                      </CategoryMenu>
                    </>
                  )}
                  <CategoryMenu
                    title={siteText.gemeente_layout.headings.vroege_signalen}
                  >
                    <MetricMenuItemLink
                      href={data?.sewer && `/gemeente/${code}/rioolwater`}
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
              </nav>
            )}
          </>
        }
      >
        {children}
      </AppContent>
    </>
  );
}
