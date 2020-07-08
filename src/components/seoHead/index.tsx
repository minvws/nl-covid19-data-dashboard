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

      <meta key="description" name="description" content={description} />
      <meta key="image" name="image" content={openGraphImage} />

      <meta key="ogLocale" name="og:locale" content="nl_NL" />
      <meta key="ogTitle" property="og:title" content={title} />
      <meta key="ogDesc" property="og:description" content={description} />
      <meta key="ogImage" name="og:image" content={openGraphImage} />
      <meta key="ogUrl" name="og:url" content={url} />
      <meta key="ogType" property="og:type" content="website" />

      <meta key="twTitle" name="twitter:title" content={title} />
      <meta key="twDesc" name="twitter:description" content={description} />
      <meta key="twImg" name="twitter:image" content={twitterImage} />
      <meta key="twCard" name="twitter:card" content="summary_large_image" />
    </Head>
  );
}
