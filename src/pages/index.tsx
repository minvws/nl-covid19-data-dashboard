import React from 'react';
import Head from 'next/head';

import { getLayout, FCWithLayout } from 'components/layout';

import siteText from 'locale';

import openGraphImageNL from 'assets/sharing/og-landelijke-cijfers.png?url';
import twitterImageNL from 'assets/sharing/twitter-landelijke-cijfers.png?url';

import openGraphImageEN from 'assets/sharing/og-national.png?url';
import twitterImageEN from 'assets/sharing/twitter-national.png?url';

import getLocale from 'utils/getLocale';

const locale = getLocale();
const openGraphImage = locale === 'nl' ? openGraphImageNL : openGraphImageEN;
const twitterImage = locale === 'nl' ? twitterImageNL : twitterImageEN;

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
