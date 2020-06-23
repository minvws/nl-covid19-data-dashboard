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
import Repro from '../assets/reproductie.svg';
import VerpleegHuis from '../assets/verpleeg.svg';
import Virus from '../assets/virus.svg';
import Locatie from '../assets/locaties.svg';

import { store } from 'store';
import siteText from 'data/textNationaal.json';
import GraphHeader from 'components/graphHeader';
import formatDecimal from 'utils/formatDec';
import IconList from 'components/iconList';

const AreaChart = dynamic(() => import('components/areaChart'));
const BarChart = dynamic(() => import('components/barChart'));
const LineChart = dynamic(() => import('components/lineChart'));

export type HomeLayoutProps = {
  getLayout: (string) => string;
};

import { FunctionComponentWithLayout } from 'components/layout';

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
  }, []);

  const shouldShowDataComponents = Boolean(state.NL);

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    600: 1,
  };

  return (
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
          <GraphContainer>
            <GraphContent>
              <GraphHeader
                Icon={Arts}
                title={siteText.ic_opnames_per_dag.title}
              />
              <p>{siteText.ic_opnames_per_dag.text}</p>

              {state.NL?.intake_intensivecare_ma && (
                <BarScale
                  min={siteText.ic_opnames_per_dag.min}
                  max={siteText.ic_opnames_per_dag.max}
                  screenReaderText={
                    siteText.ic_opnames_per_dag.screen_reader_graph_content
                  }
                  kritiekeWaarde={siteText.ic_opnames_per_dag.signaalwaarde}
                  value={state.NL?.intake_intensivecare_ma.value}
                  id="ic"
                  gradient={siteText.ic_opnames_per_dag.gradient}
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
              {state.NL?.intake_intensivecare_ma?.list && (
                <LineChart
                  data={state.NL?.intake_intensivecare_ma.list}
                  signaalwaarde={siteText.ic_opnames_per_dag.signaalwaarde}
                />
              )}

              <Metadata
                period={state.NL?.intake_intensivecare_ma?.list}
                dataSource={siteText.ic_opnames_per_dag.bron}
                lastUpdated={
                  state.NL?.intake_intensivecare_ma?.lastupdate * 1000
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

              {state.NL?.intake_hospital_ma && (
                <BarScale
                  min={0}
                  max={100}
                  kritiekeWaarde={40}
                  screenReaderText={
                    siteText.ziekenhuisopnames_per_dag
                      .screen_reader_graph_content
                  }
                  value={state.NL?.intake_hospital_ma.value}
                  id="opnames"
                  gradient={siteText.ziekenhuisopnames_per_dag.gradient}
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
              {state.NL?.intake_hospital_ma?.list && (
                <LineChart
                  data={state.NL?.intake_hospital_ma.list}
                  signaalwaarde={40}
                />
              )}

              <Metadata
                period={state.NL?.intake_hospital_ma?.list}
                dataSource={siteText.ziekenhuisopnames_per_dag.bron}
                lastUpdated={state.NL?.intake_hospital_ma?.lastupdate * 1000}
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
              {state.NL?.infected_people_delta_normalized && (
                <BarScale
                  min={siteText.positief_geteste_personen.min}
                  max={siteText.positief_geteste_personen.max}
                  screenReaderText={
                    siteText.positief_geteste_personen
                      .screen_reader_graph_content
                  }
                  value={state.NL?.infected_people_delta_normalized.value}
                  id="positief"
                  gradient={siteText.positief_geteste_personen.gradient}
                />
              )}
            </GraphContent>
            <Collapse
              openText={siteText.positief_geteste_personen.open}
              sluitText={siteText.positief_geteste_personen.sluit}
            >
              <h4>{siteText.positief_geteste_personen.fold_title}</h4>
              <p>{siteText.positief_geteste_personen.fold}</p>

              <h4>{siteText.positief_geteste_personen.linechart_title}</h4>
              {state.NL?.infected_people_delta_normalized?.list && (
                <LineChart
                  data={state.NL?.infected_people_delta_normalized?.list}
                />
              )}

              <h4>{siteText.positief_geteste_personen.graph_title}</h4>
              {state.NL?.intake_share_age_groups && (
                <BarChart
                  keys={[
                    '0 tot 20',
                    '20 tot 40',
                    '40 tot 60',
                    '60 tot 80',
                    '80+',
                  ]}
                  data={state.NL?.intake_share_age_groups.list}
                />
              )}

              <Metadata
                dataSource={siteText.positief_geteste_personen.bron}
                lastUpdated={
                  state.NL?.intake_share_age_groups?.lastupdate * 1000
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
              {state.NL?.infectious_people_count_normalized && (
                <BarScale
                  min={siteText.besmettelijke_personen.min}
                  max={siteText.besmettelijke_personen.max}
                  screenReaderText={
                    siteText.besmettelijke_personen.screen_reader_graph_content
                  }
                  value={state.NL?.infectious_people_count_normalized.value}
                  id="besmettelijk"
                  gradient={siteText.besmettelijke_personen.gradient}
                />
              )}

              <p className={'regioDataLoading'}>
                Signaalwaarde volgt in juni 2020
              </p>

              {state.NL?.infectious_people_count?.value && (
                <h3>
                  {siteText.besmettelijke_personen.metric_title}{' '}
                  <span style={{ color: '#01689b' }}>
                    {formatDecimal(state.NL?.infectious_people_count.value)}
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
                  state.NL?.infectious_people_count?.lastupdate * 1000
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
              {state.NL?.reproduction_index && (
                <BarScale
                  min={siteText.reproductiegetal.min}
                  max={siteText.reproductiegetal.max}
                  screenReaderText={
                    siteText.reproductiegetal.screen_reader_graph_content
                  }
                  kritiekeWaarde={siteText.reproductiegetal.signaalwaarde}
                  value={state.NL?.reproduction_index.value}
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
              {state.NL?.reproduction_index?.list && (
                <AreaChart
                  data={state.NL?.reproduction_index.list}
                  min={state.NL?.reproduction_index.min}
                  max={state.NL?.reproduction_index.max}
                  minY={siteText.reproductiegetal.min}
                  maxY={siteText.reproductiegetal.max}
                  signaalwaarde={1}
                  rangeLegendLabel={siteText.reproductiegetal.rangeLegendLabel}
                  lineLegendLabel={siteText.reproductiegetal.lineLegendLabel}
                />
              )}

              <p>
                Bij lage aantallen ziekenhuisopnames wordt de onzekerheid van
                het reproductiegetal groter en kan deze meer schommelen. Als de
                schatting boven de waarde 1 komt, moet eerst naar de bandbreedte
                worden gekeken voordat er conclusies kunnen worden getrokken.
              </p>

              <Metadata
                period={state.NL?.reproduction_index?.list}
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

          <GraphContainer>
            <GraphContent>
              <GraphHeader title={siteText.overige_gegevens.title} />
              <p>{siteText.overige_gegevens.text}</p>
            </GraphContent>
            <Collapse
              openText={siteText.overige_gegevens.open}
              sluitText={siteText.overige_gegevens.sluit}
            >
              <p>{siteText.overige_gegevens.fold}</p>
              <IconList list={siteText.overige_gegevens.list} />
            </Collapse>
          </GraphContainer>

          <GraphContainer>
            <GraphContent>
              <GraphHeader title={siteText.gedragsignalering.title} />
              <p>{siteText.gedragsignalering.text}</p>
            </GraphContent>
            <Collapse
              openText={siteText.gedragsignalering.open}
              sluitText={siteText.gedragsignalering.sluit}
            >
              <p>{siteText.gedragsignalering.fold}</p>
              <IconList list={siteText.gedragsignalering.list} />
            </Collapse>
          </GraphContainer>
        </Masonry>
      </section>

      <section className="home-section">
        <TitleBlock
          Icon={VerpleegHuis}
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
              {state.NL?.infected_people_nursery_count_daily && (
                <BarScale
                  min={siteText.verpleeghuis_positief_geteste_personen.min}
                  max={siteText.verpleeghuis_positief_geteste_personen.max}
                  screenReaderText={
                    siteText.verpleeghuis_positief_geteste_personen
                      .screen_reader_graph_content
                  }
                  value={state.NL?.infected_people_nursery_count_daily.value}
                  id="positief_verpleeghuis"
                  gradient={
                    siteText.verpleeghuis_positief_geteste_personen.gradient
                  }
                />
              )}
            </GraphContent>
            <Collapse
              openText={siteText.verpleeghuis_positief_geteste_personen.open}
              sluitText={siteText.verpleeghuis_positief_geteste_personen.sluit}
            >
              <h4>
                {siteText.verpleeghuis_positief_geteste_personen.fold_title}
              </h4>
              <p>{siteText.verpleeghuis_positief_geteste_personen.fold}</p>
              <h4>
                {siteText.verpleeghuis_positief_geteste_personen.graph_title}
              </h4>
              {state.NL?.infected_people_nursery_count_daily?.list && (
                <LineChart
                  data={state.NL?.infected_people_nursery_count_daily?.list}
                />
              )}
              <Metadata
                period={state.NL?.infected_people_nursery_count_daily?.list}
                dataSource={
                  siteText.verpleeghuis_positief_geteste_personen.bron
                }
                lastUpdated={
                  state.NL?.infected_people_nursery_count_daily?.lastupdate *
                  1000
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

              {state.NL?.total_newly_reported_locations && (
                <BarScale
                  min={siteText.verpleeghuis_besmette_locaties.min}
                  max={siteText.verpleeghuis_besmette_locaties.max}
                  screenReaderText={
                    siteText.verpleeghuis_besmette_locaties
                      .screen_reader_graph_content
                  }
                  value={state.NL?.total_newly_reported_locations.value}
                  id="besmette_locaties_verpleeghuis"
                  gradient={siteText.verpleeghuis_besmette_locaties.gradient}
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
              {state.NL?.total_newly_reported_locations?.list && (
                <LineChart
                  data={state.NL.total_newly_reported_locations.list}
                />
              )}

              {state.NL?.total_reported_locations?.value && (
                <h3>
                  {siteText.verpleeghuis_besmette_locaties.metric_title}{' '}
                  <span style={{ color: '#01689b' }}>
                    {formatDecimal(state.NL?.total_reported_locations.value)}
                  </span>
                </h3>
              )}
              <p>{siteText.verpleeghuis_besmette_locaties.metric_text}</p>

              <Metadata
                period={state.NL?.total_newly_reported_locations?.list}
                dataSource={siteText.verpleeghuis_besmette_locaties.bron}
                lastUpdated={
                  state.NL?.total_newly_reported_locations?.lastupdate * 1000
                }
              />
            </Collapse>
          </GraphContainer>

          <GraphContainer>
            <GraphContent>
              <GraphHeader
                Icon={Virus}
                title={siteText.verpleeghuis_oversterfte.title}
              />
              <p>{siteText.verpleeghuis_oversterfte.text}</p>
              {state.NL?.deceased_people_nursery_count_daily && (
                <BarScale
                  min={siteText.verpleeghuis_oversterfte.min}
                  max={siteText.verpleeghuis_oversterfte.max}
                  screenReaderText={
                    siteText.verpleeghuis_oversterfte
                      .screen_reader_graph_content
                  }
                  value={state.NL?.deceased_people_nursery_count_daily.value}
                  id="over"
                  gradient={siteText.verpleeghuis_oversterfte.gradient}
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
              {state.NL?.deceased_people_nursery_count_daily?.list && (
                <LineChart
                  data={state.NL.deceased_people_nursery_count_daily.list}
                />
              )}
              <Metadata
                period={state.NL?.deceased_people_nursery_count_daily?.list}
                dataSource={siteText.verpleeghuis_oversterfte.bron}
                lastUpdated={
                  state.NL?.deceased_people_nursery_count_daily?.lastupdate *
                  1000
                }
              />
            </Collapse>
          </GraphContainer>
        </Masonry>
      </section>
    </div>
  );
};

Home.getLayout = Layout.getLayout();

export default Home;
