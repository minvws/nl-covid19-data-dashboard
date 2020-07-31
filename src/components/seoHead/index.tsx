import Head from 'next/head';

export default SEOHead;

export type SEOHeadProps = {
  title?: string;
  description?: string;
  url?: string;
  openGraphImage?: string;
  twitterImage?: string;
};

SEOHead.defaultProps = {
  description:
    'Informatie over de ontwikkeling van het coronavirus in Nederland.',
  openGraphImage: 'https://coronadashboard.rijksoverheid.nl/banner.jpg',
  title: 'Dashboard Coronavirus COVID-19 | Rijksoverheid.nl',
  twitterImage: 'https://coronadashboard.rijksoverheid.nl/banner.jpg',
  url: 'https://coronadashboard.rijksoverheid.nl',
};

function SEOHead(props: SEOHeadProps): any {
  const { description, openGraphImage, title, twitterImage, url } = props;

  return (
    <Head>
      <title key="title">{title}</title>

      <meta
        key="dc-title"
        property="dcterms:title"
        content={title}
        xml-lang="nl"
      />
      <meta
        key="dc-identifier"
        property="dcterms:identifier"
        content={url}
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
        rel="preload"
        href="webfonts/RO-SansWebText-Regular.woff2"
        as="font"
        type="font/woff2"
      />
      <link
        rel="preload"
        href="webfonts/RO-SansWebText-Regular.woff"
        as="font"
        type="font/woff"
      />

      <link
        rel="preload"
        href="webfonts/RO-SansWebText-Italic.woff2"
        as="font"
        type="font/woff2"
      />
      <link
        rel="preload"
        href="webfonts/RO-SansWebText-Italic.woff"
        as="font"
        type="font/woff"
      />

      <link
        rel="preload"
        href="webfonts/RO-SansWebText-Bold.woff2"
        as="font"
        type="font/woff2"
      />
      <link
        rel="preload"
        href="webfonts/RO-SansWebText-Bold.woff"
        as="font"
        type="font/woff"
      />

      <meta key="description" name="description" content={description} />
      <meta key="image" name="image" content={openGraphImage} />

      <meta key="ogLocale" name="og:locale" content="nl_NL" />
      <meta key="ogTitle" property="og:title" content={title} />
      <meta key="ogDesc" property="og:description" content={description} />
      <meta
        key="ogImage"
        name="og:image"
        content={`https://coronadashboard.rijksoverheid.nl${openGraphImage}`}
      />
      <meta key="ogUrl" name="og:url" content={url} />
      <meta key="ogType" property="og:type" content="website" />

      <meta key="twTitle" name="twitter:title" content={title} />
      <meta key="twDesc" name="twitter:description" content={description} />
      <meta key="twImg" name="twitter:image" content={twitterImage} />
      <meta key="twCard" name="twitter:card" content="summary_large_image" />
    </Head>
  );
}
