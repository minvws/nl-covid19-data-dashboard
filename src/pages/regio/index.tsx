import { useContext, useMemo, useEffect } from 'react';
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
              {!state[selectedRegio?.code]?.intake_hospital_ma && (
                <LoadingPlaceholder />
              )}
              {state[selectedRegio?.code]?.intake_hospital_ma && (
                <BarScale
                  min={siteText.regionaal_ziekenhuisopnames_per_dag.min}
                  max={siteText.regionaal_ziekenhuisopnames_per_dag.max}
                  value={state[selectedRegio.code].intake_hospital_ma.value}
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
                  id="regio_infecties"
                  gradient={
                    siteText.regionaal_positief_geteste_personen.gradient
                  }
                />
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
    </MaxWidth>
  );
};

Regio.getLayout = Layout.getLayout(siteText.metadata.titel);

export default Regio;
