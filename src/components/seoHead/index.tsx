import Head from 'next/head';
import { useContext } from 'react';
import LocaleContext, { ILocale } from '~/locale/localeContext';

export type SEOHeadProps = {
  title?: string;
  description?: string;
  url?: string;
  openGraphImage?: string;
  twitterImage?: string;
};

export function SEOHead(props: SEOHeadProps): any {
  const { description, openGraphImage, title, twitterImage, url } = props;
  const { siteText }: ILocale = useContext(LocaleContext);

  const data = {
    description: description || siteText.seoHead.default_description,
    openGraphImage: openGraphImage || '/banner.png',
    title: title || siteText.seoHead.default_title,
    twitterImage: twitterImage || '/banner-twitter.png',
    url: url || siteText.seoHead.default_url,
  };

  return (
    <Head>
      <title key="title">{data.title}</title>
      <meta name="version" key="version" content={process.env.COMMIT_ID} />

      <meta
        key="dc-title"
        property="dcterms:title"
        content={data.title}
        xml-lang="nl"
      />
      <meta
        key="dc-identifier"
        property="dcterms:identifier"
        content={data.url}
        datatype="xsd:anyURI"
      />
      <meta
        key="dc-lang"
        property="dcterms:language"
        content="nl-NL"
        datatype="xsd:language"
      />
      <meta
        key="dc-authority"
        property="overheid:authority"
        datatype="overheid:Ministerie"
        content="Ministerie van Volksgezondheid, Welzijn en Sport"
      />
      <link
        key="dc-authority-title"
        rel="overheid:authority"
        href="http://standaarden.overheid.nl/owms/terms/Ministerie_van_Volksgezondheid,_Welzijn_en_Sport"
        title="Ministerie van Volksgezondheid, Welzijn en Sport"
      />
      <meta
        key="dc-creator"
        property="dcterms:creator"
        datatype="overheid:Ministerie"
        content="Ministerie van Volksgezondheid, Welzijn en Sport"
      />
      <link
        key="dc-creator-title"
        rel="dcterms:creator"
        href="http://standaarden.overheid.nl/owms/terms/Ministerie_van_Volksgezondheid,_Welzijn_en_Sport"
        title="Ministerie van Volksgezondheid, Welzijn en Sport"
      />
      <link
        key="dc-type"
        rel="dcterms:type"
        href="https://standaarden.overheid.nl/owms/terms/statistieken"
      />
      <link
        key="dc-type-title"
        rel="dcterms:type"
        href="https://standaarden.overheid.nl/owms/terms/statistieken"
        title="statistieken"
      />

      <link
        rel="preload"
        crossOrigin="anonymous"
        href="/webfonts/RO-SansWebText-Regular.woff2"
        as="font"
        type="font/woff2"
      />
      <link
        rel="preload"
        crossOrigin="anonymous"
        href="/webfonts/RO-SansWebText-Regular.woff"
        as="font"
        type="font/woff"
      />

      <link
        rel="preload"
        crossOrigin="anonymous"
        href="/webfonts/RO-SansWebText-Italic.woff2"
        as="font"
        type="font/woff2"
      />
      <link
        rel="preload"
        crossOrigin="anonymous"
        href="/webfonts/RO-SansWebText-Italic.woff"
        as="font"
        type="font/woff"
      />

      <link
        rel="preload"
        crossOrigin="anonymous"
        href="/webfonts/RO-SansWebText-Bold.woff2"
        as="font"
        type="font/woff2"
      />
      <link
        rel="preload"
        crossOrigin="anonymous"
        href="/webfonts/RO-SansWebText-Bold.woff"
        as="font"
        type="font/woff"
      />

      <link
        rel="preload"
        href="/json/RANGES.json"
        as="fetch"
        crossOrigin="anonymous"
      />

      <meta key="description" name="description" content={data.description} />
      <meta
        key="image"
        name="image"
        content={`https://coronadashboard.rijksoverheid.nl${data.openGraphImage}`}
      />

      <meta key="ogLocale" name="og:locale" content="nl_NL" />
      <meta key="ogTitle" property="og:title" content={data.title} />
      <meta key="ogDesc" property="og:description" content={data.description} />
      <meta
        key="ogImage"
        name="og:image:url"
        content={`https://coronadashboard.rijksoverheid.nl${data.openGraphImage}`}
      />
      <meta
        key="ogImageSecureUrl"
        name="og:image:secure_url"
        content={`https://coronadashboard.rijksoverheid.nl${data.openGraphImage}`}
      />
      <meta key="ogUrl" name="og:url" content={data.url} />
      <meta key="ogType" property="og:type" content="website" />

      <meta key="twTitle" name="twitter:title" content={data.title} />
      <meta
        key="twDesc"
        name="twitter:description"
        content={data.description}
      />
      <meta
        key="twImg"
        name="twitter:image"
        content={`https://coronadashboard.rijksoverheid.nl${data.twitterImage}`}
      />
      <meta key="twCard" name="twitter:card" content="summary_large_image" />
    </Head>
  );
}
