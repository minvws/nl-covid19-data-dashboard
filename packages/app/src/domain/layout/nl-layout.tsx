import { Nl } from '@corona-dashboard/common';
import {
  Arts,
  Coronavirus,
  Elderly,
  Gedrag,
  GehandicaptenZorg,
  Phone,
  Reproductiegetal,
  RioolwaterMonitoring,
  Test,
  Vaccinaties,
  Varianten,
  Verpleeghuiszorg,
  Ziekenhuis,
  Ziektegolf,
} from '@corona-dashboard/icons';
import Head from 'next/head';
import { useRouter } from 'next/router';
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
import { VisuallyHidden } from '~/components/visually-hidden';
import { VariantSidebarValue } from '~/domain/variants/static-props';
import { useIntl } from '~/intl';
import { useFeature } from '~/lib/features';
import { SituationsSidebarValue } from '~/static-props/situations/get-situations-sidebar-value';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { SituationsSidebarMetric } from '../situations/situations-sidebar-metric';
import { VariantsSidebarMetric } from '../variants/variants-sidebar-metric';

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
  'named_difference',
  'corona_melder_app_warning',
  'behavior_per_age_group',
] as const;

export type NlPageMetricNames = typeof nlPageMetricNames[number];

type NlPageMetricData = {
  variantSidebarValue: VariantSidebarValue;
  situationsSidebarValue: SituationsSidebarValue;
} & Pick<Nl, NlPageMetricNames>;

interface NlLayoutProps {
  lastGenerated: string;
  data: NlPageMetricData;
  children?: React.ReactNode;
}

