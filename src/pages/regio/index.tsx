import { useContext, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import Layout from 'components/layout';
import MaxWidth from 'components/maxWidth';
import GraphContainer from 'components/graphContainer';
import GraphHeader from 'components/graphHeader';
import BarScale from 'components/barScale';
import Collapse from 'components/collapse';
import LastUpdated from 'components/lastUpdated';
import SelectRegio from 'components/selectRegio';
import Warning from 'assets/warn.svg';
import Metadata from 'components/metadata';
import LoadingPlaceholder from 'components/loadingPlaceholder';
import regioData from 'data';

import { store } from 'store';
import GraphContent from 'components/graphContent';

import Ziekenhuis from 'assets/ziekenhuis.svg';
import Getest from 'assets/test.svg';

import siteText from 'data/textRegionaal.json';

const LineChart = dynamic(() => import('components/lineChart'));
const SvgMap = dynamic(() => import('components/mapChart/svgMap'));

import { FunctionComponentWithLayout } from 'components/layout';
import { HomeLayoutProps } from 'pages/index';
import ScreenReaderOnly from 'components/screenReaderOnly';
import formatDecimal from 'utils/formatDec';

const Regio: FunctionComponentWithLayout<HomeLayoutProps> = () => {
  const router = useRouter();

  const globalState = useContext(store);
  const { state, dispatch } = globalState;

  const selectedRegio = useMemo(() => {
    const selectedRegioCode = router.query?.regio;
    return selectedRegioCode
      ? regioData.find((el) => el.code === selectedRegioCode)
      : null;
  }, [router]);

  const contentRef = useRef(null);
  const selectRegioWrapperRef = useRef(null);

  /**
   * Focuses region select element. Triggered by a screen reader
   * only button at the end of the content.
   */
  const focusRegioSelect = () => {
    if (!selectRegioWrapperRef.current) return;

    const input = selectRegioWrapperRef.current.querySelector('input');
    if (input) input.focus();
  };

  /**
   * Focuses the first heading in the content column,
   * used after region changes to move focus for visually impaired
   * users so they know what has changed.
   */
  const focusFirstHeading = () => {
    if (contentRef.current) contentRef.current.focus();
  };

  const setSelectedRegio = (item) => {
    router.replace(
      {
        pathname: router.pathname,
        query: { regio: item.code },
      },
      undefined,
      { shallow: true }
    );
  };

  useEffect(() => {
    async function fetchData() {
      if (selectedRegio && selectedRegio.code) {
        if (!state[selectedRegio.code]) {
          dispatch({ type: 'INIT_LOAD', payload: { id: selectedRegio.code } });
          const response = await fetch(
            `${process.env.REACT_APP_DATA_SRC}${selectedRegio.code}.json`
          );
          const result = await response.json();
          dispatch({ type: 'LOAD_SUCCESS', payload: result });
        }

        focusFirstHeading();
      }
    }

    fetchData();
  }, [selectedRegio]);

  if (!selectedRegio) {
    return (
      <MaxWidth>
        <LastUpdated />
        <div className="regio-grid">
          <div className="mapCol">
            <SelectRegio
              selected={selectedRegio}
              setSelection={setSelectedRegio}
            />
            <SvgMap selected={selectedRegio} setSelection={setSelectedRegio} />
          </div>

          <div className="panelCol">
            <GraphContainer>
              <GraphContent>
                <GraphHeader
                  Icon={Ziekenhuis}
                  title={siteText.regionaal_ziekenhuisopnames_per_dag.title}
                />

                <p>{siteText.regionaal_ziekenhuisopnames_per_dag.text}</p>
                <span className={'regioDataLoading'}>
                  <Warning />
                  {siteText.geen_selectie.text}
                </span>
              </GraphContent>
            </GraphContainer>

            <GraphContainer>
              <GraphContent>
                <GraphHeader
                  Icon={Getest}
                  title={siteText.regionaal_positief_geteste_personen.title}
                />
                <p>{siteText.regionaal_positief_geteste_personen.text}</p>
                <span className={'regioDataLoading'}>
                  <Warning />
                  {siteText.geen_selectie.text}
                </span>
              </GraphContent>
            </GraphContainer>
          </div>
        </div>
      </MaxWidth>
    );
  }

  return (
    <MaxWidth>
      <LastUpdated />
      <div className="regio-grid">
        <div className="mapCol" ref={selectRegioWrapperRef}>
          <SelectRegio
            selected={selectedRegio}
            setSelection={setSelectedRegio}
          />
          <SvgMap selected={selectedRegio} setSelection={setSelectedRegio} />
        </div>

        <div className="panelCol">
          <GraphContainer>
            <GraphContent>
              <GraphHeader
                Icon={Ziekenhuis}
                title={siteText.regionaal_ziekenhuisopnames_per_dag.title}
                headingRef={contentRef}
                regio={selectedRegio?.name}
              />

              <p>{siteText.regionaal_ziekenhuisopnames_per_dag.text}</p>
              {!state[selectedRegio?.code]?.intake_hospital_ma && (
                <LoadingPlaceholder />
              )}
              {state[selectedRegio?.code]?.intake_hospital_ma && (
                <BarScale
                  min={siteText.regionaal_ziekenhuisopnames_per_dag.min}
                  max={siteText.regionaal_ziekenhuisopnames_per_dag.max}
                  value={state[selectedRegio.code].intake_hospital_ma.value}
                  screenReaderText={
                    siteText.regionaal_ziekenhuisopnames_per_dag
                      .screen_reader_graph_content
                  }
                  id="regio_opnames"
                  gradient={
                    siteText.regionaal_ziekenhuisopnames_per_dag.gradient
                  }
                />
              )}
            </GraphContent>
            <Collapse
              openText={siteText.regionaal_ziekenhuisopnames_per_dag.open}
              sluitText={siteText.regionaal_ziekenhuisopnames_per_dag.sluit}
            >
              <h4>{siteText.regionaal_ziekenhuisopnames_per_dag.fold_title}</h4>
              <p>{siteText.regionaal_ziekenhuisopnames_per_dag.fold}</p>
              <h4>
                {siteText.regionaal_ziekenhuisopnames_per_dag.graph_title}
              </h4>
              {state[selectedRegio?.code]?.intake_hospital_ma?.list && (
                <LineChart
                  data={state[selectedRegio?.code]?.intake_hospital_ma?.list}
                />
              )}
              <Metadata
                period={state[selectedRegio?.code]?.intake_hospital_ma?.list}
                dataSource={siteText.regionaal_ziekenhuisopnames_per_dag.bron}
                lastUpdated={
                  state[selectedRegio?.code]?.intake_hospital_ma?.lastupdate *
                  1000
                }
              />
            </Collapse>
          </GraphContainer>

          <GraphContainer>
            <GraphContent>
              <GraphHeader
                Icon={Getest}
                title={siteText.regionaal_positief_geteste_personen.title}
                regio={selectedRegio?.name}
              />
              <p>{siteText.regionaal_positief_geteste_personen.text}</p>
              {!state[selectedRegio?.code]
                ?.infected_people_delta_normalized && <LoadingPlaceholder />}
              {state[selectedRegio.code]?.infected_people_delta_normalized && (
                <BarScale
                  min={siteText.regionaal_positief_geteste_personen.min}
                  max={siteText.regionaal_positief_geteste_personen.max}
                  value={
                    state[selectedRegio.code].infected_people_delta_normalized
                      .value
                  }
                  screenReaderText={
                    siteText.regionaal_positief_geteste_personen
                      .screen_reader_graph_content
                  }
                  id="regio_infecties"
                  gradient={
                    siteText.regionaal_positief_geteste_personen.gradient
                  }
                />
              )}

              {state[selectedRegio?.code]?.infected_people_total?.value && (
                <h3>
                  {siteText.regionaal_positief_geteste_personen.metric_title}{' '}
                  <span style={{ color: '#01689b' }}>
                    {formatDecimal(
                      state[selectedRegio?.code]?.infected_people_total?.value
                    )}
                  </span>
                </h3>
              )}
            </GraphContent>

            <Collapse
              openText={siteText.regionaal_positief_geteste_personen.open}
              sluitText={siteText.regionaal_positief_geteste_personen.sluit}
            >
              <h4>{siteText.regionaal_positief_geteste_personen.fold_title}</h4>
              <p>{siteText.regionaal_positief_geteste_personen.fold}</p>
              <h4>
                {siteText.regionaal_positief_geteste_personen.graph_title}
              </h4>

              {state[selectedRegio?.code]?.infected_people_delta_normalized
                ?.list && (
                <LineChart
                  data={
                    state[selectedRegio.code].infected_people_delta_normalized
                      .list
                  }
                />
              )}

              <Metadata
                period={
                  state[selectedRegio?.code]?.infected_people_delta_normalized
                    ?.list
                }
                dataSource={siteText.regionaal_positief_geteste_personen.bron}
                lastUpdated={
                  state[selectedRegio?.code]?.infected_people_delta_normalized
                    ?.lastupdate * 1000
                }
              />
            </Collapse>
          </GraphContainer>
        </div>
      </div>
      <ScreenReaderOnly>
        <button onClick={focusRegioSelect}>
          {siteText.terug_naar_regio_selectie.text}
        </button>
      </ScreenReaderOnly>
    </MaxWidth>
  );
};
Regio.getLayout = Layout.getLayout(siteText.metadata.titel);

export default Regio;
