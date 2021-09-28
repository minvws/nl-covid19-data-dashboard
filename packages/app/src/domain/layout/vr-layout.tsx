import { Vr } from '@corona-dashboard/common';
import {
  Coronavirus,
  Elderly,
  Gedrag,
  GehandicaptenZorg,
  RioolwaterMonitoring,
  Test,
  Vaccinaties,
  Verpleeghuiszorg,
  Ziekenhuis,
} from '@corona-dashboard/icons';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { isDefined, isPresent } from 'ts-is-present';
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
import { Text } from '~/components/typography';
import { VaccineSidebarMetricVrGm } from '~/domain/vaccine/vaccine-sidebar-metric-vr-gm';
import { useIntl } from '~/intl';
import { useFeature } from '~/lib/features';
import { SituationsSidebarValue } from '~/static-props/situations/get-situations-sidebar-value';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { SituationsSidebarMetric } from '../situations/situations-sidebar-metric';
import { VrComboBox } from './components/vr-combo-box';

export const vrPageMetricNames = [
  'code',
  'tested_overall',
  'deceased_rivm',
  'hospital_nice',
  'nursing_home',
  'disability_care',
  'elderly_at_home',
  'sewer',
  'behavior',
  'difference',
  'vaccine_coverage_per_age_group',
] as const;

export type VrRegionPageMetricNames = typeof vrPageMetricNames[number];

export type VrPageMetricData = {
  situationsSidebarValue: SituationsSidebarValue;
} & Pick<Vr, VrRegionPageMetricNames>;

type VrLayoutProps = {
  lastGenerated: string;
  children?: React.ReactNode;
} & (
  | {
      data: VrPageMetricData;
      vrName: string;
    }
  | {
      /**
       * the route `/veiligheidsregio` can render without sidebar and thus without `data`
       */
      isLandingPage: true;
      data?: undefined;
      vrName?: undefined;
    }
);

