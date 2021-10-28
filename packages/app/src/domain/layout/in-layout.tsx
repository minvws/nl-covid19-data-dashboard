import Head from 'next/head';
import { Menu, MenuRenderer } from '~/components/aside/menu';
import { Box } from '~/components/base';
import { ErrorBoundary } from '~/components/error-boundary';
import { AppContent } from '~/components/layout/app-content';
import { VisuallyHidden } from '~/components/visually-hidden';
import { useIntl } from '~/intl';
import { useSidebar } from './logic/use-sidebar';

type InLayoutProps = {
  lastGenerated: string;
  children?: React.ReactNode;
};

export function InLayout(props: InLayoutProps) {
  const { children } = props;

  const { siteText } = useIntl();

  const items = useSidebar({
    layout: 'in',
    map: [['international_metrics', ['positive_tests', 'variants']]],
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
            id="metric-navigation"
            aria-labelledby="sidebar-title"
            role="navigation"
            backgroundColor="white"
            maxWidth={{ _: '38rem', md: undefined }}
            mx="auto"
            pt={4}
          >
            <VisuallyHidden id="sidebar-title" as="h2">
              {siteText.internationaal_layout.headings.sidebar}
            </VisuallyHidden>

            <Menu spacing={4}>
              <MenuRenderer items={items} />
            </Menu>
          </Box>
        }
      >
        <ErrorBoundary>{children}</ErrorBoundary>
      </AppContent>
    </>
  );
}
