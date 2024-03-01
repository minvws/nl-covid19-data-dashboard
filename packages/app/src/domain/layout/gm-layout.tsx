import { AppContent } from '~/components/layout/app-content';
import { Box } from '~/components/base';
import { ErrorBoundary } from '~/components/error-boundary';
import { GmComboBox } from './components/gm-combo-box';
import { Heading } from '~/components/typography';
import { List } from '@corona-dashboard/icons';
import { Menu, MenuItemLink, MenuRenderer } from '~/components/aside/menu';
import { space } from '~/style/theme';
import { useIntl } from '~/intl';
import { useRouter } from 'next/router';
import { useSidebar } from './logic/use-sidebar';
import { VisuallyHidden } from '~/components/visually-hidden';
import Head from 'next/head';
import { useReverseRouter } from '~/utils';
import React from 'react';

type GmLayoutProps = {
  children?: React.ReactNode;
  asideComponent?: React.ReactNode;
  displayListButton?: React.ReactNode;
  displayAsFlex?: boolean;
  getLink?: (code: string) => string;
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
 * - /gemeente && /gemeente/lijstweergave-> only show aside
 * - /gemeente/[metric] -> only show content (children)
 *
 * ### Desktop
 * - /gemeente && /gemeente/lijstweergave -> shows aside and content (children)
 * - /gemeente/[metric] -> shows aside and content (children)
 *
 * More info on persistent layouts:
 * https://adamwathan.me/2019/10/17/persistent-layout-patterns-in-nextjs/
 */
export function GmLayout(props: GmLayoutProps) {
  const reverseRouter = useReverseRouter();
  const { commonTexts } = useIntl();

  const {
    children,
    municipalityName,
    code,
    getLink,
    displayListButton,
    asideComponent = displayListButton ? (
      <Box display="flex" flexDirection="column" justifyContent="space-between" width="100%">
        <Box maxWidth={{ _: '38rem', md: undefined }}>
          <GmComboBox getLink={getLink} selectedGmCode={code} shouldFocusInput={false} />
        </Box>
        <Box maxWidth={{ _: '38rem', md: undefined }}>
          <Menu>
            <MenuItemLink icon={<List />} title={commonTexts.gemeente_layout.list.go_to_list_label} href={reverseRouter.gm.lijstweergave()} showArrow isLinkForMainMenu={false} />
          </Menu>
        </Box>
      </Box>
    ) : (
      <Box display="flex" flexDirection="column" justifyContent="space-between" width="100%">
        <Box maxWidth={{ _: '38rem', md: undefined }}>
          <GmComboBox getLink={getLink} selectedGmCode={code} shouldFocusInput={false} />
        </Box>
      </Box>
    ),
    displayAsFlex = false,
  } = props;

  const router = useRouter();

  const showMetricLinks = router.route !== '/gemeente' && router.route !== '/gemeente/lijstweergave';

  const isMainRoute = router.route === '/gemeente';

  const items = useSidebar({
    layout: 'gm',
    code: code,
    map: [
      ['development_of_the_virus', ['sewage_measurement']],
      ['consequences_for_healthcare', ['hospital_admissions']],
      ['actions_to_take', ['the_corona_vaccine']],
      ['archived_metrics', ['positive_tests', 'mortality']],
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
        searchComponent={asideComponent}
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
                maxWidth={{ _: '38rem', md: undefined }}
                marginX="auto"
                spacing={1}
              >
                <Box paddingX={space[3]}>
                  <Heading id="sidebar-title" level={2} variant="h3">
                    <VisuallyHidden as="span">{commonTexts.gemeente_layout.headings.sidebar}</VisuallyHidden>
                    {municipalityName}
                  </Heading>
                </Box>

                <Menu spacing={2}>
                  <MenuRenderer items={items} />
                </Menu>
              </Box>
            )}
          </>
        }
        displayAsFlex={displayAsFlex}
      >
        <ErrorBoundary>{children}</ErrorBoundary>
      </AppContent>
    </>
  );
}
