import Head from 'next/head';
import { useRouter } from 'next/router';
import Arrow from '~/assets/arrow.svg';
import Arts from '~/assets/arts.svg';
import ElderlyIcon from '~/assets/elderly.svg';
import Gedrag from '~/assets/gedrag.svg';
import Gehandicaptenzorg from '~/assets/gehandicapte-zorg.svg';
import Maatregelen from '~/assets/maatregelen.svg';
import Notification from '~/assets/notification.svg';
import ReproIcon from '~/assets/reproductiegetal.svg';
import RioolwaterMonitoring from '~/assets/rioolwater-monitoring.svg';
import GetestIcon from '~/assets/test.svg';
import Verpleeghuiszorg from '~/assets/verpleeghuiszorg.svg';
import VirusIcon from '~/assets/virus.svg';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import Ziektegolf from '~/assets/ziektegolf.svg';
import { Category } from '~/components-styled/aside/category';
import {
  CategoryMenuItem,
  Menu,
  MetricMenuItem,
} from '~/components-styled/aside/menu';
import { TitleWithIcon } from '~/components-styled/aside/title-with-icon';
import { Spacer } from '~/components-styled/base';
import { SidebarMetric } from '~/components-styled/sidebar-metric';
import Layout from '~/components/layout';
import siteText from '~/locale/index';
import { NationalPageProps } from '~/static-props/nl-data';
import theme from '~/style/theme';
import { Link } from '~/utils/link';
import { useBreakpoints } from '~/utils/useBreakpoints';

export function getNationalLayout(
  page: React.ReactNode,
  pageProps: NationalPageProps
) {
  return (
    <Layout
      {...siteText.nationaal_metadata}
      lastGenerated={pageProps.lastGenerated}
    >
      <NationalLayout {...pageProps}>{page}</NationalLayout>
    </Layout>
  );
}

interface NationalLayoutProps extends NationalPageProps {
  children: React.ReactNode;
}

/**
 * NationalLayout is a composition of persistent layouts.
 *
 * ## States
 *
 * ### Mobile
 * - /landelijk -> only show aside
 * - /landelijk/[metric] -> only show content (children)
 *
 * ### Desktop
 * - /landelijk -> shows aside and content (children)
 * - /landelijk/[metric] -> shows aside and content (children)
 *
 * More info on persistent layouts:
 * https://adamwathan.me/2019/10/17/persistent-layout-patterns-in-nextjs/
 */
