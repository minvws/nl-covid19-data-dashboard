import {
  Coronavirus,
  RioolwaterMonitoring,
  Test,
  Vaccinaties,
  Ziekenhuis,
} from '@corona-dashboard/icons';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  CategoryMenu,
  Menu,
  MetricMenuItemLink,
} from '~/components/aside/menu';
import { Box } from '~/components/base';
import { ErrorBoundary } from '~/components/error-boundary';
import { AppContent } from '~/components/layout/app-content';
import { Heading, Text } from '~/components/typography';
import { VisuallyHidden } from '~/components/visually-hidden';
import { useIntl } from '~/intl';
import { useFeature } from '~/lib/features';
import { getVrForMunicipalityCode } from '~/utils/get-vr-for-municipality-code';
import { Link } from '~/utils/link';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { GmComboBox } from './components/gm-combo-box';

type GmLayoutProps = {
  children?: React.ReactNode;
} & (
  | {
      code: string;
      municipalityName: string;
    }
  | {
      /**
       * the route `/gemeente` can render without sidebar and thus without `data`
       */
      isLandingPage: true;
      code: string;
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
  const { children, municipalityName, code } = props;

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
                aria-labelledby="sidebar-title"
                role="navigation"
                backgroundColor="white"
                maxWidth={{ _: '38rem', md: undefined }}
                mx="auto"
                spacing={4}
              >
                <Box px={3} spacing={3}>
                  <Heading id="sidebar-title" level={2} variant="h3">
                    <VisuallyHidden as="span">
                      {siteText.gemeente_layout.headings.sidebar}
                    </VisuallyHidden>
                    {municipalityName}
                  </Heading>
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
                  {vaccinationFeature.isEnabled && (
                    <CategoryMenu
                      title={siteText.gemeente_layout.headings.vaccinaties}
                    >
                      <MetricMenuItemLink
                        href={reverseRouter.gm.vaccinaties(code)}
                        icon={<Vaccinaties />}
                        title={siteText.gemeente_vaccinaties.titel_sidebar}
                      />
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
                    />
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
                    />

                    <MetricMenuItemLink
                      href={reverseRouter.gm.sterfte(code)}
                      icon={<Coronavirus />}
                      title={siteText.veiligheidsregio_sterfte.titel_sidebar}
                    />
                  </CategoryMenu>

                  <CategoryMenu
                    title={siteText.gemeente_layout.headings.vroege_signalen}
                  >
                    <MetricMenuItemLink
                      href={reverseRouter.gm.rioolwater(code)}
                      icon={<RioolwaterMonitoring />}
                      title={
                        siteText.gemeente_rioolwater_metingen.titel_sidebar
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