/**
 * NlLayout is a composition of persistent layouts.
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
export function NlLayout(props: NlLayoutProps) {
  const { children, data } = props;
  const router = useRouter();
  const reverseRouter = useReverseRouter();
  const { siteText } = useIntl();

  data.difference.sewer__average.difference = Math.round(
    data.difference.sewer__average.difference
  );
  data.difference.sewer__average.old_value = Math.round(
    data.difference.sewer__average.old_value
  );
  data.sewer.last_value.average = Math.round(data.sewer.last_value.average);

  const { isEnabled: isGpSuspicionsHistorical } = useFeature(
    'nlGpSuspicionsIsHistorical'
  );

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
            aria-labelledby="sidebar-title"
            role="navigation"
            pt={4}
            backgroundColor="white"
            maxWidth={{ _: '38rem', md: undefined }}
            mx="auto"
          >
            <VisuallyHidden as="h2" id="sidebar-title">
              {siteText.nationaal_layout.headings.sidebar}
            </VisuallyHidden>
            <Menu spacing={4}>
              <MetricMenuButtonLink
                title={siteText.nationaal_maatregelen.titel_sidebar}
                subtitle={siteText.nationaal_maatregelen.subtitel_sidebar}
                href={reverseRouter.nl.maatregelen()}
              />

              <CategoryMenu
                title={siteText.nationaal_layout.headings.vaccinaties}
              >
                <MetricMenuItemLink
                  href={reverseRouter.nl.vaccinaties()}
                  icon={<Vaccinaties />}
                  title={siteText.vaccinaties.titel_sidebar}
                >
                  <SidebarMetric
                    data={data}
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
                    metricName="hospital_nice"
                    metricProperty="admissions_on_date_of_admission_moving_average"
                    localeTextKey="ziekenhuisopnames_per_dag"
                  />
                </MetricMenuItemLink>

                <MetricMenuItemLink
                  href={reverseRouter.nl.intensiveCareOpnames()}
                  icon={<Arts />}
                  title={siteText.ic_opnames_per_dag.titel_sidebar}
                >
                  <SidebarMetric
                    data={data}
                    metricName="intensive_care_nice"
                    metricProperty="admissions_on_date_of_admission_moving_average"
                    localeTextKey="ic_opnames_per_dag"
                  />
                </MetricMenuItemLink>
              </CategoryMenu>
              <CategoryMenu
                title={siteText.nationaal_layout.headings.besmettingen}
              >
                <MetricMenuItemLink
                  href={reverseRouter.nl.positiefGetesteMensen()}
                  icon={<Test />}
                  title={siteText.positief_geteste_personen.titel_sidebar}
                >
                  <SidebarMetric
                    data={data}
                    metricName="tested_overall"
                    metricProperty="infected"
                    localeTextKey="positief_geteste_personen"
                    differenceKey="tested_overall__infected_moving_average"
                  />
                </MetricMenuItemLink>

                <MetricMenuItemLink
                  href={reverseRouter.nl.reproductiegetal()}
                  icon={<Reproductiegetal />}
                  title={siteText.reproductiegetal.titel_sidebar}
                >
                  <SidebarMetric
                    data={data}
                    metricName="reproduction"
                    metricProperty="index_average"
                    localeTextKey="reproductiegetal"
                    differenceKey="reproduction__index_average"
                  />
                </MetricMenuItemLink>

                <MetricMenuItemLink
                  href={reverseRouter.nl.sterfte()}
                  icon={<Coronavirus />}
                  title={siteText.sterfte.titel_sidebar}
                >
                  <SidebarMetric
                    data={data}
                    metricName="deceased_rivm"
                    metricProperty="covid_daily"
                    localeTextKey="sterfte"
                    differenceKey="deceased_rivm__covid_daily"
                  />
                </MetricMenuItemLink>

                {data.variantSidebarValue && (
                  <MetricMenuItemLink
                    href={reverseRouter.nl.varianten()}
                    icon={<Varianten />}
                    title={siteText.covid_varianten.titel_sidebar}
                  >
                    <VariantsSidebarMetric data={data.variantSidebarValue} />
                  </MetricMenuItemLink>
                )}

                <MetricMenuItemLink
                  href={reverseRouter.nl.brononderzoek()}
                  icon={<Gedrag />}
                  title={siteText.brononderzoek.titel_sidebar}
                >
                  <SituationsSidebarMetric />
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
                    metricName="nursing_home"
                    metricProperty="newly_infected_people"
                    localeTextKey="verpleeghuis_positief_geteste_personen"
                    differenceKey="nursing_home__newly_infected_people"
                  />
                </MetricMenuItemLink>

                <MetricMenuItemLink
                  href={reverseRouter.nl.gehandicaptenzorg()}
                  icon={<GehandicaptenZorg />}
                  title={
                    siteText.gehandicaptenzorg_besmette_locaties.titel_sidebar
                  }
                >
                  <SidebarMetric
                    data={data}
                    metricName="disability_care"
                    metricProperty="newly_infected_people"
                    localeTextKey="gehandicaptenzorg_positief_geteste_personen"
                    differenceKey="disability_care__newly_infected_people"
                  />
                </MetricMenuItemLink>

                <MetricMenuItemLink
                  href={reverseRouter.nl.thuiswonendeOuderen()}
                  icon={<Elderly />}
                  title={siteText.thuiswonende_ouderen.titel_sidebar}
                >
                  <SidebarMetric
                    data={data}
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
                    metricName="sewer"
                    metricProperty="average"
                    localeTextKey="rioolwater_metingen"
                    differenceKey="sewer__average"
                    annotationKey="riool_normalized"
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
                    metricName="corona_melder_app_warning"
                    metricProperty="count"
                    localeTextKey="corona_melder_app"
                    differenceKey="corona_melder_app_warning__count"
                  />
                </MetricMenuItemLink>
              </CategoryMenu>

              <CategoryMenu title={siteText.nationaal_layout.headings.archief}>
                <MetricMenuItemLink
                  href={reverseRouter.nl.besmettelijkeMensen()}
                  icon={<Ziektegolf />}
                  title={siteText.besmettelijke_personen.titel_sidebar}
                >
                  <SidebarKpiValue
                    title={siteText.besmettelijke_personen.kpi_titel}
                  />
                </MetricMenuItemLink>

                <MetricMenuItemLink
                  href={reverseRouter.nl.verdenkingenHuisartsen()}
                  icon={<Arts />}
                  title={siteText.verdenkingen_huisartsen.titel_sidebar}
                >
                  {isGpSuspicionsHistorical ? (
                    <SidebarKpiValue
                      title={siteText.verdenkingen_huisartsen.kpi_titel}
                    />
                  ) : (
                    <SidebarMetric
                      data={data}
                      metricName="doctor"
                      metricProperty="covid_symptoms"
                      localeTextKey="verdenkingen_huisartsen"
                      differenceKey="doctor__covid_symptoms"
                    />
                  )}
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
