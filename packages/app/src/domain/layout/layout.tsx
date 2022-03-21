import React from 'react';
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
  title: string;
  url?: string;
  description?: string;
  openGraphImage?: string;
  twitterImage?: string;
  breadcrumbsData?: Record<string, string>;
}

export function Layout(
  props: LayoutProps & { lastGenerated: string; children: React.ReactNode }
) {
  const {
    breadcrumbsData,
    children,
    title,
    description,
    openGraphImage,
    twitterImage,
    url,
    lastGenerated,
  } = props;

  const { commonTexts } = useIntl();

  return (
    <div>
      <SEOHead
        title={title}
        description={description}
        openGraphImage={openGraphImage}
        twitterImage={twitterImage}
        url={url}
      />
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
        <NotificationBanner
          title={commonTexts.dashboard_wide_notification.title}
          description={commonTexts.dashboard_wide_notification.description}
        />
      )}

      <BreadcrumbsDataProvider value={breadcrumbsData}>
        <Breadcrumbs />
      </BreadcrumbsDataProvider>

      <CurrentDateProvider dateInSeconds={Number(lastGenerated)}>
        <div>{children}</div>
      </CurrentDateProvider>
      <AppFooter />
    </div>
  );
}
