import {
  AgeDemographicConfiguration,
  DataScope,
  DataScopeKey,
  MetricKeys,
} from '@corona-dashboard/common';
import { get } from 'lodash';
import useSWRImmutable from 'swr/immutable';
import { isDefined } from 'ts-is-present';
import { useIntl } from '~/intl';
import { AgeDemographic } from '../age-demographic';
import { ErrorBoundary } from '../error-boundary';
import { Metadata } from '../metadata';
import { InlineLoader } from './inline-loader';
import { getColor } from './logic/get-color';
import { getDataUrl } from './logic/get-data-url';

interface InlineAgeDemographicProps {
  configuration: AgeDemographicConfiguration<
    DataScopeKey,
    MetricKeys<DataScope>
  >;
  startDate?: string;
  endDate?: string;
}

export function InlineAgeDemographic(props: InlineAgeDemographicProps) {
  const { configuration, startDate, endDate } = props;

  const { siteText } = useIntl();

  const dateUrl = getDataUrl(startDate, endDate, configuration);

  const { data } = useSWRImmutable(dateUrl, (url: string) =>
    fetch(url).then((_) => _.json())
  );

  if (!isDefined(data)) {
    return <InlineLoader />;
  }

  const source = get(siteText, configuration.sourceKey.split('.'), '');
  const text = get(siteText, configuration.text.split('.'), '');

  return (
    <ErrorBoundary>
      <AgeDemographic
        accessibility={{ key: configuration.accessibilityKey as any }}
        data={data as { values: any[] }}
        text={text}
        leftMetricProperty={configuration.leftMetricProperty as any}
        rightMetricProperty={configuration.rightMetricProperty as any}
        leftColor={getColor(configuration.leftColor)}
        rightColor={getColor(configuration.rightColor)}
        formatValue={(n) => `${n}`}
        maxDisplayValue={configuration.maxDisplayValue}
      />
      <Metadata source={source} isTileFooter />
    </ErrorBoundary>
  );
}
