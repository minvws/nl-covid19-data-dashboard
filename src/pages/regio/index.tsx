import styles from './regio.module.scss';
import { useContext, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import {
  FormattedMessage,
  FormattedDate,
  FormattedNumber,
  useIntl,
} from 'react-intl';

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
import { DateReported } from 'components/dateReported';

import { store } from 'store';
import GraphContent from 'components/graphContent';

import Ziekenhuis from 'assets/ziekenhuis.svg';
import Getest from 'assets/test.svg';

import siteText from 'locale';

const LineChart = dynamic(() => import('components/lineChart'));
const SvgMap = dynamic(() => import('components/mapChart/svgMap'));

import { FunctionComponentWithLayout } from 'components/layout';
import ScreenReaderOnly from 'components/screenReaderOnly';
import SelectMunicipality from 'components/selectMunicipality';

import openGraphImage from 'assets/sharing/og-regionale-cijfers.png?url';
import twitterImage from 'assets/sharing/twitter-regionale-cijfers.png?url';
import Head from 'next/head';

export type SafetyRegion = {
  id: number;
  code: string;
  name: string;
};

export type MunicipalityMapping = {
  name: string;
  safetyRegion: string;
};

type RegioProps = {
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
    (entry: [string, any]): MunicipalityMapping => {
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
          safetyRegionA?.name.localeCompare(safetyRegionB?.name as string) ||
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
      <FormattedMessage id="geen_selectie.text" />
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
      : undefined;
  }, [router.query?.regio, safetyRegions]);

  const contentRef = useRef(null);
  const selectRegioWrapperRef = useRef(null);

  /**
   * Focuses region select element. Triggered by a screen reader
   * only button at the end of the content.
   */
  const focusRegioSelect = () => {
    if (!selectRegioWrapperRef.current) return;

    const el = selectRegioWrapperRef.current as any;
    const input = el.querySelector('input');
    if (input) input.focus();
  };

  /**
   * Focuses the first heading in the content column,
   * used after region changes to move focus for visually impaired
   * users so they know what has changed.
   */
  const focusFirstHeading = () => {
    const el = contentRef.current as any;
    if (el) el.focus();
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
  }, [dispatch, selectedRegio, state]);

  const intl = useIntl();

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
      </Head>

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
                <p>
                  <FormattedMessage defaultMessage="Uw veiligheidsregio" />
                </p>
                {selectedRegio && <h2>{selectedRegio.name}</h2>}
                {!selectedRegio && (
                  <span className={styles['select-safety-region']}>
                    <FormattedMessage defaultMessage="Selecteer een veiligheidsregio of gemeente" />
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
                  title={intl.formatMessage({
                    id: 'regionaal_ziekenhuisopnames_per_dag.title',
                  })}
                  headingRef={contentRef}
                  regio={selectedRegio?.name}
                />

                <p>
                  <FormattedMessage id="regionaal_ziekenhuisopnames_per_dag.text" />
                </p>

                {!selectedRegio && <RegioDataLoading />}

                {selectedRegio && (
                  <>
                    {!state[selectedRegio?.code]?.intake_hospital_ma && (
                      <LoadingPlaceholder />
                    )}

                    {state[selectedRegio?.code]?.intake_hospital_ma && (
                      <>
                        <BarScale
                          min={0}
                          max={100}
                          value={
                            state[selectedRegio.code].intake_hospital_ma
                              .last_value.intake_hospital_ma
                          }
                          screenReaderText={intl.formatMessage(
                            {
                              id:
                                'regionaal_ziekenhuisopnames_per_dag.screen_reader_graph_content',
                            },
                            {
                              value:
                                state[selectedRegio.code].intake_hospital_ma
                                  .last_value.intake_hospital_ma,
                              kritiekeWaarde: null,
                            }
                          )}
                          id="regio_opnames"
                          gradient={[
                            {
                              color: '#69c253',
                              value: 0,
                            },
                            {
                              color: '#D3A500',
                              value: 40,
                            },
                            {
                              color: '#f35065',
                              value: 90,
                            },
                          ]}
                        />

                        <DateReported>
                          <p>
                            <FormattedMessage
                              id="regionaal_ziekenhuisopnames_per_dag.datums"
                              values={{
                                dateOfReport: (
                                  <FormattedDate
                                    value={
                                      state[selectedRegio?.code]
                                        ?.intake_hospital_ma?.last_value
                                        ?.date_of_report_unix * 1000
                                    }
                                    day="numeric"
                                    month="long"
                                  />
                                ),
                              }}
                            />
                          </p>
                        </DateReported>
                      </>
                    )}
                  </>
                )}
              </GraphContent>

              {selectedRegio && (
                <Collapse
                  openText={intl.formatMessage({
                    id: 'regionaal_ziekenhuisopnames_per_dag.open',
                  })}
                  sluitText={intl.formatMessage({
                    id: 'regionaal_ziekenhuisopnames_per_dag.sluit',
                  })}
                  piwikAction={selectedRegio.name}
                  piwikName="Ziekenhuisopnames per dag in Amsterdam-Amstelland"
                >
                  <h4>
                    <FormattedMessage id="regionaal_ziekenhuisopnames_per_dag.fold_title" />
                  </h4>
                  <p>
                    <FormattedMessage id="regionaal_ziekenhuisopnames_per_dag.fold" />
                  </p>
                  <h4>
                    <FormattedMessage id="regionaal_ziekenhuisopnames_per_dag.graph_title" />
                  </h4>
                  {state[selectedRegio?.code]?.intake_hospital_ma?.values && (
                    <LineChart
                      values={state[
                        selectedRegio?.code
                      ]?.intake_hospital_ma?.values.map((value: any) => ({
                        value: value.intake_hospital_ma,
                        date: value.date_of_report_unix,
                      }))}
                    />
                  )}
                  <Metadata
                    dataSource={
                      siteText['regionaal_ziekenhuisopnames_per_dag.bron']
                    }
                  />
                </Collapse>
              )}
            </GraphContainer>

            <GraphContainer>
              <GraphContent>
                <GraphHeader
                  Icon={Getest}
                  title={intl.formatMessage({
                    id: 'regionaal_positief_geteste_personen.title',
                  })}
                  regio={selectedRegio?.name}
                />

                <p>
                  <FormattedMessage id="regionaal_positief_geteste_personen.text" />
                </p>

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
                        min={0}
                        max={10}
                        value={
                          state[selectedRegio.code]
                            .infected_people_delta_normalized.last_value
                            .infected_people_delta_normalized
                        }
                        screenReaderText={intl.formatMessage(
                          {
                            id:
                              'regionaal_positief_geteste_personen.screen_reader_graph_content',
                          },
                          {
                            value:
                              state[selectedRegio.code]
                                .infected_people_delta_normalized.last_value
                                .infected_people_delta_normalized,
                            kritiekeWaarde: null,
                          }
                        )}
                        id="regio_infecties"
                        gradient={[
                          {
                            color: '#3391CC',
                            value: 0,
                          },
                        ]}
                      />
                    )}

                    {state[selectedRegio?.code]?.infected_people_total && (
                      <>
                        <h3>
                          <FormattedMessage id="regionaal_positief_geteste_personen.metric_title" />{' '}
                          <span style={{ color: '#01689b' }}>
                            <FormattedNumber
                              value={
                                state[selectedRegio?.code]
                                  ?.infected_people_total?.last_value
                                  .infected_people_total
                              }
                            />
                          </span>
                        </h3>

                        <DateReported>
                          <p>
                            <FormattedMessage
                              id="regionaal_positief_geteste_personen.datums"
                              values={{
                                dateOfReport: (
                                  <FormattedDate
                                    value={
                                      state[selectedRegio?.code]
                                        ?.infected_people_delta_normalized
                                        ?.last_value?.date_of_report_unix * 1000
                                    }
                                    day="numeric"
                                    month="long"
                                  />
                                ),
                                dateOfInsertion: (
                                  <FormattedDate
                                    value={
                                      state[selectedRegio?.code]
                                        ?.infected_people_delta_normalized
                                        ?.last_value?.date_of_insertion_unix *
                                      1000
                                    }
                                    day="numeric"
                                    month="long"
                                  />
                                ),
                              }}
                            />
                          </p>
                        </DateReported>
                      </>
                    )}
                  </>
                )}
              </GraphContent>

              {selectedRegio && (
                <Collapse
                  openText={intl.formatMessage({
                    id: 'regionaal_positief_geteste_personen.open',
                  })}
                  sluitText={intl.formatMessage({
                    id: 'regionaal_positief_geteste_personen.sluit',
                  })}
                  piwikAction={selectedRegio.name}
                  piwikName="Positief geteste mensen in Amsterdam-Amstelland"
                >
                  <h4>
                    <FormattedMessage id="regionaal_positief_geteste_personen.fold_title" />
                  </h4>
                  <p>
                    <FormattedMessage id="regionaal_positief_geteste_personen.fold" />
                  </p>
                  <h4>
                    <FormattedMessage id="regionaal_positief_geteste_personen.graph_title" />
                  </h4>

                  {state[selectedRegio?.code]?.infected_people_delta_normalized
                    ?.values && (
                    <LineChart
                      values={state[
                        selectedRegio.code
                      ].infected_people_delta_normalized.values.map(
                        (value: any) => ({
                          value: value.infected_people_delta_normalized,
                          date: value.date_of_report_unix,
                        })
                      )}
                    />
                  )}

                  <Metadata
                    dataSource={
                      siteText['regionaal_positief_geteste_personen.bron']
                    }
                  />
                </Collapse>
              )}
            </GraphContainer>
          </div>
        </div>
        <ScreenReaderOnly>
          <button onClick={focusRegioSelect}>
            <FormattedMessage id="terug_naar_regio_selectie.text" />
          </button>
        </ScreenReaderOnly>
      </MaxWidth>
    </>
  );
};

Regio.getLayout = Layout.getLayout({
  ...siteText.regionaal_metadata,
  openGraphImage,
  twitterImage,
});

export default Regio;
