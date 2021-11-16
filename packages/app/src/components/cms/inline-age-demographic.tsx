import {
  AgeDemographicConfiguration,
  Color,
  colors,
  DataScope,
  DataScopeKey,
  MetricKeys,
} from '@corona-dashboard/common';
import { Clock } from '@corona-dashboard/icons';
import { get } from 'lodash';
import useSWRImmutable from 'swr/immutable';
import { isDefined } from 'ts-is-present';
import { useIntl } from '~/intl';
import { AgeDemographic } from '../age-demographic';
import { Box } from '../base';
import { ErrorBoundary } from '../error-boundary';
import { Metadata } from '../metadata';
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
    return (
      <Box width="100%">
        <Clock width="3em" height="3em" />
      </Box>
    );
  }

  const source = get(siteText, configuration.sourceKey.split('.'), '');
  const text = get(siteText, configuration.text.split('.'), '');

  return (
    <ErrorBoundary>
      <>
        <AgeDemographic
          accessibility={{ key: configuration.accessibilityKey as any }}
          data={data as { values: any[] }}
          text={text}
          leftMetricProperty={configuration.leftMetricProperty as any}
          rightMetricProperty={configuration.rightMetricProperty as any}
          leftColor={
            get(
              colors,
              ['data'].concat(configuration.leftColor.split('.')),
              colors.data.primary
            ) as Color
          }
          rightColor={
            get(
              colors,
              ['data'].concat(configuration.rightColor.split('.')),
              colors.data.primary
            ) as Color
          }
          formatValue={(n) => `${n}`}
        />
        <Metadata source={source} isTileFooter />
      </>
    </ErrorBoundary>
  );
}
