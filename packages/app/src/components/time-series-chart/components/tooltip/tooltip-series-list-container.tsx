import { isDateValue, TimestampedValue } from '@corona-dashboard/common';
import { AnimatePresence } from 'framer-motion';
import {
  ComponentProps,
  ReactNode,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Box, MotionBox } from '~/components/base';
import { Text } from '~/components/typography';
import { VisuallyHidden } from '~/components/visually-hidden';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { useIsMounted } from '~/utils/use-is-mounted';
import { TimelineMarker } from '../timeline';
import { IconRow } from './tooltip-icon-row';
import { TooltipData } from './types';

export function TooltipSeriesListContainer<T extends TimestampedValue>({
  value,
  displayTooltipValueOnly,
  timespanAnnotation,
  timelineEvent,
  children,
}: TooltipData<T> & { children: ReactNode }) {
  const isMounted = useIsMounted();
  const intl = useIntl();

  const dateString = isDateValue(value)
    ? intl.formatDateFromSeconds(value.date_unix)
    : [
        intl.formatDateFromSeconds(value.date_start_unix),
        intl.formatDateFromSeconds(value.date_end_unix),
      ].join(' – ');

  /**
   * The listRef/listWidth is used to apply the width of the list to the tooltip
   * annotation components. This prevent a jittery tooltip when
   * moving between samples with/without annotations.
   */
  const [listRef, listWidth] = useInitialWidth<HTMLDivElement>();

  return (
    <section
      style={{
        maxWidth: '100%',
        width: listWidth ? listWidth + 20 : undefined,
      }}
    >
      <VisuallyHidden>{dateString}</VisuallyHidden>

      {!displayTooltipValueOnly && isMounted && (
        /**
         * The width of the list is potentially influenced by long annotations,
         * therefore mount these elements after the list-width has been measured.
         */
        <Box maxWidth="100%">
          <AnimatePresence>
            {timespanAnnotation && (
              <AppearTransition key="1">
                <Text
                  variant="label2"
                  color={colors.annotation}
                  textAlign="center"
                >
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

      <div ref={listRef}>{children}</div>
    </section>
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

function useInitialWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState<number>();
  useLayoutEffect(() => setWidth(ref.current?.offsetWidth), []);

  return [ref, width] as const;
}
