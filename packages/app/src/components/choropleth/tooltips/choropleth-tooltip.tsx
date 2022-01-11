import { assert } from '@corona-dashboard/common';
import { isDefined } from 'ts-is-present';
import { Markdown } from '~/components/markdown';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { ChoroplethDataItem } from '../logic';
import { TooltipContent } from './tooltip-content';
import { TooltipSubject } from './tooltip-subject';
import { TooltipData } from './types';

type ChoroplethDataItemProps<T extends ChoroplethDataItem> = {
  data: TooltipData<T>;
  dataFormatters?: Partial<Record<keyof T, (input: string | number) => string>>;
};

export function ChoroplethTooltip<T extends ChoroplethDataItem>(
  props: ChoroplethDataItemProps<T>
) {
  const { data, dataFormatters } = props;
  const {
    siteText,
    formatNumber,
    formatPercentage,
    formatDate,
    formatDateFromSeconds,
    formatDateFromMilliseconds,
    formatRelativeDate,
    formatDateSpan,
  } = useIntl();

  const text = siteText.choropleth_tooltip;

  const subject = (
    text as unknown as Record<string, Record<string, Record<string, string>>>
  )[data.map]?.[data.dataConfig.metricProperty as string]?.subject;
  assert(
    isDefined(subject),
    `No tooltip subject found in siteText.choropleth_tooltip.${data.map}.${data.dataConfig.metricProperty}`
  );

  const tooltipContent = (
    text as unknown as Record<string, Record<string, Record<string, string>>>
  )[data.map]?.[data.dataConfig.metricProperty as string]?.content;
  assert(
    isDefined(tooltipContent),
    `No tooltip content found in siteText.choropleth_tooltip.${data.map}.${data.dataConfig.metricProperty}`
  );

  const tooltipVars = {
    ...data.dataItem,
    ...data.dataOptions.tooltipVariables,
  } as Record<string, string | number>;

  const formattedTooltipVars = Object.entries(dataFormatters || {}).reduce(
    (acc, [key, formatter]) => {
      return {
        ...acc,
        [key]: formatter(tooltipVars[key]),
      };
    },
    tooltipVars
  );

  const content = replaceVariablesInText(tooltipContent, formattedTooltipVars, {
    formatNumber,
    formatPercentage,
    formatDate,
    formatDateFromSeconds,
    formatDateFromMilliseconds,
    formatRelativeDate,
    formatDateSpan,
  });

  return (
    <TooltipContent
      title={data.featureName}
      link={
        data.dataOptions.getLink
          ? data.dataOptions.getLink(data.code)
          : undefined
      }
    >
      <TooltipSubject
        subject={replaceVariablesInText(subject, tooltipVars)}
        thresholdValues={data.thresholdValues}
        filterBelow={data.dataItem[data.dataConfig.metricProperty]}
      >
        <Markdown content={content} />
      </TooltipSubject>
    </TooltipContent>
  );
}
