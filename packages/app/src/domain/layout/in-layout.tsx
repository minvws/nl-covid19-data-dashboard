import { Test, Varianten } from '@corona-dashboard/icons';
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
import { VisuallyHidden } from '~/components/visually-hidden';
import { useIntl } from '~/intl';
import { useReverseRouter } from '~/utils/use-reverse-router';

type InLayoutProps = {
  lastGenerated: string;
  children?: React.ReactNode;
};

export function InLayout(props: InLayoutProps) {
  const { children } = props;

  const { siteText } = useIntl();
  const router = useRouter();
  const reverseRouter = useReverseRouter();

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
            backgroundColor="white"
            maxWidth={{ _: '38rem', md: undefined }}
            mx="auto"
            pt={4}
          >
            <VisuallyHidden id="sidebar-title" as="h2">
              {siteText.internationaal_layout.headings.sidebar}
            </VisuallyHidden>
            <Menu spacing={4}>
              <CategoryMenu title={siteText.internationaal.titel_sidebar}>
                <MetricMenuItemLink
                  href={reverseRouter.in.positiefGetesteMensen()}
                  title={
                    siteText.internationaal_positief_geteste_personen
                      .titel_sidebar
                  }
                  icon={<Test />}
                />
                <MetricMenuItemLink
                  href={reverseRouter.in.varianten()}
                  title={siteText.internationaal_varianten.titel_sidebar}
                  icon={<Varianten />}
                />
              </CategoryMenu>
            </Menu>
          </Box>
        }
      >
        <ErrorBoundary>{children}</ErrorBoundary>
      </AppContent>
    </>
  );
}
