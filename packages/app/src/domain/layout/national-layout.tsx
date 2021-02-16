import { National } from '@corona-dashboard/common';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Arts from '~/assets/arts.svg';
import ElderlyIcon from '~/assets/elderly.svg';
import Gedrag from '~/assets/gedrag.svg';
import Gehandicaptenzorg from '~/assets/gehandicapte-zorg.svg';
import ReproIcon from '~/assets/reproductiegetal.svg';
import RioolwaterMonitoring from '~/assets/rioolwater-monitoring.svg';
import GetestIcon from '~/assets/test.svg';
import Verpleeghuiszorg from '~/assets/verpleeghuiszorg.svg';
import VirusIcon from '~/assets/virus.svg';
import VaccinatieIcon from '~/assets/vaccinaties.svg';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import Ziektegolf from '~/assets/ziektegolf.svg';
import {
  CategoryMenu,
  Menu,
  MetricMenuItemLink,
} from '~/components-styled/aside/menu';
import { AppContent } from '~/components-styled/layout/app-content';
import { SidebarMetric } from '~/components-styled/sidebar-metric';
import { Layout } from '~/domain/layout/layout';
import siteText from '~/locale/index';
import { useBreakpoints } from '~/utils/useBreakpoints';
import { Box } from '~/components-styled/base';
interface NationalLayoutProps {
  lastGenerated: string;
  data: National;
  children?: React.ReactNode;
}

