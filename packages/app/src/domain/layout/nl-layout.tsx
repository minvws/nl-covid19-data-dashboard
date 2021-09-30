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
import { Heading, Text } from '~/components/typography';
import { VisuallyHidden } from '~/components/visually-hidden';
import { useIntl } from '~/intl';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { useSidebar } from './logic/sidebar';

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

  const router = useRouter();
  const reverseRouter = useReverseRouter();

  const { siteText } = useIntl();

  const topItems = useSidebar({
    layout: 'nl',
    map: ['measures'],
  });

  const items = useSidebar({
    layout: 'nl',
    map: [
      ['vaccinations', ['vaccinations']],
      ['hospitals', ['hospital_admissions', 'intensive_care_admissions']],
      [
        'infections',
        [
          'positive_tests',
          'reproduction_number',
          'mortality',
          'source_investigation',
        ],
      ],
      ['behaviour', ['compliance']],
      [
        'vulnerable_groups',
        ['nursing_home_care', 'disabled_care', 'elderly_at_home'],
      ],
      ['early_indicators', ['sewage_measurement']],
      ['other', ['coronamelder_app']],
    ],
  });

  const archivedItems = useSidebar({
    layout: 'nl',
    map: [
      [
        'archived_metrics',
        ['infectious_people', 'general_practitioner_suspicions'],
      ],
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

            <Box px={3} pb={2}>
              <Heading level={2} variant={'h3'}>
                {siteText.sidebar.nl.title}
              </Heading>
            </Box>

            <Box mb={4}>
              <Menu>
                {topItems.map((x) =>
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

            <Box px={3}>
              <Heading level={3}>Alle cijfers</Heading>
            </Box>

            <Box spacing={3}>
              <Menu spacing={3}>
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

              <Box
                borderTopColor="border"
                borderTopStyle="solid"
                borderTopWidth={1}
                pt={2}
              >
                <Menu>
                  {archivedItems.map((x) =>
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
            </Box>
          </Box>
        }
      >
        <ErrorBoundary>{children}</ErrorBoundary>
      </AppContent>
    </>
  );
}
