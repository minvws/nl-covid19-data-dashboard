import * as React from 'react';
import Masonry from 'react-masonry-css';

import GraphContainer from 'components/graphContainer';
import GraphContent from 'components/graphContent';
import LastUpdated from 'components/lastUpdated';
import TitleBlock from 'components/titleBlock';
import Layout from 'components/layout';
import LinkCard from 'components/linkCard';
import {
  IntakeIntensiveCare,
  IntakeHospital,
  PostivelyTestedPeople,
  InfectiousPeople,
  ReproductionIndex,
  SuspectedPatients,
  SewerWater,
  NursingHomeInfectedDeaths,
  NursingHomeInfectedLocations,
  NursingHomeInfectedPeople,
} from 'components/tiles';

import VerpleegHuisZorg from '../assets/verpleeghuiszorg.svg';
import MedischeScreening from '../assets/medische-screening.svg';

import { store } from 'store';
import siteText from 'data/textNationaal.json';
import GraphHeader from 'components/graphHeader';
import IconList from 'components/iconList';

import openGraphImage from 'assets/sharing/og-landelijke-cijfers.png?url';
import twitterImage from 'assets/sharing/twitter-landelijke-cijfers.png?url';

export type HomeLayoutProps = {
  getLayout: (string) => string;
};

import { FunctionComponentWithLayout } from 'components/layout';
import Head from 'next/head';

const Home: FunctionComponentWithLayout<HomeLayoutProps> = () => {
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

  const shouldShowDataComponents = Boolean(state.NL);

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
        {shouldShowDataComponents && (
          <LastUpdated lastUpdated={state.NL?.last_generated * 1000} />
        )}

        <section className="home-section">
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="masonry-grid"
            columnClassName="masonry-grid-column"
          >
            <IntakeIntensiveCare
              text={siteText.ic_opnames_per_dag}
              data={state?.NL?.intake_intensivecare_ma}
            />

            <IntakeHospital
              text={siteText.ziekenhuisopnames_per_dag}
              data={state?.NL?.intake_hospital_ma}
            />

            <PostivelyTestedPeople
              text={siteText.positief_geteste_personen}
              delta={state?.NL?.infected_people_delta_normalized}
              age={state?.NL?.intake_share_age_groups}
              total={state?.NL?.infected_people_total}
            />

            <InfectiousPeople
              text={siteText.besmettelijke_personen}
              count={state?.NL?.infectious_people_count}
              countNormalized={state?.NL?.infectious_people_count_normalized}
            />

            <ReproductionIndex
              text={siteText.reproductiegetal}
              data={state?.NL?.reproduction_index}
            />

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
            <SuspectedPatients
              text={siteText.verdenkingen_huisartsen}
              data={state?.NL?.verdenkingen_huisartsen}
            />

            <SewerWater
              text={siteText.rioolwater_metingen}
              data={state?.NL?.rioolwater_metingen}
            />

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
            <NursingHomeInfectedPeople
              text={siteText.verpleeghuis_positief_geteste_personen}
              data={state?.NL?.infected_people_nursery_count_daily}
            />

            <NursingHomeInfectedLocations
              text={siteText.verpleeghuis_besmette_locaties}
              newLocations={state?.NL?.total_newly_reported_locations}
              totalLocations={state?.NL?.total_reported_locations}
            />

            <NursingHomeInfectedDeaths
              text={siteText.verpleeghuis_oversterfte}
              data={state?.NL?.deceased_people_nursery_count_daily}
            />
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
