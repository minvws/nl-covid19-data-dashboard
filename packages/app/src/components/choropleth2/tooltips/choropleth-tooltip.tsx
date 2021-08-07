import { InlineText } from '~/components/typography';
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
        subject={'Subject'}
        thresholdValues={data.thresholdValues}
        filterBelow={123456}
      >
        <InlineText fontWeight="bold">
          {data.metricPropertyFormatter(
            data.dataItem[data.dataConfig.metricProperty]
          )}
        </InlineText>
      </TooltipSubject>
    </TooltipContent>
  );
}
