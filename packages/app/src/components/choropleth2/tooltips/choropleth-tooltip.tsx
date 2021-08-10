import { Markdown } from '~/components/markdown';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { ChoroplethDataItem } from '../logic';
import { TooltipContent } from './tooltip-content';
import { TooltipSubject } from './tooltip-subject';
import { TooltipData } from './types';

type ChoroplethDataItemProps<T extends ChoroplethDataItem> = {
  data: TooltipData<T>;
};

export function ChoroplethTooltip<T extends ChoroplethDataItem>(
  props: ChoroplethDataItemProps<T>
) {
  const { data } = props;
  const { siteText } = useIntl();

  const text = siteText.choropleth_tooltip;

  type Text = typeof text;
  type Map = Text[keyof Text];

  const subject = (
    text as unknown as Record<string, Record<string, Record<string, string>>>
  )[data.map][data.dataConfig.metricProperty as string].subject;

  const tooltipContent = (
    text as unknown as Record<string, Record<string, Record<string, string>>>
  )[data.map][data.dataConfig.metricProperty as string].content;

  const tooltipVars = {
    ...data.dataItem,
    ...data.dataOptions.tooltipVariables,
  } as Record<string, string | number>;

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
        subject={subject}
        thresholdValues={data.thresholdValues}
        filterBelow={data.dataItem[data.dataConfig.metricProperty]}
      >
        <Markdown
          content={replaceVariablesInText(tooltipContent, tooltipVars)}
        />
      </TooltipSubject>
    </TooltipContent>
  );
}
