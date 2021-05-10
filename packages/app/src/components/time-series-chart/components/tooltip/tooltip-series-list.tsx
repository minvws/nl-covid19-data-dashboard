import { TimestampedValue } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { InlineText, Text } from '~/components/typography';
import { VisuallyHidden } from '~/components/visually-hidden';
import { SeriesConfig, useStringFormatting } from '../../logic';
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

  const { formatSeriesValue, getDateStringFromValue } = useStringFormatting();

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
          switch (x.type) {
            case 'stacked-area':
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
                  <b>{formatSeriesValue(value, x, options.isPercentage)}</b>
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
                    {formatSeriesValue(value, x, options.isPercentage)}
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
