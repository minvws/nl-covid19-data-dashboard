import Head from 'next/head';
import { Menu, MenuRenderer } from '~/components/aside/menu';
import { Box } from '~/components/base';
import { ErrorBoundary } from '~/components/error-boundary';
import { AppContent } from '~/components/layout/app-content';
import { Heading } from '~/components/typography';
import { VisuallyHidden } from '~/components/visually-hidden';
import { useIntl } from '~/intl';
import { space } from '~/style/theme';
import { useSidebar } from './logic/use-sidebar';

interface NlLayoutProps {
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
  const { children } = props;

  const { commonTexts } = useIntl();

  const items = useSidebar({
    layout: 'nl',
    map: [
      ['development_of_the_virus', ['sewage_measurement', 'tests', 'variants', 'mortality']],
      ['consequences_for_healthcare', ['hospitals_and_care', 'patients']],
      ['actions_to_take', ['vaccinations']],
      [
        'archived_metrics',
        [
          'nursing_home_care',
          'reproduction_number',
          'corona_thermometer',
          'compliance',
          'positive_tests',
          'disabled_care',
          'elderly_at_home',
          'coronamelder_app',
          'infectious_people',
          'general_practitioner_suspicions',
        ],
      ],
    ],
  });

  return (
    <>
      <Head>
        <link key="dc-spatial" rel="dcterms:spatial" href="https://standaarden.overheid.nl/owms/terms/Nederland" />
        <link key="dc-spatial-title" rel="dcterms:spatial" href="https://standaarden.overheid.nl/owms/terms/Nederland" title="Nederland" />
      </Head>

      <AppContent
        sidebarComponent={
          <Box
            as="nav"
            id="metric-navigation"
            aria-labelledby="sidebar-title"
            role="navigation"
            paddingTop={space[4]}
            backgroundColor="white"
            maxWidth={{ _: '38rem', md: undefined }}
            marginX="auto"
            spacing={1}
          >
            <VisuallyHidden as="h2" id="sidebar-title">
              {commonTexts.nationaal_layout.headings.sidebar}
            </VisuallyHidden>

            <Box paddingX={space[3]}>
              <Heading level={2} variant={'h3'}>
                {commonTexts.sidebar.nl.title}
              </Heading>
            </Box>

            <Box paddingBottom={space[3]}>
              <Menu spacing={2}>
                <MenuRenderer items={items} />
              </Menu>
            </Box>
          </Box>
        }
      >
        <ErrorBoundary>{children}</ErrorBoundary>
      </AppContent>
    </>
  );
}
