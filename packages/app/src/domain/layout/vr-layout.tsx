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
import {
  CategoryMenu,
  Menu,
  MetricMenuButtonLink,
  MetricMenuItemLink,
} from '~/components/aside/menu';
import { Box } from '~/components/base';
import { ErrorBoundary } from '~/components/error-boundary';
import { AppContent } from '~/components/layout/app-content';
import { Heading } from '~/components/typography';
import { VisuallyHidden } from '~/components/visually-hidden';
import { useIntl } from '~/intl';
import { useFeature } from '~/lib/features';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { VrComboBox } from './components/vr-combo-box';

type VrLayoutProps = {
  children?: React.ReactNode;
  isLandingPage?: boolean;
} & (
  | {
      vrName: string;
      isLandingPage?: never;
    }
  | {
      /**
       * the route `/veiligheidsregio` can render without sidebar and thus without `data`
       */
      isLandingPage: true;
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
  const { children, vrName, isLandingPage } = props;

  const router = useRouter();
  const reverseRouter = useReverseRouter();
  const { siteText } = useIntl();
  const vaccinationFeature = useFeature('vrVaccinationPage');

  const code = router.query.code as string;

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
            {!isLandingPage && showMetricLinks && (
              <Box
                as="nav"
                /** re-mount when route changes in order to blur anchors */
                key={router.asPath}
                id="metric-navigation"
                aria-labelledby="sidebar-title"
                role="navigation"
                spacing={3}
                backgroundColor="white"
                maxWidth={{ _: '38rem', md: undefined }}
                mx="auto"
              >
                <Box px={3}>
                  <Heading id="sidebar-title" level={2} variant="h3">
                    <VisuallyHidden as="span">
                      {siteText.veiligheidsregio_layout.headings.sidebar}
                    </VisuallyHidden>
                    {vrName}
                  </Heading>
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

                  {vaccinationFeature.isEnabled && (
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
                      />
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
                    />
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
                    />
                    <MetricMenuItemLink
                      href={reverseRouter.vr.sterfte(code)}
                      icon={<Coronavirus />}
                      title={siteText.veiligheidsregio_sterfte.titel_sidebar}
                    />
                    <MetricMenuItemLink
                      href={reverseRouter.vr.brononderzoek(code)}
                      icon={<Gedrag />}
                      title={siteText.brononderzoek.titel_sidebar}
                    />
                  </CategoryMenu>

                  <CategoryMenu
                    title={siteText.veiligheidsregio_layout.headings.gedrag}
                  >
                    <MetricMenuItemLink
                      href={reverseRouter.vr.gedrag(code)}
                      icon={<Gedrag />}
                      title={siteText.regionaal_gedrag.sidebar.titel}
                    />
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
                    />

                    <MetricMenuItemLink
                      href={reverseRouter.vr.gehandicaptenzorg(code)}
                      icon={<GehandicaptenZorg />}
                      title={
                        siteText.gehandicaptenzorg_besmette_locaties
                          .titel_sidebar
                      }
                    />

                    <MetricMenuItemLink
                      href={reverseRouter.vr.thuiswonendeOuderen(code)}
                      icon={<Elderly />}
                      title={
                        siteText.veiligheidsregio_thuiswonende_ouderen
                          .titel_sidebar
                      }
                    />
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
                    />
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
