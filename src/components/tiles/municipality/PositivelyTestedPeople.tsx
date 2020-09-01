import BarScale from 'components/barScale';
import Collapse from 'components/collapse';
import Metadata from 'components/metadata';
import GraphContainer from 'components/graphContainer';
import GraphContent from 'components/graphContent';
import GraphHeader from 'components/graphHeader';
import DateReported from 'components/dateReported';
import LoadingPlaceholder from 'components/loadingPlaceholder';
import { LineChart } from '../index';

import Getest from 'assets/test.svg';

import { MunicipalityMapping, RegioDataLoading } from 'pages/regio/index';

import { Municipal, PositiveTestedPeopleLastValue } from 'types/data';

import siteText from 'locale';

import formatNumber from 'utils/formatNumber';

interface IProps {
  data: Municipal;
  selectedRegio: MunicipalityMapping | undefined;
}

export const PostivelyTestedPeopleMunicipality: React.FC<IProps> = (props) => {
  const { selectedRegio, data } = props;

  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader
          Icon={Getest}
          title={
            siteText.regionaal_municipality_positief_geteste_personen.title
          }
          regio={selectedRegio?.name}
        />

        <p>{siteText.regionaal_municipality_positief_geteste_personen.text}</p>

        {!selectedRegio && <RegioDataLoading />}

        {selectedRegio && (
          <>
            {!data?.positive_tested_people && <LoadingPlaceholder />}
            {data?.positive_tested_people && (
              <BarScale
                min={0}
                max={10}
                value={
                  data.positive_tested_people.last_value.infected_daily_increase
                }
                screenReaderText={
                  siteText.regionaal_municipality_positief_geteste_personen
                    .screen_reader_graph_content
                }
                id="regio_infecties"
                rangeKey="infected_daily_increase"
                gradient={[
                  {
                    color: '#3391CC',
                    value: 0,
                  },
                ]}
              />
            )}

            {data?.positive_tested_people && (
              <>
                <h3>
                  {
                    siteText.regionaal_municipality_positief_geteste_personen
                      .metric_title
                  }{' '}
                  <span style={{ color: '#01689b' }}>
                    {formatNumber(
                      data.positive_tested_people.last_value
                        .infected_daily_total
                    )}
                  </span>
                </h3>
                <DateReported
                  datumsText={
                    siteText.regionaal_municipality_positief_geteste_personen
                      .datums
                  }
                  dateUnix={
                    data.positive_tested_people.last_value.date_of_report_unix
                  }
                  dateInsertedUnix={
                    data.positive_tested_people.last_value
                      .date_of_insertion_unix
                  }
                />
              </>
            )}
          </>
        )}
      </GraphContent>

      {selectedRegio && (
        <Collapse
          openText={
            siteText.regionaal_municipality_positief_geteste_personen.open
          }
          sluitText={
            siteText.regionaal_municipality_positief_geteste_personen.sluit
          }
          piwikAction={selectedRegio.name}
          piwikName="Positief geteste mensen"
        >
          <h4>
            {
              siteText.regionaal_municipality_positief_geteste_personen
                .fold_title
            }
          </h4>
          <p>
            {siteText.regionaal_municipality_positief_geteste_personen.fold}
          </p>
          <h4>
            {
              siteText.regionaal_municipality_positief_geteste_personen
                .graph_title
            }
          </h4>

          {data?.positive_tested_people?.values && (
            <LineChart
              values={data.positive_tested_people.values.map(
                (value: PositiveTestedPeopleLastValue) => ({
                  value: value.infected_daily_total,
                  date: value.date_of_report_unix,
                })
              )}
            />
          )}

          <Metadata
            dataSource={
              siteText.regionaal_municipality_positief_geteste_personen.bron
            }
          />
        </Collapse>
      )}
    </GraphContainer>
  );
};
