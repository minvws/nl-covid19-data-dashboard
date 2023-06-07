import Head from 'next/head';
import { Menu, MenuRenderer } from '~/components/aside/menu';
import { Box } from '~/components/base';
import { ErrorBoundary } from '~/components/error-boundary';
import DynamicIcon, { IconName } from '~/components/get-icon-by-name';
import { AppContent } from '~/components/layout/app-content';
import { Heading } from '~/components/typography';
import { VisuallyHidden } from '~/components/visually-hidden';
import { DataExplainedGroups } from '~/queries/data-explanation/query-types';
import { space } from '~/style/theme';
import { getFilenameToIconName } from '~/utils/get-filename-to-icon-name';
import { ExpandedSidebarMap } from './logic/types';

interface DataExplainedLayoutProps {
  children?: React.ReactNode;
  groups: DataExplainedGroups;
  title: string;
}

export const DataExplainedLayout = ({ children, groups, title }: DataExplainedLayoutProps) => {
  const items = Object.entries(groups).map(([name, items]) => ({
    key: name,
    title: name,
    icon: <DynamicIcon name={getFilenameToIconName(items[0].groupIcon) as IconName} />,
    items: items.map((item) => ({
      key: item.title,
      title: item.title,
      href: `/verantwoording/${item.slug}`,
    })),
  }));

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
              {title}
            </VisuallyHidden>

            <Box paddingX={space[3]}>
              <Heading level={2} variant={'h3'}>
                {title}
              </Heading>
            </Box>

            <Box paddingBottom={space[3]}>
              <Menu spacing={2}>
                <MenuRenderer items={items as ExpandedSidebarMap<'custom'>} />
              </Menu>
            </Box>
          </Box>
        }
      >
        <ErrorBoundary>{children}</ErrorBoundary>
      </AppContent>
    </>
  );
};
