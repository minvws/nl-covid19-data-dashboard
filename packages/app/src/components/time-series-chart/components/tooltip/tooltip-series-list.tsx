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

  const {
    formatDateFromSeconds,
    formatPercentage,
    formatNumber,
    formatDateSpan,
  } = useIntl();

  /**
   * @TODO move this to a more common location
   */
  function getDateStringFromValue(value: TimestampedValue) {
    if (isDateValue(value)) {
      return formatDateFromSeconds(value.date_unix, 'medium');
    } else if (isDateSpanValue(value)) {
      const [start, end] = formatDateSpan(
        { seconds: value.date_start_unix },
        { seconds: value.date_end_unix },
        'medium'
      );
      return `${start} – ${end}`;
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
      : '–';
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
      <TooltipList hasTwoColumns={hasTwoColumns}>
        {seriesConfig.map((x, index) => {
          /**
           * The key is unique for every date to make sure a screenreader
           * will read `[label]: [value]`. Otherwise it would read the
           * changed content which would only be `[value]` and thus miss some
           * context.
           */
          const key = index + getDateUnixString(value);

          switch (x.type) {
            case 'stacked-area':
              return (
                <TooltipListItem
                  key={key}
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
                  key={key}
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
                  key={key}
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
                  key={key}
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
    </section>
  );
}

export const TooltipList = styled.ol<{ hasTwoColumns?: boolean }>(
  ({ hasTwoColumns }) =>
    css({
      columns: hasTwoColumns ? 2 : 1,
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
    <Box
      as="li"
      spacing={2}
      spacingHorizontal
      display="flex"
      alignItems="stretch"
    >
      {displayTooltipValueOnly ? (
        <Box flexGrow={1}>
          <TooltipValueContainer>
            <VisuallyHidden>
              <InlineText mr={2}>{label}:</InlineText>
            </VisuallyHidden>
            {children}
          </TooltipValueContainer>
        </Box>
      ) : (
        <>
          {icon ? (
            <Box flexShrink={0} display="flex" alignItems="baseline" mt={1}>
              {icon}
            </Box>
          ) : (
            <Box width="1em" mt={1} />
          )}
          <Box flexGrow={1}>
            <TooltipValueContainer>
              <InlineText mr={2}>{label}:</InlineText>
              {children}
            </TooltipValueContainer>
          </Box>
        </>
      )}
    </Box>
  );
}

const TooltipValueContainer = styled.span`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: flex-end;
`;

function getDateUnixString(value: TimestampedValue) {
  return 'date_unix' in value
    ? `${value.date_unix}`
    : `${value.date_start_unix}-${value.date_end_unix}`;
}
