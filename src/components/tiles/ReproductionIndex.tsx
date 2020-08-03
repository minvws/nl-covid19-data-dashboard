import { useContext } from 'react';

import { FormattedMessage, FormattedDate, useIntl } from 'react-intl';

import BarScale from 'components/barScale';
import Collapse from 'components/collapse';
import Metadata from 'components/metadata';
import Legenda from 'components/legenda';
import GraphContainer from 'components/graphContainer';
import GraphContent from 'components/graphContent';
import GraphHeader from 'components/graphHeader';
import { DateReported } from 'components/dateReported';
import Repro from 'assets/reproductiegetal.svg';
import { AreaChart } from './index';

import siteText from 'locale';
import { store } from 'store';

import { ReproductionIndex as ReproductionIndexData } from 'types/data';

export const ReproductionIndex: React.FC = () => {
  const globalState = useContext(store);
  const { state } = globalState;

  const lastKnownValidData: ReproductionIndexData | undefined =
    state?.NL?.reproduction_index_last_known_average;

  const data: ReproductionIndexData | undefined = state?.NL?.reproduction_index;

  const intl = useIntl();

  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader
          Icon={Repro}
          title={intl.formatMessage({
            id: 'reproductiegetal.title',
          })}
        />

        <p>
          <FormattedMessage id="reproductiegetal.text" />
        </p>
        {data && (
          <BarScale
            min={0}
            max={2}
            screenReaderText={intl.formatMessage(
              {
                id: 'reproductiegetal.screen_reader_graph_content',
              },
              {
                value: lastKnownValidData?.last_value?.reproduction_index_avg,
                kritiekeWaarde: intl.formatMessage({
                  id: 'reproductiegetal.signaalwaarde',
                }),
              }
            )}
            kritiekeWaarde={Number(
              intl.formatMessage({
                id: 'reproductiegetal.signaalwaarde',
              })
            )}
            value={lastKnownValidData?.last_value?.reproduction_index_avg}
            id="repro"
            gradient={[
              {
                color: '#69c253',
                value: 0,
              },
              {
                color: '#69c253',
                value: 1,
              },
              {
                color: '#D3A500',
                value: 1.0104,
              },
              {
                color: '#f35065',
                value: 1.125,
              },
            ]}
          />
        )}

        {lastKnownValidData ? (
          <DateReported>
            <FormattedMessage
              id="reproductiegetal.datums"
              values={{
                dateOfReport: (
                  <FormattedDate
                    value={
                      lastKnownValidData?.last_value?.date_of_report_unix * 1000
                    }
                    month="long"
                    day="numeric"
                  />
                ),
                dateOfInsertion: (
                  <FormattedDate
                    value={
                      lastKnownValidData?.last_value?.date_of_insertion_unix *
                      1000
                    }
                    month="long"
                    day="numeric"
                  />
                ),
              }}
            />
          </DateReported>
        ) : null}
      </GraphContent>

      <Collapse
        openText={intl.formatMessage({
          id: 'reproductiegetal.open',
        })}
        sluitText={intl.formatMessage({
          id: 'reproductiegetal.sluit',
        })}
        piwikName="Reproductiegetal"
        piwikAction="landelijk"
      >
        <h4>
          <FormattedMessage id="reproductiegetal.fold_title" />
        </h4>
        <p>
          <FormattedMessage id="reproductiegetal.fold" />
        </p>

        <img
          width={315}
          height={100}
          loading="lazy"
          src="/images/reproductie-explainer.svg"
          alt="Ondersteunende afbeelding bij bovenstaande uitleg"
        />

        <h4>
          <FormattedMessage id="reproductiegetal.graph_title" />
        </h4>
        {data?.values && (
          <AreaChart
            data={data.values.map((value) => ({
              avg: value.reproduction_index_avg,
              min: value.reproduction_index_low,
              max: value.reproduction_index_high,
              date: value.date_of_report_unix,
            }))}
            minY={0}
            maxY={4}
            signaalwaarde={1}
            rangeLegendLabel={intl.formatMessage({
              id: 'reproductiegetal.rangeLegendLabel',
            })}
            lineLegendLabel={intl.formatMessage({
              id: 'reproductiegetal.lineLegendLabel',
            })}
          />
        )}

        <Legenda>
          <li className="blue">
            <FormattedMessage id="reproductiegetal.legenda_r" />
          </li>
          <li className="gray square">
            <FormattedMessage id="reproductiegetal.legenda_marge" />
          </li>
        </Legenda>

        <Metadata dataSource={siteText['reproductiegetal.bron']} />
      </Collapse>
    </GraphContainer>
  );
};
