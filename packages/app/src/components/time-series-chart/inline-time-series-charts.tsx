import { ChartConfiguration } from '@corona-dashboard/common';
import { get } from 'lodash';
import { useMemo } from 'react';
import useSWRImmutable from 'swr/immutable';
import { isDefined } from 'ts-is-present';
import { ErrorBoundary } from '~/components/error-boundary';
import { Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { TimeSeriesChart } from '.';

interface InlineTimeSeriesChartsProps {
  configuration: ChartConfiguration;
}

export function InlineTimeSeriesCharts(props: InlineTimeSeriesChartsProps) {
  const { configuration } = props;
  const { siteText } = useIntl();

  const { data } = useSWRImmutable(
    `/api/data/timeseries/${configuration.code ?? configuration.area}/${
      configuration.metricName
    }`,
    (url: string) => fetch(url).then((_) => _.json())
  );

  console.dir(data);

  const seriesConfig = useMemo(() => {
    return configuration.metricPropertyConfigs.map((x) => {
      const config: any = {
        type: x.type,
        metricProperty: x.propertyName,
        label: get(siteText, x.labelKey.split('.'), ''),
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
    <ErrorBoundary>
      <TimeSeriesChart
        accessibility={{ key: configuration.accessibilityKey as any }}
        values={data.values}
        seriesConfig={seriesConfig}
        timeframe={configuration.timeframe}
      />
    </ErrorBoundary>
  );
}