function NationalLayout(props: NationalLayoutProps) {
  const { children, data } = props;
  const router = useRouter();
  const breakpoints = useBreakpoints();

  function getClassName(path: string) {
    return router.pathname === path
      ? 'metric-link active-metric-link'
      : 'metric-link';
  }

  const menuOpenUrl = {
    pathname: router.pathname,
    query: { ...router.query, menu: '1' },
  };

  const isMenuOpen =
    (router.pathname === '/' && !('menu' in router.query)) ||
    router.query.menu === '1';

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
        className={`national-layout ${
          isMenuOpen ? 'has-menu-opened' : 'has-menu-closed'
        }`}
      >
        <Link href={menuOpenUrl}>
          <a className="back-button">
            <Arrow />
            {router.pathname === '/'
              ? siteText.nav.terug_naar_alle_cijfers_homepage
              : siteText.nav.terug_naar_alle_cijfers}
          </a>
        </Link>
        <aside className="national-aside">
          <nav
            /** re-mount when route changes in order to blur anchors */
            key={router.asPath}
            id="metric-navigation"
            aria-label={siteText.aria_labels.metriek_navigatie}
            role="navigation"
          >
            <Menu>
              <CategoryMenuItem>
                <Category>
                  {siteText.nationaal_layout.headings.algemeen}
                </Category>
                <Menu>
                  <MetricMenuItem>
                    <Link
                      href={{
                        pathname: '/',
                        query: breakpoints.md
                          ? {} // only add menu flags on narrow devices
                          : isMenuOpen
                          ? { menu: '0' }
                          : { menu: '1' },
                      }}
                    >
                      <a
                        className={`last-developments-link ${getClassName(
                          '/'
                        )}`}
                      >
                        <TitleWithIcon
                          icon={
                            <Notification color={theme.colors.notification} />
                          }
                          title={siteText.laatste_ontwikkelingen.title}
                          subtitle={
                            siteText.laatste_ontwikkelingen.menu_subtitle
                          }
                        />
                      </a>
                    </Link>
                  </MetricMenuItem>
                  <MetricMenuItem>
                    <Link href={`/landelijk/maatregelen`}>
                      <a className={getClassName(`/landelijk/maatregelen`)}>
                        <TitleWithIcon
                          icon={
                            <Maatregelen fill={theme.colors.restrictions} />
                          }
                          title={siteText.nationaal_maatregelen.titel_sidebar}
                        />
                        <Spacer mb={2} />
                      </a>
                    </Link>
                  </MetricMenuItem>
                </Menu>
              </CategoryMenuItem>
              <CategoryMenuItem>
                <Category>
                  {siteText.nationaal_layout.headings.besmettingen}
                </Category>
                <Menu>
                  <MetricMenuItem>
                    <Link href="/landelijk/positief-geteste-mensen">
                      <a
                        className={getClassName(
                          '/landelijk/positief-geteste-mensen'
                        )}
                      >
                        <TitleWithIcon
                          icon={<GetestIcon />}
                          title={
                            siteText.positief_geteste_personen.titel_sidebar
                          }
                        />
                        <SidebarMetric
                          data={data}
                          scope="nl"
                          metricName="infected_people_total"
                          metricProperty="infected_daily_total"
                          altBarScaleMetric={{
                            metricName: 'infected_people_delta_normalized',
                            metricProperty: 'infected_daily_increase',
                          }}
                          localeTextKey="positief_geteste_personen"
                          differenceKey="infected_people_total__infected_daily_total"
                          showBarScale={true}
                        />
                      </a>
                    </Link>
                  </MetricMenuItem>
                  <MetricMenuItem>
                    <Link href="/landelijk/besmettelijke-mensen">
                      <a
                        className={getClassName(
                          '/landelijk/besmettelijke-mensen'
                        )}
                      >
                        <TitleWithIcon
                          icon={<Ziektegolf />}
                          title={siteText.besmettelijke_personen.titel_sidebar}
                        />
                        <SidebarMetric
                          data={data}
                          scope="nl"
                          metricName="infectious_people_last_known_average"
                          metricProperty="infectious_avg"
                          localeTextKey="besmettelijke_personen"
                        />
                      </a>
                    </Link>
                  </MetricMenuItem>
                  <MetricMenuItem>
                    <Link href="/landelijk/reproductiegetal">
                      <a
                        className={getClassName('/landelijk/reproductiegetal')}
                      >
                        <TitleWithIcon
                          icon={<ReproIcon />}
                          title={siteText.reproductiegetal.titel_sidebar}
                        />
                        <SidebarMetric
                          data={data}
                          scope="nl"
                          metricName="reproduction_index_last_known_average"
                          metricProperty="reproduction_index_avg"
                          localeTextKey="reproductiegetal"
                          showBarScale={true}
                        />
                      </a>
                    </Link>
                  </MetricMenuItem>
                  <MetricMenuItem>
                    <Link href="/landelijk/sterfte">
                      <a className={getClassName('/landelijk/sterfte')}>
                        <TitleWithIcon
                          icon={<VirusIcon />}
                          title={siteText.sterfte.titel_sidebar}
                        />
                        <SidebarMetric
                          data={data}
                          scope="nl"
                          metricName="deceased_rivm"
                          metricProperty="covid_daily"
                          localeTextKey="sterfte"
                        />
                      </a>
                    </Link>
                  </MetricMenuItem>
                </Menu>
              </CategoryMenuItem>
              <CategoryMenuItem>
                <Category>
                  {siteText.nationaal_layout.headings.ziekenhuizen}
                </Category>
                <Menu>
                  <MetricMenuItem>
                    <Link href="/landelijk/ziekenhuis-opnames">
                      <a
                        className={getClassName(
                          '/landelijk/ziekenhuis-opnames'
                        )}
                      >
                        <TitleWithIcon
                          icon={<Ziekenhuis />}
                          title={
                            siteText.ziekenhuisopnames_per_dag.titel_sidebar
                          }
                        />
                        {/**
                         * A next step could be to embed the SidebarMetric component in an even
                         * higher-level component which would also include the link and the
                         * TitleWithIcon, seeing that both appear to use the same localeTextKey,
                         * and it would make sense to enforce the existence of standardized
                         * properties like title_sidebar.
                         */}
                        <SidebarMetric
                          data={data}
                          scope="nl"
                          metricName="intake_hospital_ma"
                          metricProperty="moving_average_hospital"
                          localeTextKey="ziekenhuisopnames_per_dag"
                          differenceKey="intake_hospital_ma__moving_average_hospital"
                          showBarScale={true}
                        />
                      </a>
                    </Link>
                  </MetricMenuItem>

                  <MetricMenuItem>
                    <Link href="/landelijk/intensive-care-opnames">
                      <a
                        className={getClassName(
                          '/landelijk/intensive-care-opnames'
                        )}
                      >
                        <TitleWithIcon
                          icon={<Arts />}
                          title={siteText.ic_opnames_per_dag.titel_sidebar}
                        />
                        <SidebarMetric
                          data={data}
                          scope="nl"
                          metricName="intake_intensivecare_ma"
                          metricProperty="moving_average_ic"
                          localeTextKey="ic_opnames_per_dag"
                          differenceKey="intake_intensivecare_ma__moving_average_ic"
                          showBarScale={true}
                        />
                      </a>
                    </Link>
                  </MetricMenuItem>
                </Menu>
              </CategoryMenuItem>
              <CategoryMenuItem>
                <Category>
                  {siteText.nationaal_layout.headings.kwetsbare_groepen}
                </Category>
                <Menu>
                  <MetricMenuItem>
                    <Link href="/landelijk/verpleeghuiszorg">
                      <a
                        className={getClassName('/landelijk/verpleeghuiszorg')}
                      >
                        <TitleWithIcon
                          icon={<Verpleeghuiszorg />}
                          title={
                            siteText.verpleeghuis_besmette_locaties
                              .titel_sidebar
                          }
                        />
                        <SidebarMetric
                          data={data}
                          scope="nl"
                          metricName="nursing_home"
                          metricProperty="newly_infected_people"
                          localeTextKey="verpleeghuis_positief_geteste_personen"
                          differenceKey="nursing_home__newly_infected_people"
                        />
                      </a>
                    </Link>
                  </MetricMenuItem>
                  <MetricMenuItem>
                    <Link href="/landelijk/gehandicaptenzorg">
                      <a
                        className={getClassName('/landelijk/gehandicaptenzorg')}
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
                          scope="nl"
                          metricName="disability_care"
                          metricProperty="newly_infected_people"
                          localeTextKey="gehandicaptenzorg_positief_geteste_personen"
                        />
                      </a>
                    </Link>
                  </MetricMenuItem>
                  <MetricMenuItem>
                    <Link href="/landelijk/thuiswonende-ouderen">
                      <a
                        className={getClassName(
                          '/landelijk/thuiswonende-ouderen'
                        )}
                      >
                        <TitleWithIcon
                          icon={<ElderlyIcon />}
                          title={siteText.thuiswonende_ouderen.titel_sidebar}
                        />
                        <SidebarMetric
                          data={data}
                          scope="nl"
                          metricName="elderly_at_home"
                          metricProperty="positive_tested_daily"
                          localeTextKey="thuiswonende_ouderen"
                        />
                      </a>
                    </Link>
                  </MetricMenuItem>
                </Menu>
              </CategoryMenuItem>
              <CategoryMenuItem>
                <Category>
                  {siteText.nationaal_layout.headings.vroege_signalen}
                </Category>
                <Menu>
                  <MetricMenuItem>
                    <Link href="/landelijk/rioolwater">
                      <a className={getClassName('/landelijk/rioolwater')}>
                        <TitleWithIcon
                          icon={<RioolwaterMonitoring />}
                          title={siteText.rioolwater_metingen.titel_sidebar}
                        />

                        <SidebarMetric
                          data={data}
                          scope="nl"
                          metricName="sewer"
                          metricProperty="average"
                          localeTextKey="rioolwater_metingen"
                          differenceKey="sewer__average"
                          annotationKey="riool_normalized"
                        />
                      </a>
                    </Link>
                  </MetricMenuItem>

                  <MetricMenuItem>
                    <Link href="/landelijk/verdenkingen-huisartsen">
                      <a
                        className={getClassName(
                          '/landelijk/verdenkingen-huisartsen'
                        )}
                      >
                        <TitleWithIcon
                          icon={<Arts />}
                          title={siteText.verdenkingen_huisartsen.titel_sidebar}
                        />
                        <SidebarMetric
                          data={data}
                          scope="nl"
                          metricName="verdenkingen_huisartsen"
                          metricProperty="geschat_aantal"
                          localeTextKey="verdenkingen_huisartsen"
                          differenceKey="huisarts_verdenkingen__geschat_aantal"
                        />
                      </a>
                    </Link>
                  </MetricMenuItem>
                </Menu>
              </CategoryMenuItem>

              <CategoryMenuItem>
                <Category>{siteText.nationaal_layout.headings.gedrag}</Category>
                <Menu>
                  <MetricMenuItem>
                    <Link href="/landelijk/gedrag">
                      <a className={getClassName('/landelijk/gedrag')}>
                        <TitleWithIcon
                          icon={<Gedrag />}
                          title={siteText.nl_gedrag.sidebar.titel}
                        />
                        <SidebarMetric
                          data={data}
                          scope="nl"
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
        </aside>

        <main
          id="content"
          className="national-content"
          aria-label="nationale pagina inhoud"
        >
          {children}
        </main>

        <Link href={menuOpenUrl}>
          <a className="back-button back-button-footer">
            <Arrow />
            {router.pathname === '/'
              ? siteText.nav.terug_naar_alle_cijfers_homepage
              : siteText.nav.terug_naar_alle_cijfers}
          </a>
        </Link>
      </div>
    </>
  );
}
