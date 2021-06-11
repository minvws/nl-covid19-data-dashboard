import { National } from '@corona-dashboard/common';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Arts from '~/assets/arts.svg';
import ElderlyIcon from '~/assets/elderly.svg';
import Gedrag from '~/assets/gedrag.svg';
import Gehandicaptenzorg from '~/assets/gehandicapte-zorg.svg';
import Phone from '~/assets/phone.svg';
import ReproIcon from '~/assets/reproductiegetal.svg';
import RioolwaterMonitoring from '~/assets/rioolwater-monitoring.svg';
import GetestIcon from '~/assets/test.svg';
import VaccinatieIcon from '~/assets/vaccinaties.svg';
import Verpleeghuiszorg from '~/assets/verpleeghuiszorg.svg';
import VirusIcon from '~/assets/virus.svg';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import Ziektegolf from '~/assets/ziektegolf.svg';
import {
  CategoryMenu,
  Menu,
  MetricMenuButtonLink,
  MetricMenuItemLink,
} from '~/components/aside/menu';
import { Box } from '~/components/base';
import { ErrorBoundary } from '~/components/error-boundary';
import { AppContent } from '~/components/layout/app-content';
import { SidebarMetric } from '~/components/sidebar-metric';
import { SidebarKpiValue } from '~/components/sidebar-metric/sidebar-kpi-value';
import { useIntl } from '~/intl';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { SituationIcon } from '../situations/components/situation-icon';

export const nlPageMetricNames = [
  'vaccine_administered_total',
  'tested_overall',
  'infectious_people',
  'reproduction',
  'deceased_rivm',
  'hospital_nice',
  'hospital_nice_per_age_group',
  'intensive_care_nice',
  'intensive_care_nice_per_age_group',
  'nursing_home',
  'disability_care',
  'elderly_at_home',
  'sewer',
  'doctor',
  'behavior',
  'difference',
  'corona_melder_app',
  'behavior_per_age_group',
] as const;

export type NlPageMetricNames = typeof nlPageMetricNames[number];

export type NationalPageMetricData = Pick<National, NlPageMetricNames>;

interface NationalLayoutProps {
  lastGenerated: string;
  data: NationalPageMetricData;
  children?: React.ReactNode;
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
export function NationalLayout(props: NationalLayoutProps) {
  const { children, data } = props;
  const router = useRouter();
  const reverseRouter = useReverseRouter();
  const breakpoints = useBreakpoints();
  const { siteText } = useIntl();

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
          <Box
            as="nav"
            /** re-mount when route changes in order to blur anchors */
            key={router.asPath}
            id="metric-navigation"
            aria-label={siteText.aria_labels.metriek_navigatie}
            role="navigation"
            pt={4}
          >
            <Menu>
              <MetricMenuButtonLink
                title={siteText.nationaal_maatregelen.titel_sidebar}
                subtitle={siteText.nationaal_maatregelen.subtitel_sidebar}
                href={{
                  pathname: reverseRouter.nl.maatregelen(),
                  query: breakpoints.md
                    ? {} // only add menu flags on narrow devices
                    : isMenuOpen
                    ? { menu: '0' }
                    : { menu: '1' },
                }}
              />

              <CategoryMenu
                title={siteText.nationaal_layout.headings.vaccinaties}
                isFirstItem
              >
                <MetricMenuItemLink
                  href={reverseRouter.nl.vaccinaties()}
                  icon={<VaccinatieIcon />}
                  title={siteText.vaccinaties.titel_sidebar}
                >
                  <SidebarMetric
                    data={data}
                    scope="nl"
                    metricName="vaccine_administered_total"
                    metricProperty="estimated"
                    localeTextKey="vaccinaties"
                  />
                </MetricMenuItemLink>
              </CategoryMenu>

              <CategoryMenu
                title={siteText.nationaal_layout.headings.ziekenhuizen}
              >
                <MetricMenuItemLink
                  href={reverseRouter.nl.ziekenhuisopnames()}
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
                    differenceKey="hospital_nice__admissions_on_date_of_reporting_moving_average"
                    showBarScale={true}
                  />
                </MetricMenuItemLink>

                <MetricMenuItemLink
                  href={reverseRouter.nl.intensiveCareOpnames()}
                  icon={<Arts />}
                  title={siteText.ic_opnames_per_dag.titel_sidebar}
                >
                  <SidebarMetric
                    data={data}
                    scope="nl"
                    metricName="intensive_care_nice"
                    metricProperty="admissions_on_date_of_reporting"
                    localeTextKey="ic_opnames_per_dag"
                    differenceKey="intensive_care_nice__admissions_on_date_of_reporting_moving_average"
                    showBarScale={true}
                  />
                </MetricMenuItemLink>
              </CategoryMenu>
              <CategoryMenu
                title={siteText.nationaal_layout.headings.besmettingen}
              >
                <MetricMenuItemLink
                  href={reverseRouter.nl.positiefGetesteMensen()}
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
                    differenceKey="tested_overall__infected_moving_average"
                    showBarScale={true}
                  />
                </MetricMenuItemLink>

                <MetricMenuItemLink
                  href={reverseRouter.nl.besmettelijkeMensen()}
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
                  href={reverseRouter.nl.reproductiegetal()}
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
                  href={reverseRouter.nl.sterfte()}
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

                <MetricMenuItemLink
                  href={reverseRouter.nl.brononderzoek()}
                  icon={<SituationIcon id="gathering" />}
                  title={siteText.brononderzoek.titel_sidebar}
                >
                  <SidebarKpiValue title={siteText.brononderzoek.kpi_titel} />
                </MetricMenuItemLink>
              </CategoryMenu>

              <CategoryMenu title={siteText.nationaal_layout.headings.gedrag}>
                <MetricMenuItemLink
                  href={reverseRouter.nl.gedrag()}
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

              <CategoryMenu
                title={siteText.nationaal_layout.headings.kwetsbare_groepen}
              >
                <MetricMenuItemLink
                  href={reverseRouter.nl.verpleeghuiszorg()}
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
                  href={reverseRouter.nl.gehandicaptenzorg()}
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
                  href={reverseRouter.nl.thuiswonendeOuderen()}
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
                  href={reverseRouter.nl.rioolwater()}
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
                  href={reverseRouter.nl.verdenkingenHuisartsen()}
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

              <CategoryMenu title={siteText.nationaal_layout.headings.overig}>
                <MetricMenuItemLink
                  href={reverseRouter.nl.coronamelder()}
                  icon={<Phone />}
                  title={siteText.corona_melder_app.sidebar.titel}
                >
                  <SidebarMetric
                    data={data}
                    scope="nl"
                    metricName="corona_melder_app"
                    metricProperty="warned_daily"
                    localeTextKey="corona_melder_app"
                    differenceKey="corona_melder_app__warned_daily"
                  />
                </MetricMenuItemLink>
              </CategoryMenu>
            </Menu>
          </Box>
        }
      >
        <ErrorBoundary>{children}</ErrorBoundary>
      </AppContent>
    </>
  );
}
