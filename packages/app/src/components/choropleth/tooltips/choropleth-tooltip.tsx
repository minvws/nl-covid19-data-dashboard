import { assert } from '@corona-dashboard/common';
import { isDefined } from 'ts-is-present';
import { Markdown, VisuallyHidden } from '~/components';
import { Box } from '~/components/base';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { ChoroplethDataItem, isVrData } from '../logic';
import { TooltipContent } from './tooltip-content';
import { TooltipSubject } from './tooltip-subject';
import { TooltipNotification } from './tooltip-notification';
import { TooltipData } from './types';

type ChoroplethDataItemProps<T extends ChoroplethDataItem> = {
  data: TooltipData<T>;
  dataFormatters?: Partial<Record<keyof T, (input: string | number) => string>>;
};

export function ChoroplethTooltip<T extends ChoroplethDataItem>(props: ChoroplethDataItemProps<T>) {
  const { data, dataFormatters } = props;
  const { commonTexts, formatNumber, formatPercentage, formatDate, formatDateFromSeconds, formatDateFromMilliseconds, formatRelativeDate, formatDateSpan } = useIntl();

  const text = commonTexts.choropleth_tooltip;

  const subject = (text as unknown as Record<string, Record<string, Record<string, string>>>)[data.map]?.[data.dataConfig.metricProperty as string]?.subject;
  assert(isDefined(subject), `[${ChoroplethTooltip.name}] No tooltip subject found in siteText.choropleth_tooltip.${data.map}.${data.dataConfig.metricProperty.toString()}`);

  const tooltipContent = (text as unknown as Record<string, Record<string, Record<string, string>>>)[data.map]?.[data.dataConfig.metricProperty as string]?.content;
  assert(isDefined(tooltipContent), `[${ChoroplethTooltip.name}] No tooltip content found in siteText.choropleth_tooltip.${data.map}.${data.dataConfig.metricProperty.toString()}`);

  const tooltipVars = {
    ...data.dataItem,
    ...data.dataOptions.tooltipVariables,
  } as Record<string, string | number>;

  const formattedTooltipVars = Object.entries(dataFormatters || {}).reduce((accumulator, [key, formatter]) => {
    return {
      ...accumulator,
      [key]: formatter(tooltipVars[key]),
    };
  }, tooltipVars);

  const content = replaceVariablesInText(tooltipContent, formattedTooltipVars, {
    formatNumber,
    formatPercentage,
    formatDate,
    formatDateFromSeconds,
    formatDateFromMilliseconds,
    formatRelativeDate,
    formatDateSpan,
  });

  // This line is to make sure the content is readible by screenreaders and does not skip numbers after a new line
  const ariaContent = content.replace(/(\n|\*)/g, '');
  const dataItem = data.dataItem[data.dataConfig.metricProperty];
  const filterBelow = typeof dataItem === 'number' ? dataItem : null;

  const showNotification = tooltipVars?.data_is_outdated;
  let outdatedDataDate;
  let tooltipNotification;
  if (showNotification) {
    tooltipNotification = (text as unknown as Record<string, Record<string, Record<string, string>>>)[data.map]?.[data.dataConfig.metricProperty as string]
      ?.outdated_data_notification;
    assert(
      isDefined(tooltipNotification),
      `[${ChoroplethTooltip.name}] No tooltip notification found in siteText.choropleth_tooltip.${data.map}.${data.dataConfig.metricProperty.toString()}`
    );

    // VRData does not contain the property 'date_end_unix' so 'date_unix' is used instead.
    outdatedDataDate = formatDateFromSeconds(tooltipVars[!isVrData(tooltipVars) ? 'date_end_unix' : 'date_unix'] as number, 'medium');
    tooltipNotification = replaceVariablesInText(tooltipNotification as string, { date: outdatedDataDate });
  }

  return (
    <TooltipContent title={data.featureName} link={data.dataOptions.getLink ? data.dataOptions.getLink(data.code) : undefined}>
      <TooltipSubject subject={replaceVariablesInText(subject, tooltipVars)} thresholdValues={data.thresholdValues} filterBelow={filterBelow}>
        <VisuallyHidden>{ariaContent}</VisuallyHidden>
        <Box aria-hidden>
          <Markdown content={content} />
        </Box>
      </TooltipSubject>

      {showNotification && outdatedDataDate && tooltipNotification && (
        <TooltipNotification ariaContent={tooltipNotification}>
          <Markdown content={tooltipNotification} />
        </TooltipNotification>
      )}
    </TooltipContent>
  );
}
