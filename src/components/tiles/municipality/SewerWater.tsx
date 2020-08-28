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

import { RegionaalMunicipality } from 'types/data';
import BarChart from 'components/barChart';
import { MunicipalityMapping, RegioDataLoading } from 'pages/regio/index';
import formatDate from 'utils/formatDate';
import formatNumber from 'utils/formatNumber';
import LoadingPlaceholder from 'components/loadingPlaceholder';

interface IProps {
  data: RegionaalMunicipality;
  selectedRegio: MunicipalityMapping | undefined;
}

export const SewerWaterMunicipality: React.FC<IProps> = ({
  data,
  selectedRegio,
}) => {
  const text: typeof siteText.regionaal_municipality_rioolwater_metingen =
    siteText.regionaal_municipality_rioolwater_metingen;

  const orderedSewerInstallations =
    data?.results_per_sewer_installation_per_municipality?.values?.sort(
      (a, b) => {
        return b?.last_value?.rna_per_ml - a?.last_value?.rna_per_ml;
      }
    ) || [];

  return (
    <GraphContainer>
      <GraphContent>
        <GraphHeader
          Icon={RioolwaterMonitoring}
          title={text.title}
          regio={selectedRegio?.name}
        />

        <p>{text.text}</p>

        {!selectedRegio && <RegioDataLoading />}

        {selectedRegio && (
          <>
            {!data?.sewer_measurements?.last_value && <LoadingPlaceholder />}
            {data?.sewer_measurements?.last_value && (
              <BarScale
                min={0}
                max={100}
                screenReaderText={text.screen_reader_graph_content}
                value={Number(data.sewer_measurements.last_value.average)}
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
          </>
        )}

        {data?.sewer_measurements?.last_value && (
          <DateReported
            datumsText={text.datums}
            dateInsertedUnix={
              data.sewer_measurements.last_value.date_of_insertion_unix
            }
            dateUnix={data.sewer_measurements.last_value.week_unix}
          />
        )}
      </GraphContent>

      {selectedRegio && (
        <Collapse
          openText={text.open}
          sluitText={text.sluit}
          piwikName="Rioolwatermeting"
          piwikAction="regionaal"
        >
          <h4>{text.fold_title}</h4>
          <p>{text.fold}</p>
          {data?.sewer_measurements?.values &&
            data?.results_per_sewer_installation_per_municipality?.values && (
              <>
                <h4>{text.graph_title}</h4>
                <RegionalSewerWaterLineChart
                  averageValues={data?.sewer_measurements?.values.map(
                    (value: any) => {
                      return {
                        ...value,
                        value: value.average,
                        date: value.week_unix,
                      };
                    }
                  )}
                  allValues={data.results_per_sewer_installation_per_municipality.values.map(
                    (installation) => {
                      return installation?.values
                        .map((value) => {
                          return {
                            ...value,
                            value: value.rna_per_ml || 0,
                            date: value.date_measurement_unix,
                          };
                        })
                        .sort((a, b) => b.date - a.date);
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
                    ...orderedSewerInstallations.map(
                      (installation) => installation?.last_value?.rwzi_awzi_name
                    ),
                  ]}
                  data={[
                    {
                      y: data.sewer_measurements.last_value.average,
                      color: '#3391CC',
                      label: `${formatDate(
                        data.sewer_measurements.last_value.week_unix * 1000,
                        'short'
                      )}: ${formatNumber(
                        data.sewer_measurements.last_value.average
                      )}`,
                    },
                    ...orderedSewerInstallations.map((installation) => ({
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
                    })),
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
