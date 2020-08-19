import Head from 'next/head';

import { FCWithLayout } from 'components/layout';
import { getNationalLayout } from 'components/layout/NationalLayout';

const National: FCWithLayout = () => {
  return (
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
  );
};

National.getLayout = getNationalLayout();

export default National;
