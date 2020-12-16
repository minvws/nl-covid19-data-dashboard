import Head from 'next/head';
import { useRouter } from 'next/router';
import Arrow from '~/assets/arrow.svg';
import ElderlyIcon from '~/assets/elderly.svg';
import Gedrag from '~/assets/gedrag.svg';
import Gehandicaptenzorg from '~/assets/gehandicapte-zorg.svg';
import Maatregelen from '~/assets/maatregelen.svg';
import RioolwaterMonitoring from '~/assets/rioolwater-monitoring.svg';
import GetestIcon from '~/assets/test.svg';
import Verpleeghuiszorg from '~/assets/verpleeghuiszorg.svg';
import VirusIcon from '~/assets/virus.svg';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import { Category } from '~/components-styled/aside/category';
import {
  CategoryMenuItem,
  Menu,
  MetricMenuItem,
} from '~/components-styled/aside/menu';
import { TitleWithIcon } from '~/components-styled/aside/title-with-icon';
import { SidebarMetric } from '~/components-styled/sidebar-metric';
import { ComboBox } from '~/components/comboBox';
import { getLayout as getSiteLayout } from '~/components/layout';
import safetyRegions from '~/data/index';
import siteText from '~/locale/index';
import { ISafetyRegionData } from '~/static-props/safetyregion-data';
import theme from '~/style/theme';
import { Link } from '~/utils/link';
import { useMediaQuery } from '~/utils/useMediaQuery';

export function getSafetyRegionLayout() {
  return function (
    page: React.ReactNode,
    pageProps: ISafetyRegionData
  ): React.ReactNode {
    return getSiteLayout(
      siteText.veiligheidsregio_metadata,
      pageProps.lastGenerated
    )(<SafetyRegionLayout {...pageProps}>{page}</SafetyRegionLayout>);
  };
}

type TSafetyRegion = {
  name: string;
  displayName?: string;
  code: string;
  id: number;
  searchTerms?: string[];
};

/**
 * SafetyRegionLayout is a composition of persistent layouts.
 *
 * ## States
 *
 * ### Mobile
 * - /veiligheidsregio -> only show aside
 * - /veiligheidsregio/[metric] -> only show content (children)
 *
 * ### Desktop
 * - /veiligheidsregio -> shows aside and content (children)
 * - /veiligheidsregio/[metric] -> shows aside and content (children)
 *
 * More info on persistent layouts:
 * https:adamwathan.me/2019/10/17/persistent-layout-patterns-in-nextjs/
 */
