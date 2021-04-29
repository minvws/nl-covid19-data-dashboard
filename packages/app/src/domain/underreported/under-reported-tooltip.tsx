import { Box } from '~/components/base';
import { TrendValue } from '~/components/line-chart/logic';
import { InlineText } from '~/components/typography';
import { colors } from '~/style/theme';
import { useIntl } from '~/intl';

type UnderReportedTooltipProps<T extends TrendValue> = {
  value: T;
  isInUnderReportedRange: boolean;
  underReportedText: string;
};

export function UnderReportedTooltip<T extends TrendValue>(
  props: UnderReportedTooltipProps<T>
) {
  const { formatDateFromMilliseconds, formatNumber } = useIntl();

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
