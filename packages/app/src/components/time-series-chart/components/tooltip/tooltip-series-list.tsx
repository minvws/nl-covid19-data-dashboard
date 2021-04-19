import {
  isDateSpanValue,
  isDateValue,
  TimestampedValue,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { InlineText, Text } from '~/components/typography';
import { VisuallyHidden } from '~/components/visually-hidden';
import { SeriesConfig } from '../../logic';
import { SeriesIcon } from '../series-icon';
import { TooltipData } from './types';
import { useIntl } from '~/intl';
import { isPresent } from 'ts-is-present';
import { colors } from '~/style/theme';

export function TooltipSeriesList<T extends TimestampedValue>({
  data: tooltipData,
  hasTwoColumns,
}: {
  data: TooltipData<T>;
  hasTwoColumns?: boolean;
}) {
  const {
    value,
    configIndex,
    config,
    options,
    markNearestPointOnly,
    displayTooltipValueOnly,
    timespanAnnotation,
  } = tooltipData;

  const { formatDateFromSeconds, formatPercentage, formatNumber } = useIntl();

  /**
   * @TODO move this to a more common location
   */
  function getDateStringFromValue(value: TimestampedValue) {
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
  function getValueStringForKey<T extends TimestampedValue>(
    value: T,
    key: keyof T,
    isPercentage?: boolean
  ) {
    const numberValue = (value[key] as unknown) as number | null;

    return isPresent(numberValue)
      ? isPercentage
        ? `${formatPercentage(numberValue)}%`
        : formatNumber(numberValue)
      : '';
  }

  const dateString = getDateStringFromValue(value);

  const seriesConfig: SeriesConfig<T> = markNearestPointOnly
    ? [config[configIndex]]
    : [...config];

  return (
    <section>
      <VisuallyHidden>{dateString}</VisuallyHidden>

      {timespanAnnotation && (
        <Text fontSize={0} color={colors.annotation} textAlign={'center'}>
          {timespanAnnotation.shortLabel || timespanAnnotation.label}
        </Text>
      )}

      <Box css={css({ columnCount: hasTwoColumns ? 2 : 1 })}>
        <TooltipList>
          {seriesConfig.map((x, index) => {
            switch (x.type) {
              case 'stacked-area':
                return (
                  <TooltipListItem
                    key={index}
                    icon={<SeriesIcon config={x} />}
                    label={x.shortLabel ?? x.label}
                    displayTooltipValueOnly={displayTooltipValueOnly}
                  >
                    <b>
                      {getValueStringForKey(
                        value,
                        x.metricProperty,
                        options.isPercentage
                      )}
                    </b>
                  </TooltipListItem>
                );

              case 'range':
                return (
                  <TooltipListItem
                    key={index}
                    icon={<SeriesIcon config={x} />}
                    label={x.shortLabel ?? x.label}
                    displayTooltipValueOnly={displayTooltipValueOnly}
                  >
                    <b css={css({ whiteSpace: 'nowrap' })}>
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
                  </TooltipListItem>
                );

              case 'line':
              case 'area':
              case 'bar':
                return (
                  <TooltipListItem
                    key={index}
                    icon={<SeriesIcon config={x} />}
                    label={x.shortLabel ?? x.label}
                    displayTooltipValueOnly={displayTooltipValueOnly}
                  >
                    <b>
                      {getValueStringForKey(
                        value,
                        x.metricProperty,
                        options.isPercentage
                      )}
                    </b>
                  </TooltipListItem>
                );

              case 'invisible':
                return (
                  <TooltipListItem
                    key={index}
                    label={x.label}
                    displayTooltipValueOnly={displayTooltipValueOnly}
                  >
                    <b>
                      {getValueStringForKey(
                        value,
                        x.metricProperty,
                        x.isPercentage
                      )}
                    </b>
                  </TooltipListItem>
                );
            }
          })}
        </TooltipList>
      </Box>
    </section>
  );
}

export const TooltipList = styled.ol(
  css({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, auto)',
    m: 0,
    p: 0,
    listStyle: 'none',
  })
);

interface TooltipListItemProps {
  children: ReactNode;
  label?: string;
  icon?: ReactNode;
  displayTooltipValueOnly?: boolean;
}

function TooltipListItem({
  children,
  icon,
  label,
  displayTooltipValueOnly,
}: TooltipListItemProps) {
  return (
    <>
      {displayTooltipValueOnly ? (
        <>
          <VisuallyHidden>
            <InlineText mr={2}>{label}:</InlineText>
          </VisuallyHidden>
          <Box css={css({ gridColumn: 'span 2' })}>{children}</Box>
        </>
      ) : (
        <>
          {icon ? (
            <Box mt={1} mr={2}>
              {icon}
            </Box>
          ) : (
            <Box width="1em" mt={1} mr={2} />
          )}
          <InlineText mr={2}>{label}:</InlineText>
          <Box>{children}</Box>
        </>
      )}
    </>
  );
}
