import BarScale from 'components/barScale';
import Collapse from 'components/collapse';
import Metadata from 'components/metadata';
import GraphContainer from 'components/graphContainer';
import GraphContent from 'components/graphContent';
import GraphHeader from 'components/graphHeader';
import DateReported from 'components/dateReported';
import RioolwaterMonitoring from 'assets/rioolwater-monitoring.svg';
import RegionalSewerWaterLineChart from 'components/lineChart/regionalSewerWaterLineChart';

import siteText from 'locale';

import { Regionaal } from 'types/data';
import BarChart from 'components/barChart';
import { SafetyRegion, RegioDataLoading } from 'pages/regio/index';
import formatDate from 'utils/formatDate';
import formatNumber from 'utils/formatNumber';

interface IProps {
  data: Regionaal;
  selectedRegio: SafetyRegion | undefined;
}

export const SewerWater: React.FC<IProps> = ({ data, selectedRegio }) => {
  const text: typeof siteText.regionaal_rioolwater_metingen =
    siteText.regionaal_rioolwater_metingen;

  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader
          Icon={RioolwaterMonitoring}
          title={text.title}
          regio={selectedRegio?.name}
        />

        <p>{text.text}</p>

        {data?.average_sewer_installation_per_region?.last_value.average && (
          <BarScale
            min={0}
            max={100}
            screenReaderText={text.screen_reader_graph_content}
            value={Number(
              data.average_sewer_installation_per_region.last_value.average
            )}
            id="rioolwater_metingen"
            rangeKey="average"
            gradient={[
              {
                color: '#3391CC',
                value: 0,
              },
            ]}
          />
        )}

        {data?.average_sewer_installation_per_region?.last_value && (
          <DateReported
            datumsText={text.datums}
            dateInsertedUnix={
              data.average_sewer_installation_per_region.last_value.week_unix
            }
            dateUnix={
              data.average_sewer_installation_per_region.last_value.week_unix
            }
          />
        )}

        {!selectedRegio && <RegioDataLoading />}
      </GraphContent>

      {selectedRegio && (
        <Collapse
          openText={text.open}
          sluitText={text.sluit}
          piwikName="Rioolwatermeting"
          piwikAction="regionaal"
        >
          {data?.average_sewer_installation_per_region?.values &&
            data?.results_per_sewer_installation_per_region?.values && (
              <>
                <h4>{text.graph_title}</h4>
                <RegionalSewerWaterLineChart
                  averageValues={data?.average_sewer_installation_per_region?.values.map(
                    (value) => {
                      return {
                        ...value,
                        value: value.average,
                        date: value.week_unix,
                      };
                    }
                  )}
                  allValues={data.results_per_sewer_installation_per_region.values.map(
                    (installation) => {
                      return installation.values.map((value) => {
                        return {
                          ...value,
                          value: value.rna_per_ml || 0,
                          date: value.date_measurement_unix,
                        };
                      });
                    }
                  )}
                  text={{
                    average_label_text: text.graph_average_label_text,
                    secondary_label_text: text.graph_secondary_label_text,
                  }}
                />
                <h4>{text.bar_chart_title}</h4>
                <BarChart
                  keys={[
                    text.average,
                    ...data.results_per_sewer_installation_per_region.values.map(
                      (installation) => installation.last_value.rwzi_awzi_name
                    ),
                  ]}
                  data={[
                    {
                      y:
                        data.average_sewer_installation_per_region.last_value
                          .average,
                      color: '#3391CC',
                      label: `${formatDate(
                        data.average_sewer_installation_per_region.last_value
                          .week_unix * 1000,
                        'short'
                      )}: ${formatNumber(
                        data.average_sewer_installation_per_region.last_value
                          .average
                      )}`,
                    },
                    ...data.results_per_sewer_installation_per_region.values.map(
                      (installation) => ({
                        y: installation?.last_value?.rna_per_ml,
                        color: '#C1C1C1',
                        label: installation?.last_value
                          ? `${formatDate(
                              installation.last_value.date_measurement_unix *
                                1000,
                              'short'
                            )}: ${formatNumber(
                              installation.last_value.rna_per_ml
                            )}`
                          : false,
                      })
                    ),
                  ]}
                  axisTitle={text.bar_chart_axis_title}
                />

                <Metadata dataSource={text.bron} />
              </>
            )}
        </Collapse>
      )}
    </GraphContainer>
  );
};
