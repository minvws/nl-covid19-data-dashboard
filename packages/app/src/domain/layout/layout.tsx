import text from '~/locale/index';
import { useRouter } from 'next/router';
import React from 'react';
import { SEOHead } from '~/components-styled/seo-head';
import { AppFooter } from '~/components-styled/layout/app-footer';
import { AppHeader } from '~/components-styled/layout/app-header';
import { SkipLinkMenu } from '~/components-styled/skip-link-menu';
import siteText from '~/locale/index';

interface LayoutProps {
  title: string;
  url?: string;
  description?: string;
  openGraphImage?: string;
  twitterImage?: string;
}

type StaticProps<T extends (...args: any) => any> = Await<
  ReturnType<T>
>['props'];

export type FCWithLayout<
  PropsOrGetStaticProps = void,
  Props = PropsOrGetStaticProps extends (
    ...args: any[]
  ) => Promise<{ props: any }>
    ? StaticProps<PropsOrGetStaticProps>
    : PropsOrGetStaticProps
> = React.FC<Props> & {
  getLayout: (page: React.ReactNode, pageProps: Props) => React.ReactNode;
};

export function getLayoutWithMetadata(metadata: LayoutProps) {
  return function (page: React.ReactNode, pageProps: any) {
    const lastGenerated = pageProps.lastGenerated;
    return getLayout(metadata, lastGenerated)(<>{page}</>);
  };
}

export function getDefaultLayout() {
  return function <T extends { lastGenerated: string }>(
    page: React.ReactNode,
    pageProps: T
  ) {
    const lastGenerated = pageProps.lastGenerated;
    return getLayout(siteText.metadata, lastGenerated)(<>{page}</>);
  };
}

export function getLayout(layoutProps: LayoutProps, lastGenerated: string) {
  return function (page: React.ReactNode): React.ReactNode {
    return (
      <Layout {...layoutProps} lastGenerated={lastGenerated}>
        {page}
      </Layout>
    );
  };
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
        ariaLabel={text.aria_labels.skip_links}
        links={[
          { href: '#content', label: text.skiplinks.inhoud },
          { href: '#main-navigation', label: text.skiplinks.nav },
          { href: '#metric-navigation', label: text.skiplinks.metric_nav },
          { href: '#footer-navigation', label: text.skiplinks.footer_nav },
        ]}
      />

      <AppHeader />

      <div>{children}</div>

      <AppFooter lastGenerated={lastGenerated} />
    </div>
  );
}
