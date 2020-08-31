import React from 'react';
import Masonry from 'react-masonry-css';

import GraphContainer from 'components/graphContainer';
import GraphContent from 'components/graphContent';
import TitleBlock from 'components/titleBlock';
import Layout from 'components/layout';
import LinkCard from 'components/linkCard';

import LastUpdated from 'components/lastUpdated';

import { IntakeIntensiveCare } from 'components/tiles/IntakeIntensiveCare';
import { NursingHomeInfectedDeaths } from 'components/tiles/NursingHomeInfectedDeaths';
import { NursingHomeInfectedLocations } from 'components/tiles/NursingHomeInfectedLocations';
import { NursingHomeInfectedPeople } from 'components/tiles/NursingHomeInfectedPeople';
import { SewerWater } from 'components/tiles/SewerWater';
import { SuspectedPatients } from 'components/tiles/SuspectedPatients';
import { ReproductionIndex } from 'components/tiles/ReproductionIndex';
import { InfectiousPeople } from 'components/tiles/InfectiousPeople';
import { PostivelyTestedPeople } from 'components/tiles/PostivelyTestedPeople';
import { IntakeHospital } from 'components/tiles/IntakeHospital';

import Notification from 'components/notification';
import MaxWidth from 'components/maxWidth';

import VerpleegHuisZorg from '../assets/verpleeghuiszorg.svg';
import MedischeScreening from '../assets/medische-screening.svg';

import siteText from 'locale';
import GraphHeader from 'components/graphHeader';
import IconList from 'components/iconList';

import openGraphImageNL from 'assets/sharing/og-landelijke-cijfers.png?url';
import twitterImageNL from 'assets/sharing/twitter-landelijke-cijfers.png?url';

import openGraphImageEN from 'assets/sharing/og-national.png?url';
import twitterImageEN from 'assets/sharing/twitter-national.png?url';

import { FunctionComponentWithLayout } from 'components/layout';
import Head from 'next/head';

import useSWR from 'swr';
import getLocale from 'utils/getLocale';

const locale = getLocale();

const openGraphImage = locale === 'nl' ? openGraphImageNL : openGraphImageEN;
const twitterImage = locale === 'nl' ? twitterImageNL : twitterImageEN;

const Home: FunctionComponentWithLayout = () => {
  const { data } = useSWR(`/json/NL.json`);

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    600: 1,
  };

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

      <MaxWidth>
        <LastUpdated
          lastUpdated={
            data?.last_generated ? parseInt(data.last_generated, 10) * 1000 : 0
          }
        />
        <Notification />
      </MaxWidth>

      <div className="home-content">
        <section className="home-section">
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="masonry-grid"
            columnClassName="masonry-grid-column"
          >
            <IntakeIntensiveCare />

            <IntakeHospital />

            <PostivelyTestedPeople />

            <InfectiousPeople />

            <ReproductionIndex />

            <LinkCard
              href="/regio"
              icon={'images/nederland.png'}
              iconAlt="Kaart van Nederland"
            >
              <h3>{siteText.regio_link_block.title}</h3>
              <p>{siteText.regio_link_block.text}</p>
            </LinkCard>
          </Masonry>
        </section>

        <section className="home-section">
          <TitleBlock
            Icon={MedischeScreening}
            title={siteText.blok_andere_gegevens.title}
          >
            <p>{siteText.blok_andere_gegevens.message}</p>
          </TitleBlock>

          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="masonry-grid"
            columnClassName="masonry-grid-column"
          >
            <SuspectedPatients />

            <SewerWater />

            <GraphContainer>
              <GraphContent>
                <GraphHeader title={siteText.overige_gegevens.title} />
                <p>{siteText.overige_gegevens.text}</p>

                <IconList list={siteText.overige_gegevens.list} />
              </GraphContent>
            </GraphContainer>
          </Masonry>
        </section>

        <section className="home-section">
          <TitleBlock
            Icon={VerpleegHuisZorg}
            title={siteText.blok_verpleeghuis_zorg.title}
          >
            <p>{siteText.blok_verpleeghuis_zorg.text}</p>
          </TitleBlock>

          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="masonry-grid"
            columnClassName="masonry-grid-column"
          >
            <NursingHomeInfectedPeople />

            <NursingHomeInfectedLocations />

            <NursingHomeInfectedDeaths />
          </Masonry>
        </section>
      </div>
    </>
  );
};

Home.getLayout = Layout.getLayout({
  ...siteText.nationaal_metadata,
  openGraphImage,
  twitterImage,
});

export default Home;
