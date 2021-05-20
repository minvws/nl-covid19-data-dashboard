import {
  isDateSpanValue,
  isDateValue,
  TimestampedValue,
} from '@corona-dashboard/common';
import { useIntl } from '~/intl';
import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { InlineText, Text } from '~/components/typography';
import { VisuallyHidden } from '~/components/visually-hidden';
import { SeriesConfig, useFormatSeriesValue } from '../../logic';
import { SeriesIcon } from '../series-icon';
import { TooltipData } from './types';
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
    valueMinWidth,
  } = tooltipData;

  const { formatDateFromSeconds } = useIntl();

  const formatSeriesValue = useFormatSeriesValue();

  const getDateStringFromValue = (value: TimestampedValue) => {
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
  };

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
      <TooltipList hasTwoColumns={hasTwoColumns} valueMinWidth={valueMinWidth}>
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
                  <b>{formatSeriesValue(value, x, options.isPercentage)}</b>
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
                    {formatSeriesValue(value, x, options.isPercentage)}
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
                  <b>{formatSeriesValue(value, x, options.isPercentage)}</b>
                </TooltipListItem>
              );

            case 'split-bar':
              return (
                <TooltipListItem
                  key={key}
                  icon={
                    <SeriesIcon
                      config={x}
                      value={
                        value[x.metricProperty] as unknown as number | null
                      }
                    />
                  }
                  label={x.shortLabel ?? x.label}
                  displayTooltipValueOnly={displayTooltipValueOnly}
                >
                  <b>{formatSeriesValue(value, x, options.isPercentage)}</b>
                </TooltipListItem>
              );
          }
        })}
      </TooltipList>
    </section>
  );
}

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
          <TooltipEntryContainer>
            <VisuallyHidden>
              <InlineText mr={2}>{label}:</InlineText>
            </VisuallyHidden>
            <TooltipEntryValue>{children}</TooltipEntryValue>
          </TooltipEntryContainer>
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
            <TooltipEntryContainer>
              <InlineText mr={2}>{label}:</InlineText>
              <TooltipEntryValue>{children}</TooltipEntryValue>
            </TooltipEntryContainer>
          </Box>
        </>
      )}
    </Box>
  );
}

const TooltipEntryContainer = styled.span`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: flex-end;
`;

const TooltipEntryValue = styled.span`
  text-align: right;
`;

export const TooltipList = styled.ol<{
  hasTwoColumns?: boolean;
  valueMinWidth?: string;
}>((x) =>
  css({
    columns: x.hasTwoColumns ? 2 : 1,
    m: 0,
    p: 0,
    listStyle: 'none',

    [TooltipEntryValue]: {
      minWidth: x.valueMinWidth ?? 'unset',
    },
  })
);

function getDateUnixString(value: TimestampedValue) {
  return 'date_unix' in value
    ? `${value.date_unix}`
    : `${value.date_start_unix}-${value.date_end_unix}`;
}
