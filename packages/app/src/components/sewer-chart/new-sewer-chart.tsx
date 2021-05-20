import {
  MunicipalSewer,
  RegionalSewer,
  SewerPerInstallationData,
} from '@corona-dashboard/common';
import { Select } from '~/components/select';
import { useSewerStationSelectPropsSimplified } from '~/components/sewer-chart/logic';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { useIntl } from '~/intl';
import { SiteText } from '~/locale';
import { colors } from '~/style/theme';
import { ChartTile } from '../chart-tile';

export function NewSewerChart({
  dataAverages,
  dataPerInstallation,
}: {
  dataAverages: RegionalSewer | MunicipalSewer;
  dataPerInstallation?: SewerPerInstallationData;
  siteText: SiteText;
}) {
  const { siteText } = useIntl();

  const text = siteText.veiligheidsregio_rioolwater_metingen;

  const {
    options,
    value: selectedInstallation,
    onChange,
    onClear,
  } = useSewerStationSelectPropsSimplified(
    dataPerInstallation ??
      ({
        values: [
          {
            rwzi_awzi_name: '__no_installations',
          },
        ],
      } as SewerPerInstallationData)
  );

  const mergedValues = dataAverages.values.map((x) => ({
    ...x,
    /**
     * @TODO pick the right value based on timestamp
     */
    selected_instalation_value: selectedInstallation
      ? Math.random() * 400
      : null,
  }));

  return (
    <ChartTile
      timeframeOptions={['all', '5weeks']}
      title={text.linechart_titel}
      metadata={{
        source: text.bronnen.rivm,
      }}
      description={text.linechart_description}
    >
      {(timeframe) => (
        <div>
          <Select
            options={options}
            onChange={onChange}
            onClear={onClear}
            value={selectedInstallation}
          />
          <TimeSeriesChart
            values={mergedValues}
            timeframe={timeframe}
            seriesConfig={[
              {
                type: 'line',
                metricProperty: 'selected_instalation_value',
                label: 'Weekgemiddelde',
                color: 'hotpink',
              },
              {
                type: 'split-area',
                metricProperty: 'average',
                label: 'Weekgemiddelde',
                splitPoints: [
                  {
                    value: 200,
                    color: colors.data.scale.blue[0],
                    label: '0 - 200',
                  },
                  {
                    value: 400,
                    color: colors.data.scale.blue[1],
                    label: '200 - 400',
                  },
                  {
                    value: 600,
                    color: colors.data.scale.blue[2],
                    // color: 'hotpink',
                    label: '400 - 600',
                  },
                  {
                    value: 800,
                    color: colors.data.scale.blue[3],
                    label: '600 - 800',
                  },
                  {
                    value: Infinity,
                    color: colors.data.scale.blue[4],
                    label: '800 - 1000',
                  },
                ],
              },
            ]}
            dataOptions={{
              valueAnnotation: siteText.waarde_annotaties.riool_normalized,
            }}
          />
        </div>
      )}
    </ChartTile>
  );
}
