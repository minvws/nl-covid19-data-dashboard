import Head from 'next/head';
import { useRouter } from 'next/router';
import ElderlyIcon from '~/assets/elderly.svg';
import Gedrag from '~/assets/gedrag.svg';
import Gehandicaptenzorg from '~/assets/gehandicapte-zorg.svg';
import Maatregelen from '~/assets/maatregelen.svg';
import RioolwaterMonitoring from '~/assets/rioolwater-monitoring.svg';
import GetestIcon from '~/assets/test.svg';
import Verpleeghuiszorg from '~/assets/verpleeghuiszorg.svg';
import VirusIcon from '~/assets/virus.svg';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import {
  CategoryMenu,
  Menu,
  MetricMenuItemLink,
} from '~/components-styled/aside/menu';
import { AppContent } from '~/components-styled/layout/app-content';
import { SidebarMetric } from '~/components-styled/sidebar-metric';
import { Text } from '~/components-styled/typography';
import { getLayout as getSiteLayout } from '~/domain/layout/layout';
import siteText from '~/locale/index';
import { colors } from '~/style/theme';
import { Regionaal } from '@corona-dashboard/common';
import { SafetyRegionComboBox } from './components/safety-region-combo-box';

interface SafetyRegionLayoutProps {
  lastGenerated: string;
  data?: Regionaal;
  safetyRegionName?: string;
  children?: React.ReactNode;
}

