import {
  isDateSpanValue,
  isDateValue,
  TimestampedValue,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import { AnimatePresence } from 'framer-motion';
import {
  ComponentProps,
  ReactNode,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { Box, MotionBox } from '~/components/base';
import { InlineText, Text } from '~/components/typography';
import { VisuallyHidden } from '~/components/visually-hidden';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { useIsMounted } from '~/utils/use-is-mounted';
import { SeriesConfig, useFormatSeriesValue } from '../../logic';
import { SeriesIcon } from '../series-icon';
import { TimelineMarker } from '../timeline';
import { TooltipData } from './types';

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
    timelineEvent,
    valueMinWidth,
  } = tooltipData;

  const { formatDateFromSeconds } = useIntl();

  const formatSeriesValue = useFormatSeriesValue();

  /**
   * The listRef/listWidth is used to apply the width of the list to the tooltip
   * annotation components. This prevent a jittery tooltip when
   * moving between samples with/without annotations.
   */
  const [listRef, listWidth] = useInitialWidth<HTMLOListElement>();
  const isMounted = useIsMounted();

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

      {!displayTooltipValueOnly && isMounted && (
        /**
         * The width of the list is potentially influenced by long annotations,
         * therefore mount these elements after the list-width has been measured.
         */
        <Box width={listWidth} maxWidth="100%">
          <AnimatePresence>
            {timespanAnnotation && (
              <AppearTransition key="1">
                <Text fontSize={0} color={colors.annotation} textAlign="center">
                  {timespanAnnotation.shortLabel || timespanAnnotation.label}
                </Text>
              </AppearTransition>
            )}
            {timelineEvent && (
              <AppearTransition mx={-3} key="2">
                <Box
                  fontWeight="bold"
                  px={3}
                  pb={2}
                  mb={2}
                  borderBottom="1px solid"
                  borderBottomColor="lightGray"
                >
                  <IconRow icon={<TimelineMarker isHighlighted size={10} />}>
                    {timelineEvent.title}
                  </IconRow>
                </Box>
              </AppearTransition>
            )}
          </AnimatePresence>
        </Box>
      )}

      <TooltipList
        hasTwoColumns={hasTwoColumns}
        valueMinWidth={valueMinWidth}
        ref={listRef}
      >
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
                  isVisuallyHidden={x.isNonInteractive}
                >
                  <b>
                    {formatSeriesValue(
                      value,
                      x,
                      x.isPercentage ?? options.isPercentage
                    )}
                  </b>
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
                      value={
                        value[x.metricProperty] as unknown as number | null
                      }
                    />
                  }
                  label={x.shortLabel ?? x.label}
                  displayTooltipValueOnly={displayTooltipValueOnly}
                  isVisuallyHidden={x.isNonInteractive}
                >
                  <b>{formatSeriesValue(value, x, options.isPercentage)}</b>
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
      {label}:{children}
    </VisuallyHidden>
  ) : (
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
            <TooltipEntryValue isCentered={displayTooltipValueOnly}>
              {children}
            </TooltipEntryValue>
          </TooltipEntryContainer>
        </Box>
      ) : (
        <IconRow icon={icon}>
          <Box flexGrow={1}>
            <TooltipEntryContainer>
              <InlineText mr={2}>{label}:</InlineText>
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

const TooltipEntryContainer = styled.span`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: flex-end;
`;

const TooltipEntryValue = styled.span<{
  isCentered?: boolean;
}>((x) =>
  css({
    textAlign: x.isCentered ? 'center' : 'right',
  })
);

export const TooltipList = styled.ol<{
  hasTwoColumns?: boolean;
  valueMinWidth?: string;
}>((x) =>
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

function IconRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <Box
      display="flex"
      alignItems="stretch"
      spacing={2}
      spacingHorizontal
      width="100%"
    >
      {icon && (
        <Box
          width="1em"
          mt="2px"
          flexShrink={0}
          display="flex"
          alignItems="baseline"
          justifyContent="center"
        >
          {icon}
        </Box>
      )}
      <Box width="100%">{children}</Box>
    </Box>
  );
}

function AppearTransition(props: ComponentProps<typeof MotionBox>) {
  return (
    <MotionBox
      {...props}
      initial={{ height: 0, opacity: 0 }}
      exit={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      overflow="hidden"
    />
  );
}

function getDateUnixString(value: TimestampedValue) {
  return 'date_unix' in value
    ? `${value.date_unix}`
    : `${value.date_start_unix}-${value.date_end_unix}`;
}

function useInitialWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState<number>();
  useLayoutEffect(() => setWidth(ref.current?.offsetWidth), []);

  return [ref, width] as const;
}
