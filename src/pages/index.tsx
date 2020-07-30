import React from 'react';
import Masonry from 'react-masonry-css';

import GraphContainer from 'components/graphContainer';
import GraphContent from 'components/graphContent';
import TitleBlock from 'components/titleBlock';
import Layout from 'components/layout';
import LinkCard from 'components/linkCard';
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

import VerpleegHuisZorg from '../assets/verpleeghuiszorg.svg';
import MedischeScreening from '../assets/medische-screening.svg';

import { store } from 'store';
import siteText from 'locale';
import GraphHeader from 'components/graphHeader';
import IconList from 'components/iconList';

import openGraphImage from 'assets/sharing/og-landelijke-cijfers.png?url';
import twitterImage from 'assets/sharing/twitter-landelijke-cijfers.png?url';

import { FunctionComponentWithLayout } from 'components/layout';
import Head from 'next/head';

const Home: FunctionComponentWithLayout = () => {
  const globalState = React.useContext(store);
  const { state, dispatch } = globalState;

  React.useEffect(() => {
    async function fetchData() {
      if (!state['NL']) {
        dispatch({ type: 'INIT_LOAD', payload: { id: 'NL' } });
        const response = await fetch(
          `${process.env.REACT_APP_DATA_SRC}NL.json`
        );
        const result = await response.json();
        dispatch({ type: 'LOAD_SUCCESS', payload: result });
      }
    }
    fetchData();
  }, [dispatch, state]);

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    600: 1,
  };

  return (
    <>
      <Head>
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
              <h3>{siteText.regio_link_block.title.translation}</h3>
              <p>{siteText.regio_link_block.text.translation}</p>
            </LinkCard>
          </Masonry>
        </section>

        <section className="home-section">
          <TitleBlock Icon={MedischeScreening} title="Andere gegevens">
            <p>
              Cijfers die iets kunnen zeggen over de verspreiding van het virus.
            </p>
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
                <GraphHeader
                  title={siteText.overige_gegevens.title.translation}
                />
                <p>{siteText.overige_gegevens.text.translation}</p>

                <IconList list={siteText.overige_gegevens.list} />
              </GraphContent>
            </GraphContainer>
          </Masonry>
        </section>

        <section className="home-section">
          <TitleBlock
            Icon={VerpleegHuisZorg}
            title={siteText.blok_verpleeghuis_zorg.title.translation}
          >
            <p>{siteText.blok_verpleeghuis_zorg.text.translation}</p>
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