export function getNationalLayout(
  page: React.ReactNode,
  pageProps: NationalLayoutProps
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

  const isMenuOpen =
    (router.pathname === '/landelijk' && !('menu' in router.query)) ||
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

      <AppContent
        sidebarComponent={
          <nav
            /** re-mount when route changes in order to blur anchors */
            key={router.asPath}
            id="metric-navigation"
            aria-label={siteText.aria_labels.metriek_navigatie}
            role="navigation"
          >
            <Menu>
              <Box spacing={3} pt={4}>
                <MetricMenuItemLink
                  href={{
                    pathname: '/landelijk/maatregelen',
                    query: breakpoints.md
                      ? {} // only add menu flags on narrow devices
                      : isMenuOpen
                      ? { menu: '0' }
                      : { menu: '1' },
                  }}
                  title={siteText.nationaal_maatregelen.titel_sidebar}
                  subtitle={siteText.nationaal_maatregelen.subtitel_sidebar}
                />
              </Box>
              <CategoryMenu
                title={siteText.nationaal_layout.headings.vaccinaties}
              >
                <MetricMenuItemLink
                  href="/landelijk/vaccinaties"
                  icon={<VaccinatieIcon />}
                  title={siteText.vaccinaties.titel_sidebar}
                >
                  <SidebarMetric
                    data={siteText.vaccinaties.data}
                    scope="nl"
                    metricName="sidebar"
                    metricProperty="total_vaccinated"
                    localeTextKey="vaccinaties"
                  />
                </MetricMenuItemLink>
              </CategoryMenu>
              <CategoryMenu
                title={siteText.nationaal_layout.headings.besmettingen}
              >
                <MetricMenuItemLink
                  href="/landelijk/positief-geteste-mensen"
                  icon={<GetestIcon />}
                  title={siteText.positief_geteste_personen.titel_sidebar}
                >
                  <SidebarMetric
                    data={data}
                    scope="nl"
                    metricName="tested_overall"
                    metricProperty="infected"
                    altBarScaleMetric={{
                      metricName: 'tested_overall',
                      metricProperty: 'infected_per_100k',
                    }}
                    localeTextKey="positief_geteste_personen"
                    differenceKey="tested_overall__infected"
                    showBarScale={true}
                  />
                </MetricMenuItemLink>

                <MetricMenuItemLink
                  href="/landelijk/besmettelijke-mensen"
                  icon={<Ziektegolf />}
                  title={siteText.besmettelijke_personen.titel_sidebar}
                >
                  <SidebarMetric
                    data={data}
                    scope="nl"
                    metricName="infectious_people"
                    metricProperty="estimate"
                    localeTextKey="besmettelijke_personen"
                    differenceKey="infectious_people__estimate"
                  />
                </MetricMenuItemLink>

                <MetricMenuItemLink
                  href="/landelijk/reproductiegetal"
                  icon={<ReproIcon />}
                  title={siteText.reproductiegetal.titel_sidebar}
                >
                  <SidebarMetric
                    data={data}
                    scope="nl"
                    metricName="reproduction"
                    metricProperty="index_average"
                    localeTextKey="reproductiegetal"
                    showBarScale={true}
                    differenceKey="reproduction__index_average"
                  />
                </MetricMenuItemLink>

                <MetricMenuItemLink
                  href="/landelijk/sterfte"
                  icon={<VirusIcon />}
                  title={siteText.sterfte.titel_sidebar}
                >
                  <SidebarMetric
                    data={data}
                    scope="nl"
                    metricName="deceased_rivm"
                    metricProperty="covid_daily"
                    localeTextKey="sterfte"
                    differenceKey="deceased_rivm__covid_daily"
                  />
                </MetricMenuItemLink>
              </CategoryMenu>
              <CategoryMenu
                title={siteText.nationaal_layout.headings.ziekenhuizen}
              >
                <MetricMenuItemLink
                  href="/landelijk/ziekenhuis-opnames"
                  icon={<Ziekenhuis />}
                  title={siteText.ziekenhuisopnames_per_dag.titel_sidebar}
                >
                  {/**
                   * A next step could be to embed the SidebarMetric component in an even
                   * higher-level component which would also include the link and the
                   * Title, seeing that both appear to use the same localeTextKey,
                   * and it would make sense to enforce the existence of standardized
                   * properties like title_sidebar.
                   */}
                  <SidebarMetric
                    data={data}
                    scope="nl"
                    metricName="hospital_nice"
                    metricProperty="admissions_on_date_of_reporting"
                    localeTextKey="ziekenhuisopnames_per_dag"
                    differenceKey="hospital_nice__admissions_on_date_of_reporting"
                    showBarScale={true}
                  />
                </MetricMenuItemLink>

                <MetricMenuItemLink
                  href="/landelijk/intensive-care-opnames"
                  icon={<Arts />}
                  title={siteText.ic_opnames_per_dag.titel_sidebar}
                >
                  <SidebarMetric
                    data={data}
                    scope="nl"
                    metricName="intensive_care_nice"
                    metricProperty="admissions_moving_average"
                    localeTextKey="ic_opnames_per_dag"
                    differenceKey="intensive_care_nice__admissions_moving_average"
                    showBarScale={true}
                  />
                </MetricMenuItemLink>
              </CategoryMenu>
              <CategoryMenu
                title={siteText.nationaal_layout.headings.kwetsbare_groepen}
              >
                <MetricMenuItemLink
                  href="/landelijk/verpleeghuiszorg"
                  icon={<Verpleeghuiszorg />}
                  title={siteText.verpleeghuis_besmette_locaties.titel_sidebar}
                >
                  <SidebarMetric
                    data={data}
                    scope="nl"
                    metricName="nursing_home"
                    metricProperty="newly_infected_people"
                    localeTextKey="verpleeghuis_positief_geteste_personen"
                    differenceKey="nursing_home__newly_infected_people"
                  />
                </MetricMenuItemLink>

                <MetricMenuItemLink
                  href="/landelijk/gehandicaptenzorg"
                  icon={<Gehandicaptenzorg />}
                  title={
                    siteText.gehandicaptenzorg_besmette_locaties.titel_sidebar
                  }
                >
                  <SidebarMetric
                    data={data}
                    scope="nl"
                    metricName="disability_care"
                    metricProperty="newly_infected_people"
                    localeTextKey="gehandicaptenzorg_positief_geteste_personen"
                    differenceKey="disability_care__newly_infected_people"
                  />
                </MetricMenuItemLink>

                <MetricMenuItemLink
                  href="/landelijk/thuiswonende-ouderen"
                  icon={<ElderlyIcon />}
                  title={siteText.thuiswonende_ouderen.titel_sidebar}
                >
                  <SidebarMetric
                    data={data}
                    scope="nl"
                    metricName="elderly_at_home"
                    metricProperty="positive_tested_daily"
                    localeTextKey="thuiswonende_ouderen"
                    differenceKey="elderly_at_home__positive_tested_daily"
                  />
                </MetricMenuItemLink>
              </CategoryMenu>
              <CategoryMenu
                title={siteText.nationaal_layout.headings.vroege_signalen}
              >
                <MetricMenuItemLink
                  href="/landelijk/rioolwater"
                  icon={<RioolwaterMonitoring />}
                  title={siteText.rioolwater_metingen.titel_sidebar}
                >
                  <SidebarMetric
                    data={data}
                    scope="nl"
                    metricName="sewer"
                    metricProperty="average"
                    localeTextKey="rioolwater_metingen"
                    differenceKey="sewer__average"
                    annotationKey="riool_normalized"
                  />
                </MetricMenuItemLink>

                <MetricMenuItemLink
                  href="/landelijk/verdenkingen-huisartsen"
                  icon={<Arts />}
                  title={siteText.verdenkingen_huisartsen.titel_sidebar}
                >
                  <SidebarMetric
                    data={data}
                    scope="nl"
                    metricName="doctor"
                    metricProperty="covid_symptoms"
                    localeTextKey="verdenkingen_huisartsen"
                    differenceKey="doctor__covid_symptoms"
                  />
                </MetricMenuItemLink>
              </CategoryMenu>

              <CategoryMenu title={siteText.nationaal_layout.headings.gedrag}>
                <MetricMenuItemLink
                  href="/landelijk/gedrag"
                  icon={<Gedrag />}
                  title={siteText.nl_gedrag.sidebar.titel}
                >
                  <SidebarMetric
                    data={data}
                    scope="nl"
                    metricName="behavior"
                    localeTextKey="gedrag_common"
                  />
                </MetricMenuItemLink>
              </CategoryMenu>
            </Menu>
          </nav>
        }
      >
        {children}
      </AppContent>
    </>
  );
}
