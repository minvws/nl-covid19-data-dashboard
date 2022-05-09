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

  const showMetricLinks =
    router.route !== '/veiligheidsregio' &&
    router.route !== '/actueel/veiligheidsregio';

  const topItems = useSidebar({
    layout: 'vr',
    code: code,
    map: ['measures'],
  });

  const items = useSidebar({
    layout: 'vr',
    code: code,
    map: [
      ['vaccinations', ['vaccinations']],
      ['hospitals', ['hospital_admissions']],
      ['infections', ['positive_tests', 'mortality', 'source_investigation']],
      ['behaviour', ['compliance']],
      [
        'vulnerable_groups',
        ['nursing_home_care', 'disabled_care', 'elderly_at_home'],
      ],
      ['early_indicators', ['sewage_measurement']],
    ],
  });

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
        hideBackButton={isMainRoute}
        searchComponent={
          <Box
            backgroundColor="white"
            maxWidth={{ _: '38rem', md: undefined }}
            mx="auto"
          >
            <VrComboBox getLink={getLink} />
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
                    <VisuallyHidden as="span">
                      {commonTexts.veiligheidsregio_layout.headings.sidebar}
                    </VisuallyHidden>
                    {vrName}
                  </Heading>
                </Box>

                <Box pb={4}>
                  <Menu>
                    <MenuRenderer items={topItems} />
                  </Menu>
                </Box>

                <Box px={3}>
                  <Heading level={3}>
                    {commonTexts.sidebar.shared.metrics_title}
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
