import Head from 'next/head';
import { useRouter } from 'next/router';
import Arrow from '~/assets/arrow.svg';
import RioolwaterMonitoring from '~/assets/rioolwater-monitoring.svg';
import GetestIcon from '~/assets/test.svg';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import { Category } from '~/components-styled/aside/category';
import {
  CategoryMenuItem,
  Menu,
  MetricMenuItem,
} from '~/components-styled/aside/menu';
import { TitleWithIcon } from '~/components-styled/aside/title-with-icon';
import { Box } from '~/components-styled/base';
import { SidebarMetric } from '~/components-styled/sidebar-metric';
import { Text } from '~/components-styled/typography';
import { ComboBox } from '~/components/comboBox';
import { getLayout as getSiteLayout } from '~/components/layout';
import municipalities from '~/data/gemeente_veiligheidsregio.json';
import siteText from '~/locale/index';
import { IMunicipalityData } from '~/static-props/municipality-data';
import { getSafetyRegionForMunicipalityCode } from '~/utils/getSafetyRegionForMunicipalityCode';
import { Link } from '~/utils/link';
import { useMediaQuery } from '~/utils/useMediaQuery';

interface IMunicipality {
  name: string;
  safetyRegion: string;
  gemcode: string;
}

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
  const isLargeScreen = useMediaQuery('(min-width: 1000px)');

  const { code } = router.query;

  const showMetricLinks = router.route !== '/gemeente';

  const isMainRoute =
    router.route === '/gemeente' || router.route === `/gemeente/[code]`;

  const isMenuOpen = router.query.menu === '1';
  const menuOpenUrl = {
    pathname: router.pathname,
    query: { ...router.query, menu: '1' },
  };

  function getClassName(path: string) {
    return router.pathname === path
      ? 'metric-link active-metric-link'
      : 'metric-link';
  }

  function handleMunicipalitySelect(region: IMunicipality) {
    if (isLargeScreen) {
      router.push(`/gemeente/${region.gemcode}/positief-geteste-mensen`);
    } else {
      router.push(`/gemeente/${region.gemcode}`);
    }
  }

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
      <div
        className={`municipality-layout ${
          isMainRoute
            ? 'has-menu-and-content-opened'
            : isMenuOpen
            ? 'has-menu-opened'
            : 'has-menu-closed'
        }`}
      >
        <Link href={menuOpenUrl}>
          <a className="back-button">
            <Arrow />
            {siteText.nav.terug_naar_alle_cijfers}
          </a>
        </Link>
        <aside className="municipality-aside">
          <ComboBox<IMunicipality>
            placeholder={siteText.common.zoekveld_placeholder_gemeente}
            onSelect={handleMunicipalitySelect}
            options={municipalities}
          />

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
                    <CategoryMenuItem>
                      <Category>
                        {siteText.gemeente_layout.headings.besmettingen}
                      </Category>
                      <Menu>
                        <MetricMenuItem>
                          <Link
                            href={`/gemeente/${code}/positief-geteste-mensen`}
                          >
                            <a
                              className={getClassName(
                                `/gemeente/[code]/positief-geteste-mensen`
                              )}
                            >
                              <TitleWithIcon
                                icon={<GetestIcon />}
                                title={
                                  siteText.gemeente_positief_geteste_personen
                                    .titel_sidebar
                                }
                              />
                              <SidebarMetric
                                data={data}
                                scope="gm"
                                metricName="positive_tested_people"
                                metricProperty="infected_daily_total"
                                localeTextKey="gemeente_positief_geteste_personen"
                                differenceKey="positive_tested_people__infected_daily_total"
                              />
                            </a>
                          </Link>
                        </MetricMenuItem>
                      </Menu>
                    </CategoryMenuItem>
                    <CategoryMenuItem>
                      <Category>
                        {siteText.gemeente_layout.headings.ziekenhuizen}
                      </Category>
                      <Menu>
                        <MetricMenuItem>
                          <Link href={`/gemeente/${code}/ziekenhuis-opnames`}>
                            <a
                              className={getClassName(
                                `/gemeente/[code]/ziekenhuis-opnames`
                              )}
                            >
                              <TitleWithIcon
                                icon={<Ziekenhuis />}
                                title={
                                  siteText.gemeente_ziekenhuisopnames_per_dag
                                    .titel_sidebar
                                }
                              />
                              <SidebarMetric
                                data={data}
                                scope="gm"
                                metricName="hospital_admissions"
                                metricProperty="moving_average_hospital"
                                localeTextKey="gemeente_ziekenhuisopnames_per_dag"
                                differenceKey="hospital_admissions__moving_average_hospital"
                              />
                            </a>
                          </Link>
                        </MetricMenuItem>
                      </Menu>
                    </CategoryMenuItem>
                  </>
                )}
                <CategoryMenuItem>
                  <Category>
                    {siteText.gemeente_layout.headings.vroege_signalen}
                  </Category>
                  <Menu>
                    <MetricMenuItem>
                      {data?.sewer ? (
                        <Link href={`/gemeente/${code}/rioolwater`}>
                          <a
                            className={getClassName(
                              `/gemeente/[code]/rioolwater`
                            )}
                          >
                            <TitleWithIcon
                              icon={<RioolwaterMonitoring />}
                              title={
                                siteText.gemeente_rioolwater_metingen
                                  .titel_sidebar
                              }
                            />
                            <SidebarMetric
                              data={data}
                              scope="gm"
                              metricName="sewer"
                              metricProperty="average"
                              localeTextKey="gemeente_rioolwater_metingen"
                              differenceKey="sewer__average"
                              annotationKey="riool_normalized"
                            />
                          </a>
                        </Link>
                      ) : (
                        <div className="metric-not-available">
                          <TitleWithIcon
                            icon={<RioolwaterMonitoring />}
                            title={
                              siteText.gemeente_rioolwater_metingen
                                .titel_sidebar
                            }
                          />
                          <p>
                            {
                              siteText.gemeente_rioolwater_metingen
                                .nodata_sidebar
                            }
                          </p>
                        </div>
                      )}
                    </MetricMenuItem>
                  </Menu>
                </CategoryMenuItem>
              </Menu>
            </nav>
          )}
        </aside>

        <main id="content" className="municipality-content">
          {children}
        </main>

        <Link href={menuOpenUrl}>
          <a className="back-button back-button-footer">
            <Arrow />
            {siteText.nav.terug_naar_alle_cijfers}
          </a>
        </Link>
      </div>
    </>
  );
}
