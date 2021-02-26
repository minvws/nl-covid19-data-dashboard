/**
 * This component uses the VisX tooltip. It mainly exists to bundle the styling
 * and default tooltip formatting logic into a single place.
 *
 * The default tooltip can now display the full contents of the series config
 * with colors and all, instead of a single default item.
 */
import {
  isDateSpanValue,
  isDateValue,
  TimestampedValue,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import { defaultStyles, TooltipWithBounds } from '@visx/tooltip';
import styled from 'styled-components';
import { Heading } from '~/components-styled/typography';
import { VisuallyHidden } from '~/components-styled/visually-hidden';
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
   * look up the value from T and highlight it.
   */
  valueKey: keyof T;
  /**
   * The full series config is passed to the tooltip so we can render whatever
   * is needed.
   */
  config: SeriesConfig<T>;
};

export type TooltipFormatter<T extends TimestampedValue> = (args: {
  value: T;
  valueKey: keyof T;
  config: SeriesConfig<T>;
  isPercentage?: boolean;
}) => React.ReactNode;

interface TooltipProps<T extends TimestampedValue> {
  title: string;
  data?: TooltipData<T>;
  isOpen: boolean;
  left: number;
  top: number;
  formatTooltip?: TooltipFormatter<T>;
  isPercentage?: boolean;
}

export function Tooltip<T extends TimestampedValue>({
  title,
  data: tooltipData,
  isOpen,
  left,
  top,
  formatTooltip,
  isPercentage,
}: TooltipProps<T>) {
  const breakpoints = useBreakpoints();
  const isTinyScreen = !breakpoints.xs;

  if (!isOpen || !tooltipData) {
    return null;
  }

  return (
    <TooltipWithBounds
      left={left}
      top={top}
      style={tooltipStyles}
      offsetLeft={isTinyScreen ? 0 : 50}
    >
      <TooltipContainer>
        {typeof formatTooltip === 'function' ? (
          formatTooltip(tooltipData)
        ) : (
          <DefaultTooltip
            title={title}
            {...tooltipData}
            isPercentage={isPercentage}
          />
        )}
      </TooltipContainer>
    </TooltipWithBounds>
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

interface DefaultTooltipProps<T extends TimestampedValue> {
  title: string;
  value: T;
  valueKey: keyof T;
  config: SeriesConfig<T>;
  isPercentage?: boolean;
}

export function DefaultTooltip<T extends TimestampedValue>({
  title,
  value,
  valueKey,
  config,
  isPercentage,
}: DefaultTooltipProps<T>) {
  const dateString = getDateStringFromValue(value);

  return (
    <section>
      <Heading level={5} mb={1}>
        {title}
      </Heading>
      <VisuallyHidden>{dateString}</VisuallyHidden>
      <span>Debug: {valueKey}</span>
      <TooltipList>
        {[...config].reverse().map((x, index) => {
          if (x.type === 'range') {
            return (
              <TooltipListItem key={index} color={x.color}>
                <TooltipValueContainer>
                  {x.label}:{' '}
                  <b>
                    {`${getValueStringForKey(
                      value,
                      x.metricPropertyLow,
                      isPercentage
                    )} - ${getValueStringForKey(
                      value,
                      x.metricPropertyHigh,
                      isPercentage
                    )}`}
                  </b>
                </TooltipValueContainer>
              </TooltipListItem>
            );
          } else {
            return (
              <TooltipListItem key={index} color={x.color}>
                <TooltipValueContainer>
                  {x.label}:{' '}
                  <b>
                    {getValueStringForKey(
                      value,
                      x.metricProperty,
                      isPercentage
                    )}
                  </b>
                </TooltipValueContainer>
              </TooltipListItem>
            );
          }
        })}
      </TooltipList>
    </section>
  );
}

const TooltipList = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
`;

interface TooltipListItemProps {
  color: string;
}

const TooltipListItem = styled.li<TooltipListItemProps>`
  display: flex;
  align-items: center;

  &::before {
    content: '';
    display: inline-block;
    height: 8px;
    width: 8px;
    border-radius: 50%;
    background: ${(props) => props.color};
    margin-right: 0.5em;
    flex-shrink: 0;
  }
`;

const TooltipValueContainer = styled.span`
  display: flex;
  width: 100%;
  min-width: 120px;
  justify-content: space-between;
`;

/**
 * @TODO move this to a more common location
 */
export function getDateStringFromValue(value: TimestampedValue) {
  if (isDateValue(value)) {
    return formatDateFromSeconds(value.date_unix);
  } else if (isDateSpanValue(value)) {
    const dateStartString = formatDateFromSeconds(
      value.date_start_unix,
      'axis'
    );
    const dateEndString = formatDateFromSeconds(value.date_end_unix, 'axis');

    return `${dateStartString} - ${dateEndString}`;
  }
}

/**
 * @TODO move this to a more common location
 */
export function getValueStringForKey<T extends TimestampedValue>(
  value: T,
  key: keyof T,
  isPercentage?: boolean
) {
  const numberValue = (value[key] as unknown) as number | null;

  return numberValue
    ? isPercentage
      ? `${formatPercentage(numberValue)}%`
      : formatNumber(numberValue)
    : '';
}
