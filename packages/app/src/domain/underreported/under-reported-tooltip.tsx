import { formatNumber } from '@corona-dashboard/common';
import { Box } from '~/components-styled/base';
import { TrendValue } from '~/components-styled/line-chart/logic';
import { InlineText } from '~/components-styled/typography';
import { colors } from '~/style/theme';
import { formatDateFromMilliseconds } from '~/utils/formatDate';

type UnderReportedTooltipProps<T extends TrendValue> = {
  value: T;
  isInUnderReportedRange: boolean;
  underReportedText: string;
};

export function UnderReportedTooltip<T extends TrendValue>(
  props: UnderReportedTooltipProps<T>
) {
  const { value, isInUnderReportedRange, underReportedText } = props;

  return (
    <Box display="flex" alignItems="center" flexDirection="column">
      {isInUnderReportedRange && (
        <InlineText fontSize={0} color={colors.annotation}>
          ({underReportedText})
        </InlineText>
      )}
      <Box>
        <InlineText fontWeight="bold">
          {`${formatDateFromMilliseconds(value.__date.getTime(), 'medium')}: `}
        </InlineText>
        {formatNumber(value.__value)}
      </Box>
    </Box>
  );
}
