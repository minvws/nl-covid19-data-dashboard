import * as React from 'react';
import Masonry from 'react-masonry-css';
import dynamic from 'next/dynamic';

import GraphContainer from 'components/graphContainer';
import GraphContent from 'components/graphContent';
import BarScale from 'components/barScale';
import Collapse from 'components/collapse';

import LastUpdated from 'components/lastUpdated';
import TitleBlock from 'components/titleBlock';
import Layout from 'components/layout';
import LinkCard from 'components/linkCard';
import Metadata from 'components/metadata';

import Arts from '../assets/arts.svg';
import Ziekenhuis from '../assets/ziekenhuis.svg';
import Ziektegolf from '../assets/ziektegolf.svg';
import Getest from '../assets/test.svg';
import Repro from '../assets/reproductiegetal.svg';
import VerpleegHuisZorg from '../assets/verpleeghuiszorg.svg';
import CoronaVirus from '../assets/coronavirus.svg';
import Locatie from '../assets/locaties.svg';
import MedischeScreening from '../assets/medische-screening.svg';
import RioolwaterMonitoring from '../assets/rioolwater-monitoring.svg';

import { store } from 'store';
import siteText from 'data/textNationaal.json';
import GraphHeader from 'components/graphHeader';
import formatDecimal from 'utils/formatDec';
import IconList from 'components/iconList';

import openGraphImage from 'assets/sharing/og-landelijke-cijfers.png?url';
import twitterImage from 'assets/sharing/twitter-landelijke-cijfers.png?url';

