import { KpiConfiguration } from '@corona-dashboard/common';
import { get } from 'lodash';
import useSWRImmutable from 'swr/immutable';
import { isDefined } from 'ts-is-present';
import { ErrorBoundary } from '~/components/error-boundary';
import { KpiTile } from '~/components/kpi-tile';
import { PageKpi } from '~/components/page-kpi';
import { Text } from '~/components/typography';
import { useIntl } from '~/intl';

interface InlineKpiProps {
  configuration: KpiConfiguration;
}

export function InlineKpi({ configuration }: InlineKpiProps) {
  const { siteText } = useIntl();

  const { data } = useSWRImmutable(
    `/api/data/timeseries/${configuration.code ?? configuration.area}/${
      configuration.metricName
    }`,
    (url: string) => fetch(url).then((_) => _.json())
  );
  const { data: differenceData } = useDifferenceData(configuration);

  if (!isDefined(data) || !isDefined(differenceData)) {
    return <Text>Loading...</Text>;
  }

  const allData =
    isDefined(configuration.differenceKey) && configuration.differenceKey.length
      ? {
          [configuration.metricName]: {
            ...data,
          },
          difference: {
            [configuration.differenceKey]: differenceData,
          },
        }
      : {
          [configuration.metricName]: {
            ...data,
          },
        };

  const title = get(siteText, configuration.titleKey.split('.'), '');

  return (
    <ErrorBoundary>
      <KpiTile title={title}>
        {isDefined(configuration.differenceKey) &&
          configuration.differenceKey.length && (
            <PageKpi
              data={allData}
              metricName={configuration.metricName}
              metricProperty={configuration.metricProperty}
              differenceKey={configuration.differenceKey}
              isMovingAverageDifference={
                configuration.isMovingAverageDifference
              }
              isAmount={configuration.isAmount}
            />
          )}
        {(!isDefined(configuration.differenceKey) ||
          !configuration.differenceKey.length) && (
          <PageKpi
            data={allData}
            metricName={configuration.metricName}
            metricProperty={configuration.metricProperty}
            isAmount={configuration.isAmount}
          />
        )}
      </KpiTile>
    </ErrorBoundary>
  );
}

function useDifferenceData(configuration: KpiConfiguration) {
  if (!isDefined(configuration.differenceKey)) {
    return { data: null };
  }
  return useSWRImmutable(
    `/api/data/timeseries/${
      configuration.code ?? configuration.area
    }/difference/${configuration.differenceKey}`,
    (url: string) => fetch(url).then((_) => _.json())
  );
}
