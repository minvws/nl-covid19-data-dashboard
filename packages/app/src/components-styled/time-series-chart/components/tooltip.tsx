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
import { Heading, InlineText } from '~/components-styled/typography';
import { VisuallyHidden } from '~/components-styled/visually-hidden';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { useBreakpoints } from '~/utils/useBreakpoints';
import { DataOptions, SeriesConfig, TimespanAnnotationConfig } from '../logic';

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

  /**
   * The options are also essential to know whether to format percentages or
   * show date span annotation labels.
   */
  options: DataOptions;

  /**
   * When hovering a date span annotation, the tooltip needs to know about it so
   * that it can render the label accordingly. I am assuming here that we won't
   * ever define overlapping annotations for now.
   */
  timespanAnnotation?: TimespanAnnotationConfig;
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
}

export function Tooltip<T extends TimestampedValue>({
  title,
  data: tooltipData,
  isOpen,
  left,
  top,
  formatTooltip,
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
          <DefaultTooltip title={title} {...tooltipData} />
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
  options: DataOptions;
  timespanAnnotation?: TimespanAnnotationConfig;
}

export function DefaultTooltip<T extends TimestampedValue>({
  title,
  value,
  valueKey: __valueKey,
  config,
  options,
  timespanAnnotation: __timespanAnnotation,
}: DefaultTooltipProps<T>) {
  const dateString = getDateStringFromValue(value);

  return (
    <section>
      <Heading level={5} mb={1}>
        {title}
      </Heading>
      <VisuallyHidden>{dateString}</VisuallyHidden>

      <TooltipList>
        {[...config].reverse().map((x, index) => {
          if (x.type === 'range') {
            return (
              <TooltipListItem key={index} color={x.color}>
                <TooltipValueContainer>
                  <InlineText mr={2}>{x.label}:</InlineText>
                  <b>
                    {`${getValueStringForKey(
                      value,
                      x.metricPropertyLow,
                      options.isPercentage
                    )} - ${getValueStringForKey(
                      value,
                      x.metricPropertyHigh,
                      options.isPercentage
                    )}`}
                  </b>
                </TooltipValueContainer>
              </TooltipListItem>
            );
          } else {
            return (
              <TooltipListItem key={index} color={x.color}>
                <TooltipValueContainer>
                  <InlineText mr={2}>{x.label}:</InlineText>
                  <b>
                    {getValueStringForKey(
                      value,
                      x.metricProperty,
                      options.isPercentage
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