export function getSafetyRegionLayout() {
  return function (page: React.ReactNode, pageProps: SafetyRegionLayoutProps) {
    return getSiteLayout(
      siteText.veiligheidsregio_metadata,
      pageProps.lastGenerated
    )(<SafetyRegionLayout {...pageProps}>{page}</SafetyRegionLayout>);
  };
}

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
function SafetyRegionLayout(props: SafetyRegionLayoutProps) {
  const { children, data, safetyRegionName } = props;

  const router = useRouter();
  const { code } = router.query;

  const isMainRoute =
    router.route === '/veiligheidsregio' ||
    router.route === `/veiligheidsregio/[code]`;

  const showMetricLinks = router.route !== '/veiligheidsregio';

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
        searchComponent={<SafetyRegionComboBox />}
        sidebarComponent={
          <>
            {/**
             * data is only available on /veiligheidsregio/{VRxx} routes
             * and therefore optional
             */}
            {data && showMetricLinks && (
              <nav
                /** re-mount when route changes in order to blur anchors */
                key={router.asPath}
                id="metric-navigation"
                aria-label={siteText.aria_labels.metriek_navigatie}
                role="navigation"
              >
                <Text fontSize={3} fontWeight="bold" px={3} m={0} mb={-3}>
                  {safetyRegionName}
                </Text>
                <Menu>
                  <CategoryMenu
                    title={siteText.veiligheidsregio_layout.headings.algemeen}
                  >
                    <MetricMenuItemLink
                      href={`/veiligheidsregio/${code}/maatregelen`}
                      icon={<Maatregelen fill={colors.restrictions} />}
                      title={
                        siteText.veiligheidsregio_maatregelen.titel_sidebar
                      }
                      subtitle={
                        siteText.veiligheidsregio_maatregelen.subtitel_sidebar
                      }
                    />
                  </CategoryMenu>

                  <CategoryMenu
                    title={
                      siteText.veiligheidsregio_layout.headings.besmettingen
                    }
                  >
                    <MetricMenuItemLink
                      href={`/veiligheidsregio/${code}/positief-geteste-mensen`}
                      icon={<GetestIcon />}
                      title={
                        siteText.veiligheidsregio_positief_geteste_personen
                          .titel_sidebar
                      }
                    >
                      <SidebarMetric
                        data={data}
                        scope="vr"
                        metricName="tested_overall"
                        metricProperty="infected"
                        altBarScaleMetric={{
                          metricName: 'tested_overall',
                          metricProperty: 'infected_per_100k',
                        }}
                        localeTextKey="veiligheidsregio_positief_geteste_personen"
                        differenceKey="tested_overall__infected"
                        showBarScale={true}
                      />
                    </MetricMenuItemLink>

                    <MetricMenuItemLink
                      href={`/veiligheidsregio/${code}/sterfte`}
                      icon={<VirusIcon />}
                      title={siteText.veiligheidsregio_sterfte.titel_sidebar}
                    >
                      <SidebarMetric
                        data={data}
                        scope="vr"
                        metricName="deceased_rivm"
                        metricProperty="covid_daily"
                        localeTextKey="veiligheidsregio_sterfte"
                      />
                    </MetricMenuItemLink>
                  </CategoryMenu>
                  <CategoryMenu
                    title={
                      siteText.veiligheidsregio_layout.headings.ziekenhuizen
                    }
                  >
                    <MetricMenuItemLink
                      href={`/veiligheidsregio/${code}/ziekenhuis-opnames`}
                      icon={<Ziekenhuis />}
                      title={
                        siteText.veiligheidsregio_ziekenhuisopnames_per_dag
                          .titel_sidebar
                      }
                    >
                      <SidebarMetric
                        data={data}
                        scope="vr"
                        metricName="hospital_nice"
                        metricProperty="admissions_on_date_of_reporting"
                        localeTextKey="veiligheidsregio_ziekenhuisopnames_per_dag"
                        differenceKey="hospital_nice__admissions_on_date_of_reporting"
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
                      href={`/veiligheidsregio/${code}/verpleeghuiszorg`}
                      icon={<Verpleeghuiszorg />}
                      title={
                        siteText.veiligheidsregio_verpleeghuis_besmette_locaties
                          .titel_sidebar
                      }
                    >
                      <SidebarMetric
                        data={data}
                        scope="vr"
                        metricName="nursing_home"
                        metricProperty="newly_infected_people"
                        localeTextKey="verpleeghuis_positief_geteste_personen"
                        differenceKey="nursing_home__newly_infected_people"
                      />
                    </MetricMenuItemLink>

                    <MetricMenuItemLink
                      href={`/veiligheidsregio/${code}/gehandicaptenzorg`}
                      icon={<Gehandicaptenzorg />}
                      title={
                        siteText.gehandicaptenzorg_besmette_locaties
                          .titel_sidebar
                      }
                    >
                      <SidebarMetric
                        data={data}
                        scope="vr"
                        metricName="disability_care"
                        metricProperty="newly_infected_people"
                        localeTextKey="veiligheidsregio_gehandicaptenzorg_positief_geteste_personen"
                      />
                    </MetricMenuItemLink>

                    <MetricMenuItemLink
                      href={`/veiligheidsregio/${code}/thuiswonende-ouderen`}
                      icon={<ElderlyIcon />}
                      title={
                        siteText.veiligheidsregio_thuiswonende_ouderen
                          .titel_sidebar
                      }
                    >
                      <SidebarMetric
                        data={data}
                        scope="vr"
                        metricName="elderly_at_home"
                        metricProperty="positive_tested_daily"
                        localeTextKey="veiligheidsregio_thuiswonende_ouderen"
                      />
                    </MetricMenuItemLink>
                  </CategoryMenu>
                  <CategoryMenu
                    title={
                      siteText.veiligheidsregio_layout.headings.vroege_signalen
                    }
                  >
                    <MetricMenuItemLink
                      href={`/veiligheidsregio/${code}/rioolwater`}
                      icon={<RioolwaterMonitoring />}
                      title={
                        siteText.veiligheidsregio_rioolwater_metingen
                          .titel_sidebar
                      }
                    >
                      <SidebarMetric
                        data={data}
                        scope="vr"
                        metricName="sewer"
                        metricProperty="average"
                        localeTextKey="veiligheidsregio_rioolwater_metingen"
                        differenceKey="sewer__average"
                        annotationKey="riool_normalized"
                      />
                    </MetricMenuItemLink>
                  </CategoryMenu>

                  <CategoryMenu
                    title={siteText.veiligheidsregio_layout.headings.gedrag}
                  >
                    <MetricMenuItemLink
                      href={`/veiligheidsregio/${code}/gedrag`}
                      icon={<Gedrag />}
                      title={siteText.regionaal_gedrag.sidebar.titel}
                    >
                      <SidebarMetric
                        data={data}
                        scope="vr"
                        metricName="behavior"
                        localeTextKey="gedrag_common"
                      />
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
