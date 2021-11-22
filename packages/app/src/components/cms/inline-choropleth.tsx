import {
  ChoroplethConfiguration,
  DataScope,
  DataScopeKey,
  MetricKeys,
} from '@corona-dashboard/common';
import { Clock } from '@corona-dashboard/icons';
import { get, isString } from 'lodash';
import useSWRImmutable from 'swr/immutable';
import { isDefined } from 'ts-is-present';
import { useIntl } from '~/intl';
import { SiteText } from '~/locale';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { Box } from '../base';
import { DynamicChoropleth } from '../choropleth';
import { ErrorBoundary } from '../error-boundary';
import { Metadata } from '../metadata';
import { getDataUrl } from './logic/get-data-url';

interface InlineChoroplethProps {
  title: string;
  configuration: ChoroplethConfiguration<DataScopeKey, MetricKeys<DataScope>>;
}

export function InlineChoropleth(props: InlineChoroplethProps) {
  const { configuration, title } = props;

  const { siteText } = useIntl();

  const dateUrl = getDataUrl(undefined, undefined, configuration, 'choropleth');

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

  const dataOptions = {
    getLink: isDefined(configuration.link)
      ? get(useReverseRouter, configuration.link, undefined)
      : undefined,
    tooltipVariables: parseTooltipVariables(
      configuration.tooltipVariables,
      siteText
    ),
  };

  const source = get(siteText, configuration.sourceKey.split('.'), '');

  return (
    <ErrorBoundary>
      <DynamicChoropleth
        accessibility={{
          key: configuration.accessibilityKey as any,
        }}
        map="gm"
        data={data}
        dataConfig={{
          metricName: configuration.metricName,
          metricProperty: configuration.metricProperty as any,
        }}
        dataOptions={dataOptions}
      />
      <Metadata source={source} isTileFooter />
    </ErrorBoundary>
  );
}

function parseTooltipVariables(
  tooltipVarsJson: string | undefined,
  siteText: SiteText
) {
  if (!tooltipVarsJson?.length) {
    return undefined;
  }
  try {
    const varsObject = JSON.parse(tooltipVarsJson);
    return Object.fromEntries(
      Object.entries(varsObject).map(([name, value]) => {
        if (isString(value) && value.startsWith('siteText')) {
          return [
            name,
            get(siteText, value.replace('siteText.', ''), undefined),
          ];
        }
        return [name, value];
      })
    );
  } catch (e) {}
  return undefined;
}
