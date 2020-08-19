import React from 'react';
import Head from 'next/head';

import { getLayout, FCWithLayout } from 'components/layout';

import siteText from 'locale';

import openGraphImage from 'assets/sharing/og-landelijke-cijfers.png?url';
import twitterImage from 'assets/sharing/twitter-landelijke-cijfers.png?url';

const Home: FCWithLayout = () => {
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
    </>
  );
};

Home.getLayout = getLayout({
  ...siteText.nationaal_metadata,
  openGraphImage,
  twitterImage,
});

export default Home;
