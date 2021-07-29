import { TimestampedValue } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';
import { VisuallyHidden } from '~/components/visually-hidden';
import { spacingStyle } from '~/style/functions/spacing';
import { colors } from '~/style/theme';
import { SeriesConfig, useFormatSeriesValue } from '../../logic';
import { SeriesIcon } from '../series-icon';
import { IconRow } from './tooltip-icon-row';
import { TooltipData } from './types';

type TooltipListOfSeriesProps<T extends TimestampedValue> = TooltipData<T> & {
  hasTwoColumns?: boolean;
};

export function TooltipSeriesListItems<T extends TimestampedValue>({
  hasTwoColumns,
  value,
  configIndex,
  config,
  options,
  markNearestPointOnly,
  displayTooltipValueOnly,
  valueMinWidth,
  metricPropertyFormatters,
}: TooltipListOfSeriesProps<T>) {
  const formatSeriesValue = useFormatSeriesValue(metricPropertyFormatters);

  const seriesConfig: SeriesConfig<T> = markNearestPointOnly
    ? [config[configIndex]]
    : [...config];

  return (
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
          case 'range':
            return (
              <TooltipListItem
                key={key}
                icon={<SeriesIcon config={x} />}
                label={x.shortLabel ?? x.label}
                displayTooltipValueOnly={displayTooltipValueOnly}
                isVisuallyHidden={x.isNonInteractive}
              >
                <span css={css({ whiteSpace: 'nowrap' })}>
                  {formatSeriesValue(value, x, options.isPercentage)}
                </span>
              </TooltipListItem>
            );

          case 'invisible':
            return (
              <TooltipListItem
                key={key}
                label={x.label}
                displayTooltipValueOnly={displayTooltipValueOnly}
                isVisuallyHidden={x.isNonInteractive}
              >
                {formatSeriesValue(
                  value,
                  x,
                  x.isPercentage ?? options.isPercentage
                )}
              </TooltipListItem>
            );

          case 'split-area':
          case 'split-bar':
            return (
              <TooltipListItem
                key={key}
                icon={
                  <SeriesIcon
                    config={x}
                    value={value[x.metricProperty] as unknown as number | null}
                  />
                }
                label={x.shortLabel ?? x.label}
                displayTooltipValueOnly={displayTooltipValueOnly}
                isVisuallyHidden={x.isNonInteractive}
              >
                {formatSeriesValue(value, x, options.isPercentage)}
              </TooltipListItem>
            );

          default:
            return (
              <TooltipListItem
                key={key}
                icon={<SeriesIcon config={x} />}
                label={x.shortLabel ?? x.label}
                displayTooltipValueOnly={displayTooltipValueOnly}
                isVisuallyHidden={x.isNonInteractive}
              >
                {formatSeriesValue(value, x, options.isPercentage)}
              </TooltipListItem>
            );
        }
      })}
    </TooltipList>
  );
}

interface TooltipListItemProps {
  children?: ReactNode;
  label?: string;
  icon?: ReactNode;
  displayTooltipValueOnly?: boolean;
  isVisuallyHidden?: boolean;
}

function TooltipListItem({
  children,
  icon,
  label,
  displayTooltipValueOnly,
  isVisuallyHidden,
}: TooltipListItemProps) {
  return isVisuallyHidden ? (
    <VisuallyHidden as="li">
      {label}: {children}
    </VisuallyHidden>
  ) : (
    <Box as="li" spacingHorizontal={2} display="flex" alignItems="stretch">
      {displayTooltipValueOnly ? (
        <Box flexGrow={1}>
          <TooltipEntryContainer>
            <VisuallyHidden>
              <InlineText>{label}:</InlineText>
            </VisuallyHidden>
            <TooltipEntryValue isCentered={displayTooltipValueOnly}>
              {children}
            </TooltipEntryValue>
          </TooltipEntryContainer>
        </Box>
      ) : (
        <IconRow icon={icon}>
          <Box flexGrow={1}>
            <TooltipEntryContainer>
              <InlineText>{label}:</InlineText>
              <TooltipEntryValue isCentered={displayTooltipValueOnly}>
                {children}
              </TooltipEntryValue>
            </TooltipEntryContainer>
          </Box>
        </IconRow>
      )}
    </Box>
  );
}

const TooltipEntryContainer = styled.span(
  css({
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    ...spacingStyle(undefined, 2),
  })
);

const TooltipEntryValue = styled.span<{
  isCentered?: boolean;
}>((x) =>
  css({
    textAlign: x.isCentered ? 'center' : 'right',
    width: x.isCentered ? '100%' : undefined,
    fontWeight: 'bold',
  })
);

interface TooltipListProps {
  hasTwoColumns?: boolean;
  valueMinWidth?: string;
}

const TooltipList = styled.ol<TooltipListProps>((x) =>
  css({
    columns: x.hasTwoColumns ? 2 : 1,
    columnRule: x.hasTwoColumns ? `1px solid ${colors.lightGray}` : 'unset',
    columnGap: x.hasTwoColumns ? '2em' : 'unset',
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
