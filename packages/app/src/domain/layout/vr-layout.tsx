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
import { useReverseRouter } from '~/utils/use-reverse-router';
import { VrComboBox } from './components/vr-combo-box';
import { useSidebar } from './logic/sidebar';

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

  const code = router.query.code as string;

  const isMainRoute =
    router.route === '/veiligheidsregio' ||
    router.route === `/veiligheidsregio/[code]`;

  const showMetricLinks = router.route !== '/veiligheidsregio';

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

                  {items.map((x) =>
                    'items' in x ? (
                      <CategoryMenu {...x}>
                        {x.items.map((y) => (
                          <MetricMenuItemLink
                            key={y.key}
                            title={y.title}
                            href={y.href}
                            icon={y.icon}
                          />
                        ))}
                      </CategoryMenu>
                    ) : (
                      <MetricMenuItemLink {...x} />
                    )
                  )}
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
