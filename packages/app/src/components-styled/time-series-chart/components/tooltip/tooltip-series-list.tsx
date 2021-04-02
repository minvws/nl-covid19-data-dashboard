import {
  isDateSpanValue,
  isDateValue,
  TimestampedValue,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { Box } from '~/components-styled/base';
import { InlineText, Text } from '~/components-styled/typography';
import { VisuallyHidden } from '~/components-styled/visually-hidden';
import { SeriesConfig } from '../../logic';
import { SeriesIcon } from '../series-icon';
import { TooltipData } from './types';
import { useIntl } from '~/intl';
import { isPresent } from 'ts-is-present';
import { colors } from '~/style/theme';

export function TooltipSeriesList<T extends TimestampedValue>({
  data: tooltipData,
}: {
  data: TooltipData<T>;
}) {
  const {
    value,
    configIndex,
    config,
    options,
    markNearestPointOnly,
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
      <TooltipList>
        {seriesConfig.map((x, index) => {
          switch (x.type) {
            case 'stacked-area':
              return (
                <TooltipListItem key={index} icon={<SeriesIcon config={x} />}>
                  <TooltipValueContainer>
                    <InlineText mr={2}>{x.shortLabel || x.label}:</InlineText>
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

            case 'range':
              return (
                <TooltipListItem key={index} icon={<SeriesIcon config={x} />}>
                  <TooltipValueContainer>
                    <InlineText mr={2}>{x.shortLabel || x.label}:</InlineText>
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
                  </TooltipValueContainer>
                </TooltipListItem>
              );

            case 'line':
            case 'area':
            case 'bar':
              return (
                <TooltipListItem key={index} icon={<SeriesIcon config={x} />}>
                  <TooltipValueContainer>
                    <InlineText mr={2}>{x.shortLabel || x.label}:</InlineText>
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

            case 'invisible':
              return (
                <TooltipListItem key={index}>
                  <TooltipValueContainer>
                    <InlineText mr={2}>{x.label}:</InlineText>
                    <b>
                      {getValueStringForKey(
                        value,
                        x.metricProperty,
                        x.isPercentage
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

export const TooltipList = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
`;

interface TooltipListItemProps {
  children: ReactNode;
  icon?: ReactNode;
}

function TooltipListItem({ children, icon }: TooltipListItemProps) {
  return (
    <Box
      as="li"
      spacing={2}
      spacingHorizontal
      display="flex"
      alignItems="stretch"
    >
      {icon ? (
        <Box flexShrink={0} display="flex" alignItems="baseline" mt={1}>
          {icon}
        </Box>
      ) : (
        <Box width="1em" mt={1} />
      )}

      <Box flexGrow={1}>{children}</Box>
    </Box>
  );
}

const TooltipValueContainer = styled.span`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: flex-end;
`;
