import { useRouter } from 'next/router';
import React from 'react';
import { SEOHead } from '~/components/seoHead';
import { SiteFooter } from '~/domain/site/site-footer';
import { SiteHeader } from '~/domain/site/site-header';
import { SkipLinks } from '~/domain/site/skip-links';
import { ILastGeneratedData } from '~/static-props/last-generated-data';

interface LayoutProps {
  url?: string;
  title: string;
  description?: string;
  openGraphImage?: string;
  twitterImage?: string;
}

export type FCWithLayout<Props = void> = React.FC<Props> & {
  getLayout: (page: React.ReactNode, pageProps: Props) => React.ReactNode;
};

export function getLayoutWithMetadata(metadata: LayoutProps) {
  return function (page: React.ReactNode, pageProps: any) {
    const lastGenerated = pageProps.lastGenerated;
    return getLayout(metadata, lastGenerated)(<>{page}</>);
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

export default Layout;

function Layout(
  props: LayoutProps & ILastGeneratedData & { children: React.ReactNode }
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

      <SkipLinks />

      <SiteHeader />

      <div>{children}</div>

      <SiteFooter lastGenerated={lastGenerated} />
    </div>
  );
}
