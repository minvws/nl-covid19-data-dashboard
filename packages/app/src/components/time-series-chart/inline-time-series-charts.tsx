import { ChartConfiguration } from '@corona-dashboard/common';
import { useMemo } from 'react';
import useSWRImmutable from 'swr/immutable';
import { isDefined } from 'ts-is-present';
import { Text } from '~/components/typography';
import { colors } from '~/style/theme';
import { TimeSeriesChart } from '.';

interface InlineTimeSeriesChartsProps {
  configuration: ChartConfiguration;
}

export function InlineTimeSeriesCharts(props: InlineTimeSeriesChartsProps) {
  const { configuration } = props;

  const { data } = useSWRImmutable(
    `/api/data/${configuration.area}/${configuration.metricName}`,
    (url: string) => fetch(url).then((_) => _.json())
  );

  const seriesConfig = useMemo(() => {
    return configuration.metricPropertyConfigs.map((x) => {
      const config: any = {
        type: x.type,
        metricProperty: x.propertyName,
        label: 'label',
        color: colors.data.primary,
      };
      if (x.curve) {
        config.curve = x.curve;
      }
      return config;
    });
  }, [configuration.metricPropertyConfigs]);

  if (!isDefined(data)) {
    return <Text>Loading...</Text>;
  }

  return (
    <TimeSeriesChart
      accessibility={{ key: 'behavior_choropleths' }}
      values={data.values}
      seriesConfig={seriesConfig}
    />
  );
}
