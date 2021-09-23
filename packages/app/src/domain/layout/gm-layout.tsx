import { Gm, GmDifference } from '@corona-dashboard/common';
import {
  Coronavirus,
  RioolwaterMonitoring,
  Test,
  Vaccinaties,
  Ziekenhuis,
} from '@corona-dashboard/icons';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { isDefined } from 'ts-is-present';
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
import { VaccineSidebarMetricVrGm } from '~/domain/vaccine/vaccine-sidebar-metric-vr-gm';
import { useIntl } from '~/intl';
import { useFeature } from '~/lib/features';
import { getVrForMunicipalityCode } from '~/utils/get-vr-for-municipality-code';
import { Link } from '~/utils/link';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { GmComboBox } from './components/gm-combo-box';

export type GmSideBarData = {
  tested_overall: Pick<Gm['tested_overall'], 'last_value'>;
  deceased_rivm: Pick<Gm['deceased_rivm'], 'last_value'>;
  hospital_nice: Pick<Gm['hospital_nice'], 'last_value'>;
  sewer: Pick<Gm['sewer'], 'last_value'>;
  vaccine_coverage_per_age_group: Pick<
    Gm['vaccine_coverage_per_age_group'],
    'values'
  >;
};

type GmLayoutProps = {
  lastGenerated: string;
  children?: React.ReactNode;
} & (
  | {
      code: string;
      difference: GmDifference;
      data: GmSideBarData;
      municipalityName: string;
    }
  | {
      /**
       * the route `/gemeente` can render without sidebar and thus without `data`
       */
      isLandingPage: true;
      code: string;
      data?: undefined;
      difference?: undefined;
      municipalityName?: undefined;
    }
);

/**
 * GmLayout is a composition of persistent layouts.
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
export function GmLayout(props: GmLayoutProps) {
  const { children, data, municipalityName, code, difference } = props;

  const sidebarData = useMemo(() => {
    if (isDefined(difference) && isDefined(difference.sewer__average)) {
      difference.sewer__average.difference = Math.round(
        difference.sewer__average.difference
      );
      difference.sewer__average.old_value = Math.round(
        difference.sewer__average.old_value
      );
    }
    if (isDefined(data)) {
      data.sewer.last_value.average = Math.round(data.sewer.last_value.average);
    }
    return { ...data, difference };
  }, [data, difference]);

  const { siteText } = useIntl();
  const router = useRouter();
  const reverseRouter = useReverseRouter();
  const vaccinationFeature = useFeature('gmVaccinationPage');

  const showMetricLinks = router.route !== '/gemeente';

  const isMainRoute =
    router.route === '/gemeente' || router.route === `/gemeente/[code]`;

  const vr = getVrForMunicipalityCode(code);

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
            <GmComboBox />
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
                spacing={4}
              >
                <Box px={3} spacing={3}>
                  <Text variant="h3">{municipalityName}</Text>
                  {vr && (
                    <Text>
                      {siteText.common.veiligheidsregio_label}{' '}
                      <Link href={reverseRouter.vr.index(vr.code)}>
                        <a>{vr.name}</a>
                      </Link>
                    </Text>
                  )}
                </Box>

                <Menu spacing={4}>
                  {sidebarData && data?.vaccine_coverage_per_age_group && (
                    <>
                      {vaccinationFeature.isEnabled && (
                        <CategoryMenu
                          title={siteText.gemeente_layout.headings.vaccinaties}
                        >
                          <MetricMenuItemLink
                            href={reverseRouter.gm.vaccinaties(code)}
                            icon={<Vaccinaties />}
                            title={siteText.gemeente_vaccinaties.titel_sidebar}
                          >
                            <VaccineSidebarMetricVrGm
                              data={data.vaccine_coverage_per_age_group.values}
                              description={
                                siteText.gemeente_vaccinaties.titel_kpi
                              }
                            />
                          </MetricMenuItemLink>
                        </CategoryMenu>
                      )}

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
                            data={sidebarData}
                            metricName="hospital_nice"
                            metricProperty="admissions_on_date_of_admission_moving_average"
                            localeTextKey="gemeente_ziekenhuisopnames_per_dag"
                            hideDate
                          />
                        </MetricMenuItemLink>
                      </CategoryMenu>
                      <CategoryMenu
                        title={siteText.gemeente_layout.headings.besmettingen}
                      >
                        <MetricMenuItemLink
                          href={reverseRouter.gm.positiefGetesteMensen(code)}
                          icon={<Test />}
                          title={
                            siteText.gemeente_positief_geteste_personen
                              .titel_sidebar
                          }
                        >
                          <SidebarMetric
                            data={sidebarData}
                            metricName="tested_overall"
                            metricProperty="infected"
                            localeTextKey="gemeente_positief_geteste_personen"
                            differenceKey="tested_overall__infected_moving_average"
                          />
                        </MetricMenuItemLink>

                        <MetricMenuItemLink
                          href={reverseRouter.gm.sterfte(code)}
                          icon={<Coronavirus />}
                          title={
                            siteText.veiligheidsregio_sterfte.titel_sidebar
                          }
                        >
                          <SidebarMetric
                            data={sidebarData}
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
                      href={
                        sidebarData?.sewer && reverseRouter.gm.rioolwater(code)
                      }
                      icon={<RioolwaterMonitoring />}
                      title={
                        siteText.gemeente_rioolwater_metingen.titel_sidebar
                      }
                    >
                      {sidebarData?.sewer ? (
                        <SidebarMetric
                          data={sidebarData}
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
