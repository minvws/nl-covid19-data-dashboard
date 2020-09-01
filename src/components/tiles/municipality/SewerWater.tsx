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

import {
  Municipal,
  SewerMeasurementsLastValue,
  ResultsPerSewerInstallationPerMunicipalityLastValue,
  ResultsPerSewerInstallationPerMunicipalityItem,
} from 'types/data';
import BarChart from 'components/barChart';
import {
  MunicipalityMapping,
  RegioDataLoading,
  RegioNoData,
} from 'pages/regio/index';
import formatDate from 'utils/formatDate';
import formatNumber from 'utils/formatNumber';
import LoadingPlaceholder from 'components/loadingPlaceholder';
import replaceVariablesInText from 'utils/replaceVariablesInText';
import { XrangePointOptionsObject } from 'highcharts';
import { useMemo } from 'react';

interface IProps {
  data: Municipal;
  selectedRegio: MunicipalityMapping | undefined;
}

export const SewerWaterMunicipality: React.FC<IProps> = ({
  data,
  selectedRegio,
}) => {
  const text: typeof siteText.regionaal_municipality_rioolwater_metingen =
    siteText.regionaal_municipality_rioolwater_metingen;

  const averagesAvailable = !!data?.sewer_measurements?.last_value;
  const dataAvailable =
    data?.results_per_sewer_installation_per_municipality?.values?.length !==
      0 || averagesAvailable;

  const {
    barScaleData,
    barScaleValue,
    barScaleUnix,
    orderedSewerInstallations,
    averageValues,
    allValues,
    averageValueKey,
    averageDateKey,
    averageLabelText,
  } = useMemo(() => {
    let barScaleData:
      | ResultsPerSewerInstallationPerMunicipalityLastValue
      | SewerMeasurementsLastValue
      | undefined;
    let barScaleValue: number | undefined;
    let barScaleUnix: number | undefined;
    let orderedSewerInstallations: ResultsPerSewerInstallationPerMunicipalityItem[] = [];
    let averageValues: Array<
      | ResultsPerSewerInstallationPerMunicipalityLastValue
      | SewerMeasurementsLastValue
    > = [];
    let allValues: ResultsPerSewerInstallationPerMunicipalityItem[] = [];
    let averageValueKey: 'rna_per_ml' | 'average' | undefined;
    let averageDateKey: 'week_unix' | 'date_measurement_unix' | undefined;
    let averageLabelText = '';
    let onlyOneRwzi = false;

    if (dataAvailable) {
      onlyOneRwzi =
        data?.results_per_sewer_installation_per_municipality?.values
          ?.length === 1;

      if (onlyOneRwzi) {
        barScaleData =
          data?.results_per_sewer_installation_per_municipality?.values[0]
            .last_value;
        barScaleValue = barScaleData?.rna_per_ml;
        barScaleUnix = barScaleData?.date_measurement_unix;

        averageValues =
          data?.results_per_sewer_installation_per_municipality?.values[0]
            .values || [];
        allValues = [];
        averageValueKey = 'rna_per_ml';
        averageDateKey = 'date_measurement_unix';
        averageLabelText = replaceVariablesInText(
          text.graph_average_label_text_rwzi,
          {
            name:
              data?.results_per_sewer_installation_per_municipality?.values[0]
                .last_value.rwzi_awzi_name,
          }
        );
      } else {
        barScaleData = data?.sewer_measurements?.last_value;

        barScaleValue = barScaleData?.average;
        barScaleUnix = barScaleData?.week_unix;

        orderedSewerInstallations =
          data?.results_per_sewer_installation_per_municipality?.values?.sort(
            (a, b) => {
              return b?.last_value?.rna_per_ml - a?.last_value?.rna_per_ml;
            }
          ) || [];

        averageValues = data?.sewer_measurements?.values || [];
        allValues =
          data?.results_per_sewer_installation_per_municipality?.values || [];
        averageValueKey = 'average';
        averageDateKey = 'week_unix';
        averageLabelText = text.graph_average_label_text;
      }
    }
    return {
      barScaleData,
      barScaleValue,
      barScaleUnix,
      orderedSewerInstallations,
      averageValues,
      allValues,
      averageValueKey,
      averageDateKey,
      averageLabelText,
    };
  }, [data, dataAvailable, text]);

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

        {!dataAvailable && <RegioNoData />}

        {selectedRegio && dataAvailable && (
          <>
            {!barScaleData && <LoadingPlaceholder />}
            {barScaleData && (
              <BarScale
                min={0}
                max={100}
                screenReaderText={text.screen_reader_graph_content}
                value={Number(barScaleValue)}
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

        {barScaleData && dataAvailable && (
          <DateReported
            datumsText={text.datums}
            dateInsertedUnix={barScaleData.date_of_insertion_unix}
            dateUnix={barScaleUnix}
          />
        )}
      </GraphContent>

      {selectedRegio && dataAvailable && (
        <Collapse
          openText={text.open}
          sluitText={text.sluit}
          piwikName="Rioolwatermeting"
          piwikAction="regionaal"
        >
          <h4>{text.fold_title}</h4>
          <p>{text.fold}</p>
          {averageValues && allValues && (
            <>
              <h4>{text.graph_title}</h4>

              <RegionalSewerWaterLineChart
                averageValues={averageValues
                  .map((value: any) => {
                    return {
                      ...value,
                      value: value[averageValueKey as 'rna_per_ml' | 'average'],
                      date:
                        value[
                          averageDateKey as
                            | 'week_unix'
                            | 'date_measurement_unix'
                        ],
                    };
                  })
                  .sort((a: any, b: any) => b.date - a.date)}
                allValues={allValues.map(
                  (
                    installation: ResultsPerSewerInstallationPerMunicipalityItem
                  ) => {
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
                  average_label_text: averageLabelText,
                  secondary_label_text: text.graph_secondary_label_text,
                }}
              />
              {orderedSewerInstallations && averagesAvailable && (
                <>
                  <h4>{text.bar_chart_title}</h4>
                  <BarChart
                    keys={[
                      text.average,
                      ...orderedSewerInstallations.map(
                        (installation) =>
                          installation?.last_value?.rwzi_awzi_name
                      ),
                    ]}
                    data={[
                      {
                        y: data?.sewer_measurements?.last_value.average,
                        color: '#3391CC',
                        label: data?.sewer_measurements?.last_value
                          ? `${formatDate(
                              data.sewer_measurements.last_value.week_unix *
                                1000,
                              'short'
                            )}: ${formatNumber(
                              data.sewer_measurements.last_value.average
                            )}`
                          : false,
                      } as XrangePointOptionsObject,
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
            </>
          )}
        </Collapse>
      )}
    </GraphContainer>
  );
};