/**
 * VrLayout is a composition of persistent layouts.
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
export function VrLayout(props: VrLayoutProps) {
  const { children, data, vrName } = props;

  const router = useRouter();
  const reverseRouter = useReverseRouter();
  const { siteText } = useIntl();
  const vaccinationFeature = useFeature('vrVaccinationPage');

  const code = router.query.code as string;

  const isMainRoute =
    router.route === '/veiligheidsregio' ||
    router.route === `/veiligheidsregio/[code]`;

  const showMetricLinks = router.route !== '/veiligheidsregio';

  if (isDefined(data)) {
    data.difference.sewer__average.difference = Math.round(
      data.difference.sewer__average.difference
    );
    data.difference.sewer__average.old_value = Math.round(
      data.difference.sewer__average.old_value
    );
    data.sewer.last_value.average = isPresent(data.sewer.last_value.average)
      ? Math.round(data.sewer.last_value.average)
      : null;
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

      <AppContent
        hideMenuButton={isMainRoute}
        searchComponent={
          <Box
            backgroundColor="white"
            maxWidth={{ _: '38rem', md: undefined }}
            mx="auto"
          >
            <VrComboBox />
          </Box>
        }
        sidebarComponent={
          <>
            {/**
             * data is only available on /veiligheidsregio/{VRxx} routes
             * and therefore optional
             */}
            {data && showMetricLinks && (
              <Box
                as="nav"
                /** re-mount when route changes in order to blur anchors */
                key={router.asPath}
                id="metric-navigation"
                aria-label={siteText.aria_labels.metriek_navigatie}
                role="navigation"
                spacing={3}
                backgroundColor="white"
                maxWidth={{ _: '38rem', md: undefined }}
                mx="auto"
              >
                <Box px={3}>
                  <Text variant={'h3'} fontWeight="bold">
                    {vrName}
                  </Text>
                </Box>

                <Menu spacing={4}>
                  <Box>
                    <MetricMenuButtonLink
                      href={reverseRouter.vr.maatregelen(code)}
                      title={
                        siteText.veiligheidsregio_maatregelen.titel_sidebar
                      }
                      subtitle={
                        siteText.veiligheidsregio_maatregelen.subtitel_sidebar
                      }
                    />
                  </Box>

                  {vaccinationFeature.isEnabled &&
                    data.vaccine_coverage_per_age_group && (
                      <CategoryMenu
                        title={
                          siteText.veiligheidsregio_layout.headings.vaccinaties
                        }
                      >
                        <MetricMenuItemLink
                          href={reverseRouter.vr.vaccinaties(code)}
                          icon={<Vaccinaties />}
                          title={
                            siteText.veiligheidsregio_vaccinaties.titel_sidebar
                          }
                        >
                          <VaccineSidebarMetricVrGm
                            data={data.vaccine_coverage_per_age_group.values}
                            description={
                              siteText.veiligheidsregio_vaccinaties.titel_kpi
                            }
                          />
                        </MetricMenuItemLink>
                      </CategoryMenu>
                    )}

                  <CategoryMenu
                    title={
                      siteText.veiligheidsregio_layout.headings.ziekenhuizen
                    }
                  >
                    <MetricMenuItemLink
                      href={reverseRouter.vr.ziekenhuisopnames(code)}
                      icon={<Ziekenhuis />}
                      title={
                        siteText.veiligheidsregio_ziekenhuisopnames_per_dag
                          .titel_sidebar
                      }
                    >
                      <SidebarMetric
                        data={data}
                        metricName="hospital_nice"
                        metricProperty="admissions_on_date_of_admission_moving_average"
                        localeTextKey="veiligheidsregio_ziekenhuisopnames_per_dag"
                        hideDate
                      />
                    </MetricMenuItemLink>
                  </CategoryMenu>

                  <CategoryMenu
                    title={
                      siteText.veiligheidsregio_layout.headings.besmettingen
                    }
                  >
                    <MetricMenuItemLink
                      href={reverseRouter.vr.positiefGetesteMensen(code)}
                      icon={<Test />}
                      title={
                        siteText.veiligheidsregio_positief_geteste_personen
                          .titel_sidebar
                      }
                    >
                      <SidebarMetric
                        data={data}
                        metricName="tested_overall"
                        metricProperty="infected"
                        localeTextKey="veiligheidsregio_positief_geteste_personen"
                        differenceKey="tested_overall__infected_moving_average"
                      />
                    </MetricMenuItemLink>

                    <MetricMenuItemLink
                      href={reverseRouter.vr.sterfte(code)}
                      icon={<Coronavirus />}
                      title={siteText.veiligheidsregio_sterfte.titel_sidebar}
                    >
                      <SidebarMetric
                        data={data}
                        metricName="deceased_rivm"
                        metricProperty="covid_daily"
                        localeTextKey="veiligheidsregio_sterfte"
                        differenceKey="deceased_rivm__covid_daily"
                      />
                    </MetricMenuItemLink>

                    <MetricMenuItemLink
                      href={reverseRouter.vr.brononderzoek(code)}
                      icon={<Gedrag />}
                      title={siteText.brononderzoek.titel_sidebar}
                    >
                      <SituationsSidebarMetric />
                    </MetricMenuItemLink>
                  </CategoryMenu>

                  <CategoryMenu
                    title={siteText.veiligheidsregio_layout.headings.gedrag}
                  >
                    <MetricMenuItemLink
                      href={reverseRouter.vr.gedrag(code)}
                      icon={<Gedrag />}
                      title={siteText.regionaal_gedrag.sidebar.titel}
                    >
                      <SidebarMetric
                        data={data}
                        metricName="behavior"
                        localeTextKey="gedrag_common"
                      />
                    </MetricMenuItemLink>
                  </CategoryMenu>

                  <CategoryMenu
                    title={
                      siteText.veiligheidsregio_layout.headings
                        .kwetsbare_groepen
                    }
                  >
                    <MetricMenuItemLink
                      href={reverseRouter.vr.verpleeghuiszorg(code)}
                      icon={<Verpleeghuiszorg />}
                      title={
                        siteText.veiligheidsregio_verpleeghuis_besmette_locaties
                          .titel_sidebar
                      }
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
                      href={reverseRouter.vr.gehandicaptenzorg(code)}
                      icon={<GehandicaptenZorg />}
                      title={
                        siteText.gehandicaptenzorg_besmette_locaties
                          .titel_sidebar
                      }
                    >
                      <SidebarMetric
                        data={data}
                        metricName="disability_care"
                        metricProperty="newly_infected_people"
                        localeTextKey="veiligheidsregio_gehandicaptenzorg_positief_geteste_personen"
                        differenceKey="disability_care__newly_infected_people"
                      />
                    </MetricMenuItemLink>

                    <MetricMenuItemLink
                      href={reverseRouter.vr.thuiswonendeOuderen(code)}
                      icon={<Elderly />}
                      title={
                        siteText.veiligheidsregio_thuiswonende_ouderen
                          .titel_sidebar
                      }
                    >
                      <SidebarMetric
                        data={data}
                        metricName="elderly_at_home"
                        metricProperty="positive_tested_daily"
                        localeTextKey="veiligheidsregio_thuiswonende_ouderen"
                        differenceKey="elderly_at_home__positive_tested_daily"
                      />
                    </MetricMenuItemLink>
                  </CategoryMenu>
                  <CategoryMenu
                    title={
                      siteText.veiligheidsregio_layout.headings.vroege_signalen
                    }
                  >
                    <MetricMenuItemLink
                      href={reverseRouter.vr.rioolwater(code)}
                      icon={<RioolwaterMonitoring />}
                      title={
                        siteText.veiligheidsregio_rioolwater_metingen
                          .titel_sidebar
                      }
                    >
                      <SidebarMetric
                        data={data}
                        metricName="sewer"
                        metricProperty="average"
                        localeTextKey="veiligheidsregio_rioolwater_metingen"
                        differenceKey="sewer__average"
                        annotationKey="riool_normalized"
                      />
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