function SafetyRegionLayout(
  props: ISafetyRegionData & { children: React.ReactNode }
) {
  const { children, data, safetyRegionName } = props;

  const router = useRouter();
  const isLargeScreen = useMediaQuery('(min-width: 1000px)', true);

  const { code } = router.query;

  const isMainRoute =
    router.route === '/veiligheidsregio' ||
    router.route === `/veiligheidsregio/[code]`;

  const showMetricLinks = router.route !== '/veiligheidsregio';

  const isMenuOpen = router.query.menu === '1';
  const menuUrl = {
    pathname: router.pathname,
    query: { ...router.query, menu: '1' },
  };

  function getClassName(path: string) {
    return router.pathname === path
      ? 'metric-link active-metric-link'
      : 'metric-link';
  }

  function handleSafeRegionSelect(region: TSafetyRegion) {
    if (isLargeScreen) {
      router.push(`/veiligheidsregio/${region.code}/positief-geteste-mensen`);
    } else {
      router.push(`/veiligheidsregio/${region.code}`);
    }
  }

  return (
    <>
      <Head>
        <link
          key="dc-spatial"
          rel="dcterms:spatial"
          href="https:standaarden.overheid.nl/owms/terms/Nederland"
        />
        <link
          key="dc-spatial-title"
          rel="dcterms:spatial"
          href="https:standaarden.overheid.nl/owms/terms/Nederland"
          title="Nederland"
        />
      </Head>

      <div
        className={`safety-region-layout ${
          isMainRoute
            ? 'has-menu-and-content-opened'
            : isMenuOpen
            ? 'has-menu-opened'
            : 'has-menu-closed'
        }`}
      >
        <Link href={menuUrl}>
          <a className="back-button">
            <Arrow />
            {siteText.nav.terug_naar_alle_cijfers}
          </a>
        </Link>
        <aside className="safety-region-aside">
          <ComboBox<TSafetyRegion>
            placeholder={siteText.common.zoekveld_placeholder_regio}
            onSelect={handleSafeRegionSelect}
            options={safetyRegions}
          />

          {showMetricLinks && (
            <nav
              /** re-mount when route changes in order to blur anchors */
              key={router.asPath}
              id="metric-navigation"
              aria-label={siteText.aria_labels.metriek_navigatie}
              role="navigation"
            >
              <Category>{safetyRegionName}</Category>
              <Menu>
                <CategoryMenuItem
                  borderTop="1px solid"
                  borderTopColor="border"
                  borderBottom="1px solid"
                  borderBottomColor="border"
                >
                  <Menu>
                    <Link href={`/veiligheidsregio/${code}/maatregelen`}>
                      <a
                        className={getClassName(
                          `/veiligheidsregio/[code]/maatregelen`
                        )}
                      >
                        <TitleWithIcon
                          icon={
                            <Maatregelen fill={theme.colors.restrictions} />
                          }
                          title={
                            siteText.veiligheidsregio_maatregelen.titel_sidebar
                          }
                        />
                      </a>
                    </Link>
                  </Menu>
                </CategoryMenuItem>
                <CategoryMenuItem>
                  <Category>
                    {siteText.veiligheidsregio_layout.headings.besmettingen}
                  </Category>
                  <Menu>
                    <MetricMenuItem>
                      <Link
                        href={`/veiligheidsregio/${code}/positief-geteste-mensen`}
                      >
                        <a
                          className={getClassName(
                            `/veiligheidsregio/[code]/positief-geteste-mensen`
                          )}
                        >
                          <TitleWithIcon
                            icon={<GetestIcon />}
                            title={
                              siteText
                                .veiligheidsregio_positief_geteste_personen
                                .titel_sidebar
                            }
                          />

                          <SidebarMetric
                            data={data}
                            scope="vr"
                            metricName="results_per_region"
                            metricProperty="total_reported_increase_per_region"
                            altBarScaleMetric={{
                              metricName: 'results_per_region',
                              metricProperty: 'infected_increase_per_region',
                            }}
                            localeTextKey="veiligheidsregio_positief_geteste_personen"
                            differenceKey="results_per_region__total_reported_increase_per_region"
                            showBarScale={true}
                          />
                        </a>
                      </Link>
                    </MetricMenuItem>
                    <MetricMenuItem>
                      <Link href={`/veiligheidsregio/${code}/sterfte`}>
                        <a
                          className={getClassName(
                            '/veiligheidsregio/[code]/sterfte'
                          )}
                        >
                          <TitleWithIcon
                            icon={<VirusIcon />}
                            title={
                              siteText.veiligheidsregio_sterfte.titel_sidebar
                            }
                          />
                          <SidebarMetric
                            data={data}
                            scope="vr"
                            metricName="deceased_rivm"
                            metricProperty="covid_daily"
                            localeTextKey="veiligheidsregio_sterfte"
                          />
                        </a>
                      </Link>
                    </MetricMenuItem>
                  </Menu>
                </CategoryMenuItem>
                <CategoryMenuItem>
                  <Category>
                    {siteText.veiligheidsregio_layout.headings.ziekenhuizen}
                  </Category>
                  <Menu>
                    <MetricMenuItem>
                      <Link
                        href={`/veiligheidsregio/${code}/ziekenhuis-opnames`}
                      >
                        <a
                          className={getClassName(
                            `/veiligheidsregio/[code]/ziekenhuis-opnames`
                          )}
                        >
                          <TitleWithIcon
                            icon={<Ziekenhuis />}
                            title={
                              siteText
                                .veiligheidsregio_ziekenhuisopnames_per_dag
                                .titel_sidebar
                            }
                          />
                          <SidebarMetric
                            data={data}
                            scope="vr"
                            metricName="results_per_region"
                            metricProperty="hospital_moving_avg_per_region"
                            localeTextKey="veiligheidsregio_ziekenhuisopnames_per_dag"
                            differenceKey="results_per_region__hospital_moving_avg_per_region"
                          />
                        </a>
                      </Link>
                    </MetricMenuItem>
                  </Menu>
                </CategoryMenuItem>
                <CategoryMenuItem>
                  <Category>
                    {
                      siteText.veiligheidsregio_layout.headings
                        .kwetsbare_groepen
                    }
                  </Category>
                  <Menu>
                    <MetricMenuItem>
                      <Link href={`/veiligheidsregio/${code}/verpleeghuiszorg`}>
                        <a
                          className={getClassName(
                            '/veiligheidsregio/[code]/verpleeghuiszorg'
                          )}
                        >
                          <TitleWithIcon
                            icon={<Verpleeghuiszorg />}
                            title={
                              siteText
                                .veiligheidsregio_verpleeghuis_besmette_locaties
                                .titel_sidebar
                            }
                          />
                          <SidebarMetric
                            data={data}
                            scope="vr"
                            metricName="nursing_home"
                            metricProperty="newly_infected_people"
                            localeTextKey="verpleeghuis_positief_geteste_personen"
                            differenceKey="nursing_home__newly_infected_people"
                          />
                        </a>
                      </Link>
                    </MetricMenuItem>

                    <MetricMenuItem>
                      <Link
                        href={`/veiligheidsregio/${code}/gehandicaptenzorg`}
                      >
                        <a
                          className={getClassName(
                            '/veiligheidsregio/[code]/gehandicaptenzorg'
                          )}
                        >
                          <TitleWithIcon
                            icon={<Gehandicaptenzorg />}
                            title={
                              siteText.gehandicaptenzorg_besmette_locaties
                                .titel_sidebar
                            }
                          />
                          <SidebarMetric
                            data={data}
                            scope="vr"
                            metricName="disability_care"
                            metricProperty="newly_infected_people"
                            localeTextKey="veiligheidsregio_gehandicaptenzorg_positief_geteste_personen"
                          />
                        </a>
                      </Link>
                    </MetricMenuItem>

                    <MetricMenuItem>
                      <Link
                        href={`/veiligheidsregio/${code}/thuiswonende-ouderen`}
                      >
                        <a
                          className={getClassName(
                            '/veiligheidsregio/[code]/thuiswonende-ouderen'
                          )}
                        >
                          <TitleWithIcon
                            icon={<ElderlyIcon />}
                            title={
                              siteText.veiligheidsregio_thuiswonende_ouderen
                                .titel_sidebar
                            }
                          />
                          <SidebarMetric
                            data={data}
                            scope="vr"
                            metricName="elderly_at_home"
                            metricProperty="positive_tested_daily"
                            localeTextKey="veiligheidsregio_thuiswonende_ouderen"
                          />
                        </a>
                      </Link>
                    </MetricMenuItem>
                  </Menu>
                </CategoryMenuItem>
                <CategoryMenuItem>
                  <Category>
                    {siteText.veiligheidsregio_layout.headings.vroege_signalen}
                  </Category>
                  <Menu>
                    <MetricMenuItem>
                      <Link href={`/veiligheidsregio/${code}/rioolwater`}>
                        <a
                          className={getClassName(
                            `/veiligheidsregio/[code]/rioolwater`
                          )}
                        >
                          <TitleWithIcon
                            icon={<RioolwaterMonitoring />}
                            title={
                              siteText.veiligheidsregio_rioolwater_metingen
                                .titel_sidebar
                            }
                          />
                          <SidebarMetric
                            data={data}
                            scope="vr"
                            metricName="sewer"
                            metricProperty="average"
                            localeTextKey="veiligheidsregio_rioolwater_metingen"
                            differenceKey="sewer__average"
                            annotationKey="riool_normalized"
                          />
                        </a>
                      </Link>
                    </MetricMenuItem>
                  </Menu>
                </CategoryMenuItem>

                <CategoryMenuItem>
                  <Category>
                    {siteText.veiligheidsregio_layout.headings.gedrag}
                  </Category>
                  <Menu>
                    <MetricMenuItem>
                      <Link href={`/veiligheidsregio/${code}/gedrag`}>
                        <a
                          className={getClassName(
                            '/veiligheidsregio/[code]/gedrag'
                          )}
                        >
                          <TitleWithIcon
                            icon={<Gedrag />}
                            title={siteText.regionaal_gedrag.sidebar.titel}
                          />
                          <SidebarMetric
                            data={data}
                            scope="vr"
                            metricName="behavior"
                            localeTextKey="gedrag_common"
                          />
                        </a>
                      </Link>
                    </MetricMenuItem>
                  </Menu>
                </CategoryMenuItem>
              </Menu>
            </nav>
          )}
        </aside>

        <main id="content" className="safety-region-content">
          {children}
        </main>

        <Link href={menuUrl}>
          <a className="back-button back-button-footer">
            <Arrow />
            {siteText.nav.terug_naar_alle_cijfers}
          </a>
        </Link>
      </div>
    </>
  );
}
