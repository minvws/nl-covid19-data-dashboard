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
import { SidebarMetric } from '~/components-styled/sidebar-metric';
import { Text } from '~/components-styled/typography';
import { getLayout as getSiteLayout } from '~/components/layout';
import { SiteContent } from '~/domain/site/site-content';
import siteText from '~/locale/index';
import { IMunicipalityData } from '~/static-props/municipality-data';
import { getSafetyRegionForMunicipalityCode } from '~/utils/getSafetyRegionForMunicipalityCode';
import { Link } from '~/utils/link';
import { MunicipalityComboBox } from './municipality-combo-box';

/**
 * When you navigate to /gemeente root from the top menu, there is no GM code
 * and the data will be undefined. That's why we use Partial here, so that TS
 * knows that data and other props from data are not guaranteed to be present.
 */
interface MunicipalityLayoutProps extends Partial<IMunicipalityData> {
  children: React.ReactNode;
}

export function getMunicipalityLayout() {
  return function (
    page: React.ReactNode,
    pageProps: IMunicipalityData & {
      lastGenerated: string;
    }
  ): React.ReactNode {
    const lastGenerated = pageProps.lastGenerated;
    return getSiteLayout(
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

  const safetyRegion:
    | { name: string; code: string; id: number }
    | undefined = getSafetyRegionForMunicipalityCode(code as string);

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
      <SiteContent
        hideMenuButton={isMainRoute}
        renderSearch={<MunicipalityComboBox />}
        renderSidebar={
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
                            metricName="positive_tested_people"
                            metricProperty="infected_daily_total"
                            localeTextKey="gemeente_positief_geteste_personen"
                            differenceKey="positive_tested_people__infected_daily_total"
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
                          {
                            siteText.gemeente_ziekenhuisopnames_per_dag
                              .tijdelijk_onbeschikbaar_titel
                          }
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
      </SiteContent>
    </>
  );
}
