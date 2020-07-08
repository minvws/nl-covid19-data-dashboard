import styles from './regio.module.scss';
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
import Warning from 'assets/warn.svg';
import Metadata from 'components/metadata';
import LoadingPlaceholder from 'components/loadingPlaceholder';

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
import SelectMunicipality from 'components/selectMunicipality';

export type SafetyRegion = {
  id: number;
  code: string;
  name: string;
};

export type MunicipalityMapping = {
  name: string;
  safetyRegion: string;
};

type RegioProps = HomeLayoutProps & {
  municipalities: MunicipalityMapping[];
  safetyRegions: SafetyRegion[];
};

type RegioStaticProps = {
  props: {
    municipalities: MunicipalityMapping[];
    safetyRegions: SafetyRegion[];
  };
};

export async function getStaticProps(): Promise<RegioStaticProps> {
  const municipalityMapping = require('../../data/gemeente_veiligheidsregio.json');
  const safetyRegions: SafetyRegion[] = require('../../data/index').default;

  // group municipalities by safety region
  const map: MunicipalityMapping[] = Object.entries(municipalityMapping).map(
    (entry: [string, string]): MunicipalityMapping => {
      // value is safety region ID, key is municipality name
      const [municipality, safetyRegion] = entry;
      return { name: municipality, safetyRegion };
    }
  );

  return {
    props: {
      municipalities: map.sort((a, b) => {
        const safetyRegionA = safetyRegions.find(
          (el) => el.code === a.safetyRegion
        );

        const safetyRegionB = safetyRegions.find(
          (el) => el.code === b.safetyRegion
        );

        return (
          // sort by safety region name OR (if they are the same) sort by name.
          safetyRegionA.name.localeCompare(safetyRegionB.name) ||
          a.name.localeCompare(b.name)
        );
      }),
      safetyRegions: safetyRegions
        .filter((el) => el.id !== 0)
        .sort((a, b) => a.name.localeCompare(b.name)),
    },
  };
}

const RegioDataLoading = () => {
  return (
    <span className={styles['safety-region-data-loading']}>
      <Warning />
      {siteText.geen_selectie.text}
    </span>
  );
};

const Regio: FunctionComponentWithLayout<RegioProps> = (props) => {
  const { municipalities, safetyRegions } = props;

  const router = useRouter();

  const globalState = useContext(store);
  const { state, dispatch } = globalState;

  const selectedRegio = useMemo(() => {
    const selectedRegioCode = router.query?.regio;
    return selectedRegioCode
      ? safetyRegions.find((el) => el.code === selectedRegioCode)
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

  const setSelectedRegio = (safetyRegionCode: SafetyRegion['code']): void => {
    router.replace(
      {
        pathname: router.pathname,
        query: safetyRegionCode ? { regio: safetyRegionCode } : {},
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

  return (
    <MaxWidth>
      <LastUpdated />
      <div className={styles['regio-grid']}>
        <div className={styles['map-column']} ref={selectRegioWrapperRef}>
          <SelectMunicipality
            municipalities={municipalities}
            safetyRegions={safetyRegions}
            setSelectedSafetyRegion={setSelectedRegio}
          />

          <div className={styles['map-container']}>
            <div className={styles['safety-region-header']}>
              <p>Uw veiligheidsregio</p>
              {selectedRegio && <h2>{selectedRegio.name}</h2>}
              {!selectedRegio && (
                <span className={styles['select-safety-region']}>
                  Selecteer een veiligheidsregio of gemeente
                </span>
              )}
            </div>
            <SvgMap safetyRegions={safetyRegions} selected={selectedRegio} />
          </div>
        </div>

        <div className={styles['panel-column']}>
          <GraphContainer>
            <GraphContent>
              <GraphHeader
                Icon={Ziekenhuis}
                title={siteText.regionaal_ziekenhuisopnames_per_dag.title}
                headingRef={contentRef}
                regio={selectedRegio?.name}
              />

              <p>{siteText.regionaal_ziekenhuisopnames_per_dag.text}</p>

              {!selectedRegio && <RegioDataLoading />}

              {selectedRegio && (
                <>
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
                </>
              )}
            </GraphContent>

            {selectedRegio && (
              <Collapse
                openText={siteText.regionaal_ziekenhuisopnames_per_dag.open}
                sluitText={siteText.regionaal_ziekenhuisopnames_per_dag.sluit}
              >
                <h4>
                  {siteText.regionaal_ziekenhuisopnames_per_dag.fold_title}
                </h4>
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
            )}
          </GraphContainer>

          <GraphContainer>
            <GraphContent>
              <GraphHeader
                Icon={Getest}
                title={siteText.regionaal_positief_geteste_personen.title}
                regio={selectedRegio?.name}
              />

              <p>{siteText.regionaal_positief_geteste_personen.text}</p>

              {!selectedRegio && <RegioDataLoading />}

              {selectedRegio && (
                <>
                  {!state[selectedRegio?.code]
                    ?.infected_people_delta_normalized && (
                    <LoadingPlaceholder />
                  )}
                  {state[selectedRegio.code]
                    ?.infected_people_delta_normalized && (
                    <BarScale
                      min={siteText.regionaal_positief_geteste_personen.min}
                      max={siteText.regionaal_positief_geteste_personen.max}
                      value={
                        state[selectedRegio.code]
                          .infected_people_delta_normalized.value
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

                  {state[selectedRegio?.code]?.infected_people_total && (
                    <h3>
                      {
                        siteText.regionaal_positief_geteste_personen
                          .metric_title
                      }{' '}
                      <span style={{ color: '#01689b' }}>
                        {formatDecimal(
                          state[selectedRegio?.code]?.infected_people_total
                            ?.value
                        )}
                      </span>
                    </h3>
                  )}
                </>
              )}
            </GraphContent>

            {selectedRegio && (
              <Collapse
                openText={siteText.regionaal_positief_geteste_personen.open}
                sluitText={siteText.regionaal_positief_geteste_personen.sluit}
              >
                <h4>
                  {siteText.regionaal_positief_geteste_personen.fold_title}
                </h4>
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
            )}
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
