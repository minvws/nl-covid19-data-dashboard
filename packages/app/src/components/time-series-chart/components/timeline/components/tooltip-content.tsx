import { ChevronRight } from '@corona-dashboard/icons';
import { MouseEvent, TouchEvent } from 'react';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components/base';
import { IconButton } from '~/components/icon-button';
import { Anchor, InlineText, Text, BoldText } from '~/components/typography';
import { useIntl } from '~/intl';
import { useIsTouchDevice } from '~/utils/use-is-touch-device';
import { TimelineEventConfig } from '../logic';

interface TimelineTooltipContentProps {
  config: TimelineEventConfig;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  hasMultipleEvents: boolean;
}

export function TimelineTooltipContent({ config, onNext, onPrev, onClose, hasMultipleEvents }: TimelineTooltipContentProps) {
  const { commonTexts, formatDateFromSeconds } = useIntl();
  const isTouch = useIsTouchDevice();
  const dateStr = [formatDateFromSeconds(config.start, 'weekday-long'), config.end && formatDateFromSeconds(config.end, 'weekday-long')].filter(isDefined).join(' – ');

  return (
    <Box
      color="black"
      px={18}
      py={15}
      spacing={3}
      onTouchStart={stopEventPropagation}
      onTouchMove={stopEventPropagation}
      onMouseMove={stopEventPropagation}
      onMouseLeave={stopEventPropagation}
      width={{ _: '100vw', sm: '100%' }}
      maxWidth="100%"
    >
      {isTouch && (
        <Box display="flex" justifyContent={hasMultipleEvents ? 'space-between' : 'center'} alignItems="center" ml={-2} mr={-2}>
          {hasMultipleEvents && <ChevronButton onClick={onPrev} rotate title={commonTexts.charts.timeline.prev} />}

          <InlineText variant="label1" color="gray6">
            {dateStr}
          </InlineText>

          {hasMultipleEvents && <ChevronButton onClick={onNext} title={commonTexts.charts.timeline.next} />}
        </Box>
      )}
      <Box spacing={2}>
        {!isTouch && (
          <Text variant="label1" color="gray6">
            {dateStr}
          </Text>
        )}

        <BoldText variant="label1">{config.title}</BoldText>
        <Text variant="label1">{config.description}</Text>
      </Box>

      {isTouch && (
        <Box pt={3} mx={-27} borderTop="1px solid" borderTopColor="gray2" display="flex" justifyContent="center" textVariant="label1">
          <Anchor as="button" onClick={onClose} color="blue8" underline>
            {commonTexts.common.sluiten}
          </Anchor>
        </Box>
      )}
    </Box>
  );
}

function ChevronButton({ onClick, title, rotate }: { onClick: () => void; title: string; rotate?: boolean }) {
  return (
    <Box color="blue8" style={{ transform: rotate ? 'rotate(180deg)' : undefined }}>
      <IconButton title={title} onClick={onClick} size={13} padding={2}>
        <ChevronRight aria-hidden={true} />
      </IconButton>
    </Box>
  );
}

function stopEventPropagation(evt: TouchEvent | MouseEvent) {
  evt.stopPropagation();
}
