import {
  ChoroplethConfiguration,
  DataScope,
  DataScopeKey,
  MetricKeys,
} from '@corona-dashboard/common';
import { get, isString } from 'lodash';
import useSWRImmutable from 'swr/immutable';
import { isDefined } from 'ts-is-present';
import { useIntl } from '~/intl';
import { SiteText } from '~/locale';
import { useReverseRouter } from '~/utils/use-reverse-router';
import {
  DataOptions,
  DynamicChoropleth,
  OptionalDataConfig,
} from '../choropleth';
import { ChoroplethDataItem } from '../choropleth/logic';
import { ErrorBoundary } from '../error-boundary';
import { Metadata } from '../metadata';
import { InlineLoader } from './inline-loader';
import { getColor } from './logic/get-color';
import { getDataUrl } from './logic/get-data-url';

interface InlineChoroplethProps {
  title: string;
  configuration: ChoroplethConfiguration<DataScopeKey, MetricKeys<DataScope>>;
}

export function InlineChoropleth(props: InlineChoroplethProps) {
  const { configuration } = props;

  const { commonTexts } = useIntl();

  const dateUrl = getDataUrl(undefined, undefined, configuration, 'choropleth');

  const reverseRouter = useReverseRouter();

  const { data } = useSWRImmutable(dateUrl, (url: string) =>
    fetch(url).then((_) => _.json())
  );

  if (!isDefined(data)) {
    return <InlineLoader />;
  }

  const dataOptions: DataOptions = {
    getLink: isDefined(configuration.link)
      ? get(reverseRouter, configuration.link, undefined)
      : undefined,
    tooltipVariables: parseTooltipVariables(
      configuration.tooltipVariables,
      commonTexts
    ),
    highlightSelection: configuration.highlightSelection,
    isPercentage: configuration.isPercentage,
    selectedCode: configuration.selectedCode,
  };

  const dataConfig: OptionalDataConfig<ChoroplethDataItem> = {
    metricName: configuration.metricName,
    metricProperty: configuration.metricProperty as any,
    areaStroke: getColor(configuration.areaStroke),
    areaStrokeWidth: configuration.areaStrokeWidth,
    highlightStroke: getColor(configuration.highlightStroke),
    highlightStrokeWidth: configuration.highlightStrokeWidth,
    hoverFill: getColor(configuration.hoverFill),
    hoverStroke: getColor(configuration.hoverStroke),
    hoverStrokeWidth: configuration.hoverStrokeWidth,
    noDataFillColor: getColor(configuration.noDataFillColor),
  };

  const source = get(commonTexts, configuration.sourceKey.split('.'), '');

  return (
    <ErrorBoundary>
      <DynamicChoropleth
        accessibility={{
          key: configuration.accessibilityKey as any,
        }}
        map="gm"
        data={data}
        dataConfig={dataConfig}
        dataOptions={dataOptions}
      />
      <Metadata source={source} isTileFooter />
    </ErrorBoundary>
  );
}

function parseTooltipVariables(
  tooltipVarsJson: string | undefined,
  commonTexts: SiteText['common']
) {
  if (!tooltipVarsJson?.length) {
    return undefined;
  }
  try {
    const varsObject = JSON.parse(tooltipVarsJson);
    return Object.fromEntries(
      Object.entries(varsObject).map(([name, value]) => {
        if (isString(value) && value.startsWith('commonTexts')) {
          return [
            name,
            get(commonTexts, value.replace('commonTexts.', ''), undefined),
          ];
        }
        return [name, value];
      })
    );
  } catch (e) {
    return undefined;
  }
}
