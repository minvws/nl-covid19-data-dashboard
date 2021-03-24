import { useRouter } from 'next/router';
import React from 'react';
import { SEOHead } from '~/components-styled/seo-head';
import { AppFooter } from '~/components-styled/layout/app-footer';
import { AppHeader } from '~/components-styled/layout/app-header';
import { SkipLinkMenu } from '~/components-styled/skip-link-menu';
import { useIntl } from '~/intl';

interface LayoutProps {
  title: string;
  url?: string;
  description?: string;
  openGraphImage?: string;
  twitterImage?: string;
}

export function Layout(
  props: LayoutProps & { lastGenerated: string; children: React.ReactNode }
) {
  const {
    children,
    title,
    description,
    openGraphImage,
    twitterImage,
    url,
    lastGenerated,
  } = props;

  const router = useRouter();
  const { siteText } = useIntl();

  return (
    <div key={router.asPath}>
      <SEOHead
        title={title}
        description={description}
        openGraphImage={openGraphImage}
        twitterImage={twitterImage}
        url={url}
      />

      <SkipLinkMenu
        ariaLabel={siteText.aria_labels.skip_links}
        links={[
          { href: '#content', label: siteText.skiplinks.inhoud },
          { href: '#main-navigation', label: siteText.skiplinks.nav },
          { href: '#metric-navigation', label: siteText.skiplinks.metric_nav },
          { href: '#footer-navigation', label: siteText.skiplinks.footer_nav },
        ]}
      />

      <AppHeader />

      <div>{children}</div>

      <AppFooter lastGenerated={lastGenerated} />
    </div>
  );
}
