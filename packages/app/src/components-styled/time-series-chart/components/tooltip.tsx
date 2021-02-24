/**
 * This component uses the VisX tooltip. It mainly exists to bundle the styling
 * and default tooltip formatting logic into a single place
 */
import {
  isDateSpanValue,
  isDateValue,
  TimestampedValue,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import { defaultStyles, TooltipWithBounds } from '@visx/tooltip';
import styled from 'styled-components';
import { Text } from '~/components-styled/typography';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { useBreakpoints } from '~/utils/useBreakpoints';
import { SeriesConfig } from '../logic';

const tooltipStyles = {
  ...defaultStyles,
  padding: 0,
  zIndex: 100,
};

export type TooltipData<T extends TimestampedValue> = {
  value: T;
  /**
   * The metric key of the nearest / active hover point. This can be used to
   * loop up the value from T and highlight it.
   */
  key: keyof T;
  /**
   * The full series config is passed to the tooltip so we can render whatever
   * is needed.
   */
  seriesConfig: SeriesConfig<T>[];
  /**
   * This is not used yet, but might come in handy. It signals what trend index
   * the nearest / active point is, and can be used to lookup the configuration
   * in the seriesConfig.
   */
  seriesConfigIndex: number;
};

export type TooltipFormatter<T extends TimestampedValue> = (
  value: T,
  key: keyof T,
  seriesConfig: SeriesConfig<T>[]
) => React.ReactNode;

interface TooltipProps<T extends TimestampedValue> {
  data?: TooltipData<T>;
  isOpen: boolean;
  left: number;
  top: number;
  formatTooltip?: TooltipFormatter<T>;
}

export function Tooltip<T extends TimestampedValue>({
  data,
  isOpen,
  left,
  top,
  formatTooltip,
}: TooltipProps<T>) {
  const breakpoints = useBreakpoints();
  const isTinyScreen = !breakpoints.xs;

  if (!isOpen || !data) {
    return null;
  }

  const { value, key, seriesConfig } = data;

  return (
    <TooltipWithBounds
      left={left}
      top={top}
      style={tooltipStyles}
      offsetLeft={isTinyScreen ? 0 : 50}
    >
      <TooltipContainer>
        {typeof formatTooltip === 'function'
          ? formatTooltip(value, key, seriesConfig)
          : formatDefaultTooltip(value, key, seriesConfig)}
      </TooltipContainer>
    </TooltipWithBounds>
  );
}

export function formatDefaultTooltip<T extends TimestampedValue>(
  value: T,
  key: keyof T,
  _seriesConfig: SeriesConfig<T>[],
  isPercentage?: boolean
) {
  // default tooltip assumes one line is rendered:

  const numberValue = (value[key] as unknown) as number;

  if (isDateValue(value)) {
    return (
      <>
        <Text as="span" fontWeight="bold">
          {`${formatDateFromSeconds(value.date_unix)}: `}
        </Text>
        {isPercentage
          ? `${formatPercentage(numberValue)}%`
          : formatNumber(numberValue)}
      </>
    );
  } else if (isDateSpanValue(value)) {
    const dateStartString = formatDateFromSeconds(
      value.date_start_unix,
      'day-month'
    );
    const dateEndString = formatDateFromSeconds(
      value.date_end_unix,
      'day-month'
    );

    return (
      <>
        <Text as="span" fontWeight="bold">
          {`${dateStartString} - ${dateEndString}: `}
        </Text>
        {isPercentage
          ? `${formatPercentage(numberValue)}%`
          : formatNumber(numberValue)}
      </>
    );
  }

  throw new Error(
    `Invalid value passed to format tooltip function: ${JSON.stringify(value)}`
  );
}

export const TooltipContainer = styled.div(
  css({
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    minWidth: 72,
    color: 'body',
    backgroundColor: 'white',
    lineHeight: 2,
    borderColor: 'border',
    borderWidth: '1px',
    borderStyle: 'solid',
    px: 2,
    py: 1,
    fontSize: 1,
  })
);