const AreaChart = dynamic(() => import('components/areaChart'));
const BarChart = dynamic(() => import('components/barChart'));
const LineChart = dynamic(() => import('components/lineChart'));

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
      if (!state['nl']) {
        dispatch({ type: 'INIT_LOAD', payload: { id: 'nl' } });
        const response = await fetch(
          `${process.env.REACT_APP_DATA_SRC}NL.json`
        );
        const result = await response.json();
        dispatch({ type: 'LOAD_SUCCESS', payload: result });
      }
    }
    fetchData();
  }, [dispatch, state]);

  const shouldShowDataComponents = Boolean(state.nl);

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
          <LastUpdated lastUpdated={state.nl?.last_generated * 1000} />
        )}

        <section className="home-section">
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="masonry-grid"
            columnClassName="masonry-grid-column"
          >
            <GraphContainer>
              <GraphContent>
                <GraphHeader
                  Icon={Arts}
                  title={siteText.ic_opnames_per_dag.title}
                />
                <p>{siteText.ic_opnames_per_dag.text}</p>

                {state.nl?.intake_intensivecare_ma && (
                  <BarScale
                    min={siteText.ic_opnames_per_dag.bar.min}
                    max={siteText.ic_opnames_per_dag.bar.max}
                    gradient={siteText.ic_opnames_per_dag.bar.gradient}
                    screenReaderText={
                      siteText.ic_opnames_per_dag.bar
                        .screen_reader_graph_content
                    }
                    kritiekeWaarde={siteText.ic_opnames_per_dag.signaalwaarde}
                    value={
                      state.nl?.intake_intensivecare_ma.last_value
                        .moving_average_ic
                    }
                    id="ic"
                  />
                )}
              </GraphContent>
              <Collapse
                openText={siteText.ic_opnames_per_dag.open}
                sluitText={siteText.ic_opnames_per_dag.sluit}
              >
                <h4>{siteText.ic_opnames_per_dag.fold_title}</h4>
                <p>{siteText.ic_opnames_per_dag.fold}</p>
                <h4>{siteText.ic_opnames_per_dag.graph_title}</h4>
                {state.nl?.intake_intensivecare_ma?.values && (
                  <LineChart
                    values={state.nl?.intake_intensivecare_ma.values.map(
                      (value) => ({
                        value: value.moving_average_ic,
                        date: value.date_of_report_unix,
                      })
                    )}
                    signaalwaarde={siteText.ic_opnames_per_dag.signaalwaarde}
                  />
                )}

                <Metadata
                  period={state.nl?.intake_intensivecare_ma?.values.map(
                    (value) => value.date_of_report_unix
                  )}
                  dataSource={siteText.ic_opnames_per_dag.bron}
                  lastUpdated={
                    state.nl?.intake_intensivecare_ma?.last_value
                      .date_of_report_unix * 1000
                  }
                />
              </Collapse>
            </GraphContainer>

            <GraphContainer>
              <GraphContent>
                <GraphHeader
                  Icon={Ziekenhuis}
                  title={siteText.ziekenhuisopnames_per_dag.title}
                />

                <p>{siteText.ziekenhuisopnames_per_dag.text}</p>

                {state.nl?.intake_hospital_ma && (
                  <BarScale
                    min={siteText.ziekenhuisopnames_per_dag.bar.min}
                    max={siteText.ziekenhuisopnames_per_dag.bar.max}
                    kritiekeWaarde={
                      siteText.ziekenhuisopnames_per_dag.signaalwaarde
                    }
                    screenReaderText={
                      siteText.ziekenhuisopnames_per_dag.bar
                        .screen_reader_graph_content
                    }
                    value={
                      state.nl?.intake_hospital_ma.last_value
                        .moving_average_hospital
                    }
                    id="opnames"
                    gradient={siteText.ziekenhuisopnames_per_dag.bar.gradient}
                  />
                )}
              </GraphContent>
              <Collapse
                openText={siteText.ziekenhuisopnames_per_dag.open}
                sluitText={siteText.ziekenhuisopnames_per_dag.sluit}
              >
                <h4>{siteText.ziekenhuisopnames_per_dag.fold_title}</h4>
                <p>{siteText.ziekenhuisopnames_per_dag.fold}</p>

                <h4>{siteText.ziekenhuisopnames_per_dag.graph_title}</h4>
                {state.nl?.intake_hospital_ma?.values && (
                  <LineChart
                    values={state.nl?.intake_hospital_ma.values.map(
                      (value) => ({
                        value: value.moving_average_hospital,
                        date: value.date_of_report_unix,
                      })
                    )}
                    signaalwaarde={
                      siteText.ziekenhuisopnames_per_dag.signaalwaarde
                    }
                  />
                )}

                <Metadata
                  period={state.nl?.intake_hospital_ma?.values.map(
                    (value) => value.date_of_report_unix
                  )}
                  dataSource={siteText.ziekenhuisopnames_per_dag.bron}
                  lastUpdated={
                    state.nl?.intake_hospital_ma?.last_value
                      .date_of_report_unix * 1000
                  }
                />
              </Collapse>
            </GraphContainer>

            <GraphContainer>
              <GraphContent>
                <GraphHeader
                  Icon={Getest}
                  title={siteText.positief_geteste_personen.title}
                />
                <p>{siteText.positief_geteste_personen.text}</p>
                {state.nl?.infected_people_delta_normalized && (
                  <BarScale
                    min={siteText.positief_geteste_personen.bar.min}
                    max={siteText.positief_geteste_personen.bar.max}
                    screenReaderText={
                      siteText.positief_geteste_personen.bar
                        .screen_reader_graph_content
                    }
                    value={
                      state.nl?.infected_people_delta_normalized.last_value
                        .infected_daily_increase
                    }
                    id="positief"
                    gradient={siteText.positief_geteste_personen.bar.gradient}
                  />
                )}

                {state.nl?.infected_people_total?.last_value && (
                  <h3>
                    {siteText.positief_geteste_personen.metric_title}{' '}
                    <span style={{ color: '#01689b' }}>
                      {formatDecimal(
                        state.nl?.infected_people_total.last_value
                          .infected_daily_total
                      )}
                    </span>
                  </h3>
                )}
              </GraphContent>
              <Collapse
                openText={siteText.positief_geteste_personen.open}
                sluitText={siteText.positief_geteste_personen.sluit}
              >
                <h4>{siteText.positief_geteste_personen.fold_title}</h4>
                <p>{siteText.positief_geteste_personen.fold}</p>

                <h4>{siteText.positief_geteste_personen.linechart_title}</h4>
                {state.nl?.infected_people_delta_normalized?.values && (
                  <LineChart
                    values={state.nl?.infected_people_delta_normalized?.values.map(
                      (value) => ({
                        value: value.infected_daily_increase,
                        date: value.date_of_report_unix,
                      })
                    )}
                  />
                )}

                <h4>{siteText.positief_geteste_personen.graph_title}</h4>
                {state.nl?.intake_share_age_groups && (
                  <BarChart
                    keys={[
                      '0 tot 20',
                      '20 tot 40',
                      '40 tot 60',
                      '60 tot 80',
                      '80+',
                    ]}
                    data={state.nl?.intake_share_age_groups.values.map(
                      (value) => value.infected_per_agegroup_increase
                    )}
                  />
                )}

                <Metadata
                  dataSource={siteText.positief_geteste_personen.bron}
                  lastUpdated={
                    state.nl?.intake_share_age_groups?.last_value
                      .date_of_report_unix * 1000
                  }
                />
              </Collapse>
            </GraphContainer>

            <GraphContainer>
              <GraphContent>
                <GraphHeader
                  Icon={Ziektegolf}
                  title={siteText.besmettelijke_personen.title}
                />
                <p>{siteText.besmettelijke_personen.text}</p>
                {state.nl?.infectious_people_count_normalized && (
                  <BarScale
                    min={siteText.besmettelijke_personen.bar.min}
                    max={siteText.besmettelijke_personen.bar.max}
                    screenReaderText={
                      siteText.besmettelijke_personen.bar
                        .screen_reader_graph_content
                    }
                    value={
                      state.nl?.infectious_people_count_normalized.last_value
                        .infectious_avg_normalized
                    }
                    id="besmettelijk"
                    gradient={siteText.besmettelijke_personen.bar.gradient}
                  />
                )}

                <p className={'regioDataLoading'}>
                  Signaalwaarde volgt in{' '}
                  <time dateTime={'2020-07'}>juli 2020</time>.
                </p>

                {state.nl?.infectious_people_count?.last_value && (
                  <h3>
                    {siteText.besmettelijke_personen.metric_title}{' '}
                    <span style={{ color: '#01689b' }}>
                      {formatDecimal(
                        state.nl?.infectious_people_count.last_value
                          .infectious_avg
                      )}
                    </span>
                  </h3>
                )}
              </GraphContent>
              <Collapse
                openText={siteText.besmettelijke_personen.open}
                sluitText={siteText.besmettelijke_personen.sluit}
              >
                <h4>{siteText.besmettelijke_personen.fold_title}</h4>
                <p>{siteText.besmettelijke_personen.fold}</p>

                <Metadata
                  dataSource={siteText.besmettelijke_personen.bron}
                  lastUpdated={
                    state.nl?.infectious_people_count?.last_value
                      .date_of_report_unix * 1000
                  }
                />
              </Collapse>
            </GraphContainer>

            <GraphContainer>
              <GraphContent>
                <GraphHeader
                  Icon={Repro}
                  title={siteText.reproductiegetal.title}
                />
                <p>{siteText.reproductiegetal.text}</p>
                {state.nl?.reproduction_index && (
                  <BarScale
                    min={siteText.reproductiegetal.bar.min}
                    max={siteText.reproductiegetal.bar.max}
                    screenReaderText={
                      siteText.reproductiegetal.screen_reader_graph_content
                    }
                    kritiekeWaarde={siteText.reproductiegetal.signaalwaarde}
                    value={
                      state.nl?.reproduction_index.last_value
                        .reproduction_index_avg
                    }
                    id="repro"
                    gradient={siteText.reproductiegetal.gradient}
                  />
                )}
              </GraphContent>
              <Collapse
                openText={siteText.reproductiegetal.open}
                sluitText={siteText.reproductiegetal.sluit}
              >
                <h4>{siteText.reproductiegetal.fold_title}</h4>
                <p>{siteText.reproductiegetal.fold}</p>

                <img
                  width={315}
                  height={100}
                  loading="lazy"
                  src="/images/reproductie-explainer.svg"
                  alt="Ondersteunende afbeelding bij bovenstaande uitleg"
                />

                <h4>{siteText.reproductiegetal.graph_title}</h4>
                {state.nl?.reproduction_index?.values && (
                  <AreaChart
                    data={state.nl?.reproduction_index.values.map((value) => ({
                      avg: value.reproduction_index_avg,
                      min: value.reproduction_index_low,
                      max: value.reproduction_index_high,
                      date: value.date_of_report_unix,
                    }))}
                    minY={siteText.reproductiegetal.graph.min}
                    maxY={siteText.reproductiegetal.graph.max}
                    signaalwaarde={1}
                    rangeLegendLabel={
                      siteText.reproductiegetal.rangeLegendLabel
                    }
                    lineLegendLabel={siteText.reproductiegetal.lineLegendLabel}
                  />
                )}

                <p>
                  Bij lage aantallen ziekenhuisopnames wordt de onzekerheid van
                  het reproductiegetal groter en kan deze meer schommelen. Als
                  de schatting boven de waarde 1 komt, moet eerst naar de
                  bandbreedte worden gekeken voordat er conclusies kunnen worden
                  getrokken.
                </p>

                <Metadata
                  period={state.nl?.reproduction_index?.values.map(
                    (value) => value.date_of_report_unix
                  )}
                  dataSource={siteText.reproductiegetal.bron}
                />
              </Collapse>
            </GraphContainer>

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
            <GraphContainer>
              <GraphContent>
                <GraphHeader
                  Icon={Arts}
                  title={siteText.verdenkingen_huisartsen.title}
                />

                <p>{siteText.verdenkingen_huisartsen.text}</p>

                {state.nl?.verdenkingen_huisartsen && (
                  <BarScale
                    min={siteText.verdenkingen_huisartsen.bar.min}
                    max={siteText.verdenkingen_huisartsen.bar.max}
                    screenReaderText={
                      siteText.verdenkingen_huisartsen.bar
                        .screen_reader_graph_content
                    }
                    value={
                      state.nl?.verdenkingen_huisartsen.last_value.incidentie
                    }
                    id="verdenkingen_huisartsen"
                    gradient={siteText.verdenkingen_huisartsen.bar.gradient}
                  />
                )}
              </GraphContent>
              <Collapse
                openText={siteText.verdenkingen_huisartsen.open}
                sluitText={siteText.verdenkingen_huisartsen.sluit}
              >
                <h4>{siteText.verdenkingen_huisartsen.fold_title}</h4>
                <p>{siteText.verdenkingen_huisartsen.fold}</p>

                <h4>{siteText.verdenkingen_huisartsen.graph_title}</h4>
                {state.nl?.verdenkingen_huisartsen?.values && (
                  <LineChart
                    values={state.nl?.verdenkingen_huisartsen.values.map(
                      (value) => ({
                        value: value.incidentie,
                        date: value.week,
                      })
                    )}
                  />
                )}

                <Metadata
                  period={state.nl?.verdenkingen_huisartsen?.values.map(
                    (value) => value.week
                  )}
                  dataSource={siteText.verdenkingen_huisartsen.bron}
                  lastUpdated={
                    state.nl?.verdenkingen_huisartsen?.last_value.incidentie *
                    1000
                  }
                />
              </Collapse>
            </GraphContainer>

            <GraphContainer>
              <GraphContent>
                <GraphHeader
                  Icon={RioolwaterMonitoring}
                  title={siteText.rioolwater_metingen.title}
                />

                <p>{siteText.rioolwater_metingen.text}</p>

                {state.nl?.rioolwater_metingen && (
                  <BarScale
                    min={siteText.rioolwater_metingen.bar.min}
                    max={siteText.rioolwater_metingen.bar.max}
                    screenReaderText={
                      siteText.rioolwater_metingen.bar
                        .screen_reader_graph_content
                    }
                    value={state.nl?.rioolwater_metingen.last_value.average}
                    id="rioolwater_metingen"
                    gradient={siteText.rioolwater_metingen.bar.gradient}
                  />
                )}
              </GraphContent>
              <Collapse
                openText={siteText.rioolwater_metingen.open}
                sluitText={siteText.rioolwater_metingen.sluit}
              >
                <h4>{siteText.rioolwater_metingen.fold_title}</h4>
                <p>{siteText.rioolwater_metingen.fold}</p>

                <h4>{siteText.rioolwater_metingen.graph_title}</h4>
                {state.nl?.rioolwater_metingen?.values && (
                  <LineChart
                    values={state.nl?.rioolwater_metingen.values.map(
                      (value) => ({
                        value: Number(value.average),
                        date: value.week,
                      })
                    )}
                  />
                )}

                <Metadata
                  period={state.nl?.rioolwater_metingen?.values.map(
                    (value) => value.week
                  )}
                  dataSource={siteText.rioolwater_metingen.bron}
                  lastUpdated={
                    state.nl?.rioolwater_metingen?.last_value.week * 1000
                  }
                />
              </Collapse>
            </GraphContainer>

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
            <GraphContainer>
              <GraphContent>
                <GraphHeader
                  Icon={Getest}
                  title={siteText.verpleeghuis_positief_geteste_personen.title}
                />
                <p>{siteText.verpleeghuis_positief_geteste_personen.text}</p>
                {state.nl?.infected_people_nursery_count_daily && (
                  <BarScale
                    min={
                      siteText.verpleeghuis_positief_geteste_personen.bar.min
                    }
                    max={
                      siteText.verpleeghuis_positief_geteste_personen.bar.max
                    }
                    screenReaderText={
                      siteText.verpleeghuis_positief_geteste_personen.bar
                        .screen_reader_graph_content
                    }
                    value={
                      state.nl?.infected_people_nursery_count_daily.last_value
                        .infected_nursery_daily
                    }
                    id="positief_verpleeghuis"
                    gradient={
                      siteText.verpleeghuis_positief_geteste_personen.bar
                        .gradient
                    }
                  />
                )}
              </GraphContent>
              <Collapse
                openText={siteText.verpleeghuis_positief_geteste_personen.open}
                sluitText={
                  siteText.verpleeghuis_positief_geteste_personen.sluit
                }
              >
                <h4>
                  {siteText.verpleeghuis_positief_geteste_personen.fold_title}
                </h4>
                <p>{siteText.verpleeghuis_positief_geteste_personen.fold}</p>
                <h4>
                  {siteText.verpleeghuis_positief_geteste_personen.graph_title}
                </h4>
                {state.nl?.infected_people_nursery_count_daily?.values && (
                  <LineChart
                    values={state.nl?.infected_people_nursery_count_daily?.values.map(
                      (value) => ({
                        value: value.infected_nursery_daily,
                        date: value.date_of_report_unix,
                      })
                    )}
                  />
                )}
                <Metadata
                  period={state.nl?.infected_people_nursery_count_daily?.values.map(
                    (value) => value.date_of_report_unix
                  )}
                  dataSource={
                    siteText.verpleeghuis_positief_geteste_personen.bron
                  }
                  lastUpdated={
                    state.nl?.infected_people_nursery_count_daily?.last_value
                      .date_of_report_unix * 1000
                  }
                />
              </Collapse>
            </GraphContainer>

            <GraphContainer>
              <GraphContent>
                <GraphHeader
                  Icon={Locatie}
                  title={siteText.verpleeghuis_besmette_locaties.title}
                />
                <p>{siteText.verpleeghuis_besmette_locaties.text}</p>

                {state.nl?.total_newly_reported_locations && (
                  <BarScale
                    min={siteText.verpleeghuis_besmette_locaties.bar.min}
                    max={siteText.verpleeghuis_besmette_locaties.bar.max}
                    screenReaderText={
                      siteText.verpleeghuis_besmette_locaties.bar
                        .screen_reader_graph_content
                    }
                    value={
                      state.nl?.total_newly_reported_locations.last_value
                        .infected_nursery_daily
                    }
                    id="besmette_locaties_verpleeghuis"
                    gradient={
                      siteText.verpleeghuis_besmette_locaties.bar.gradient
                    }
                  />
                )}
              </GraphContent>
              <Collapse
                openText={siteText.verpleeghuis_besmette_locaties.open}
                sluitText={siteText.verpleeghuis_besmette_locaties.sluit}
              >
                <h4>{siteText.verpleeghuis_besmette_locaties.fold_title}</h4>
                <p>{siteText.verpleeghuis_besmette_locaties.fold}</p>

                <h4>{siteText.verpleeghuis_besmette_locaties.graph_title}</h4>
                {state.nl?.total_newly_reported_locations?.values && (
                  <LineChart
                    values={state.nl.total_newly_reported_locations.values.map(
                      (value) => ({
                        value: value.infected_nursery_daily,
                        date: value.date_of_report_unix,
                      })
                    )}
                  />
                )}

                {state.nl?.total_reported_locations?.last_value && (
                  <h3>
                    {siteText.verpleeghuis_besmette_locaties.metric_title}{' '}
                    <span style={{ color: '#01689b' }}>
                      {formatDecimal(
                        state.nl?.infected_people_nursery_count_daily.last_value
                          .total_reported_locations
                      )}
                    </span>
                  </h3>
                )}
                <p>{siteText.verpleeghuis_besmette_locaties.metric_text}</p>

                <Metadata
                  period={state.nl?.total_newly_reported_locations?.values.map(
                    (value) => value.date_of_report_unix
                  )}
                  dataSource={siteText.verpleeghuis_besmette_locaties.bron}
                  lastUpdated={
                    state.nl?.total_newly_reported_locations?.last_value
                      .date_of_report_unix * 1000
                  }
                />
              </Collapse>
            </GraphContainer>

            <GraphContainer>
              <GraphContent>
                <GraphHeader
                  Icon={CoronaVirus}
                  title={siteText.verpleeghuis_oversterfte.title}
                />
                <p>{siteText.verpleeghuis_oversterfte.text}</p>
                {state.nl?.deceased_people_nursery_count_daily && (
                  <BarScale
                    min={siteText.verpleeghuis_oversterfte.bar.min}
                    max={siteText.verpleeghuis_oversterfte.bar.max}
                    screenReaderText={
                      siteText.verpleeghuis_oversterfte
                        .screen_reader_graph_content
                    }
                    value={
                      state.nl?.deceased_people_nursery_count_daily.last_value
                        .deceased_nursery_daily
                    }
                    id="over"
                    gradient={siteText.verpleeghuis_oversterfte.bar.gradient}
                  />
                )}
              </GraphContent>
              <Collapse
                openText={siteText.verpleeghuis_oversterfte.open}
                sluitText={siteText.verpleeghuis_oversterfte.sluit}
              >
                <h4>{siteText.verpleeghuis_oversterfte.fold_title}</h4>
                <p>{siteText.verpleeghuis_oversterfte.fold}</p>
                <h4>{siteText.verpleeghuis_oversterfte.graph_title}</h4>
                {state.nl?.deceased_people_nursery_count_daily?.values && (
                  <LineChart
                    values={state.nl.deceased_people_nursery_count_daily.values.map(
                      (value) => ({
                        value: value.deceased_nursery_daily,
                        date: value.date_of_report_unix,
                      })
                    )}
                  />
                )}
                <Metadata
                  period={state.nl?.deceased_people_nursery_count_daily?.values.map(
                    (value) => value.date_of_report_unix
                  )}
                  dataSource={siteText.verpleeghuis_oversterfte.bron}
                  lastUpdated={
                    state.nl?.deceased_people_nursery_count_daily?.last_value
                      .date_of_report_unix * 1000
                  }
                />
              </Collapse>
            </GraphContainer>
          </Masonry>
        </section>
      </div>
    </>
  );
};

Home.getLayout = Layout.getLayout({
  ...siteText.metadata,
  openGraphImage,
  twitterImage,
});

export default Home;
