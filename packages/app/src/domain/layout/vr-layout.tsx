import Head from 'next/head';
import { useRouter } from 'next/router';
import { Menu, MenuRenderer } from '~/components/aside/menu';
import { Box } from '~/components/base';
import { ErrorBoundary } from '~/components/error-boundary';
import { AppContent } from '~/components/layout/app-content';
import { Heading } from '~/components/typography';
import { VisuallyHidden } from '~/components/visually-hidden';
import { useIntl } from '~/intl';
import { VrComboBox } from './components/vr-combo-box';
import { useSidebar } from './logic/use-sidebar';

type VrLayoutProps = {
  children?: React.ReactNode;
  isLandingPage?: boolean;
  getLink?: (code: string) => string;
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
 * https://adamwathan.me/2019/10/17/persistent-layout-patterns-in-nextjs/
 */
export function VrLayout(props: VrLayoutProps) {
  const { children, vrName, isLandingPage, getLink } = props;

  const router = useRouter();
  const { commonTexts } = useIntl();

  const code = router.query.code as string;

  const isMainRoute = router.route === '/veiligheidsregio';

  const showMetricLinks = router.route !== '/veiligheidsregio';

  const items = useSidebar({
    layout: 'vr',
    code: code,
    map: [
      ['development_of_the_virus', ['sewage_measurement', 'positive_tests', 'mortality']],
      ['consequences_for_healthcare', ['hospital_admissions', 'nursing_home_care']],
      ['actions_to_take', ['vaccinations', 'current_advices']],
      ['archived_metrics', ['disabled_care', 'elderly_at_home', 'compliance', 'source_investigation']],
    ],
  });

  return (
    <>
      <Head>
        <link key="dc-spatial" rel="dcterms:spatial" href="https://standaarden.overheid.nl/owms/terms/Nederland" />
        <link key="dc-spatial-title" rel="dcterms:spatial" href="https://standaarden.overheid.nl/owms/terms/Nederland" title="Nederland" />
      </Head>

      <AppContent
        hideBackButton={isMainRoute}
        searchComponent={
          <Box backgroundColor="white" maxWidth={{ _: '38rem', md: undefined }} mx="auto">
            <VrComboBox getLink={getLink} selectedVrCode={code} />
          </Box>
        }
        sidebarComponent={
          <>
            {!isLandingPage && showMetricLinks && (
              <Box
                as="nav"
                id="metric-navigation"
                aria-labelledby="sidebar-title"
                role="navigation"
                backgroundColor="white"
                maxWidth={{ _: '38rem', md: undefined }}
                mx="auto"
                spacing={1}
              >
                <Box px={3}>
                  <Heading id="sidebar-title" level={2} variant="h3">
                    <VisuallyHidden as="span">{commonTexts.veiligheidsregio_layout.headings.sidebar}</VisuallyHidden>
                    {vrName}
                  </Heading>
                </Box>

                <Menu spacing={2}>
                  <MenuRenderer items={items} />
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
