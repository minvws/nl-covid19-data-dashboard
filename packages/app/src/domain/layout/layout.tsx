import { ReactNode } from 'react';
import { Box } from '~/components/base/box';
import { Breadcrumbs } from '~/components/breadcrumbs';
import { BreadcrumbsDataProvider } from '~/components/breadcrumbs/logic/use-breadcrumbs';
import { AppFooter } from '~/components/layout/app-footer';
import { AppHeader } from '~/components/layout/app-header';
import { NotificationBanner } from '~/components/notification-banner';
import { SEOHead } from '~/components/seo-head';
import { SkipLinkMenu } from '~/components/skip-link-menu';
import { useIntl } from '~/intl';
import { CurrentDateProvider } from '~/utils/current-date-context';

interface LayoutProps {
  children: ReactNode;
  lastGenerated: string;
  title: string;
  breadcrumbsData?: Record<string, string>;
  description?: string;
  openGraphImage?: string;
  twitterImage?: string;
  url?: string;
}

export function Layout({ breadcrumbsData, children, title, description, openGraphImage, twitterImage, url, lastGenerated }: LayoutProps) {
  const { commonTexts } = useIntl();

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <SEOHead title={title} description={description} openGraphImage={openGraphImage} twitterImage={twitterImage} url={url} />
      <SkipLinkMenu
        ariaLabel={commonTexts.aria_labels.skip_links}
        links={[
          { href: '#content', label: commonTexts.skiplinks.inhoud },
          { href: '#main-navigation', label: commonTexts.skiplinks.nav },
          {
            href: '#metric-navigation',
            label: commonTexts.skiplinks.metric_nav,
          },
          {
            href: '#footer-navigation',
            label: commonTexts.skiplinks.footer_nav,
          },
        ]}
      />
      <AppHeader />

      {commonTexts.dashboard_wide_notification.title.length !== 0 && (
        <NotificationBanner title={commonTexts.dashboard_wide_notification.title} description={commonTexts.dashboard_wide_notification.description} />
      )}

      {breadcrumbsData && (
        <BreadcrumbsDataProvider value={breadcrumbsData}>
          <Breadcrumbs />
        </BreadcrumbsDataProvider>
      )}

      <CurrentDateProvider dateInSeconds={Number(lastGenerated)}>
        <Box margin="auto 0">{children}</Box>
      </CurrentDateProvider>
      <AppFooter />
    </Box>
  );
}
