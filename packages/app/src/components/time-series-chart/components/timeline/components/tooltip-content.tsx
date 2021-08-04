import { MouseEvent, TouchEvent } from 'react';
import { isDefined } from 'ts-is-present';
import ChevronIcon from '~/assets/chevron.svg';
import { Box } from '~/components/base';
import { IconButton } from '~/components/icon-button';
import { Anchor, InlineText, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { useIsTouchDevice } from '~/utils/use-is-touch-device';
import { TimelineEventConfig } from '../logic';

interface TimelineTooltipContentProps {
  config: TimelineEventConfig;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

export function TimelineTooltipContent({
  config,
  onNext,
  onPrev,
  onClose,
}: TimelineTooltipContentProps) {
  const intl = useIntl();
  const isTouch = useIsTouchDevice();
  const dateStr = [
    intl.formatDateFromSeconds(config.start, 'medium'),
    config.end && intl.formatDateFromSeconds(config.end, 'medium'),
  ]
    .filter(isDefined)
    .join(' – ');

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
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          ml={-2}
          mr={-2}
        >
          <ChevronButton
            onClick={onPrev}
            rotate
            title={intl.siteText.charts.timeline.prev}
          />
          <InlineText variant="label1" color="labelGray">
            {dateStr}
          </InlineText>
          <ChevronButton
            onClick={onNext}
            title={intl.siteText.charts.timeline.next}
          />
        </Box>
      )}
      <Box spacing={2}>
        {!isTouch && (
          <Text variant="label1" color="labelGray">
            {dateStr}
          </Text>
        )}

        <Text variant="label1" fontWeight="bold">
          {config.title}
        </Text>
        <Text variant="label1">{config.description}</Text>
      </Box>

      {isTouch && (
        <Box
          pt={3}
          mx={-27}
          borderTop="1px solid"
          borderTopColor="lightGray"
          display="flex"
          justifyContent="center"
          textVariant="label1"
        >
          <Anchor as="button" onClick={onClose} color="blue" underline>
            {intl.siteText.common.sluiten}
          </Anchor>
        </Box>
      )}
    </Box>
  );
}

function ChevronButton({
  onClick,
  title,
  rotate,
}: {
  onClick: () => void;
  title: string;
  rotate?: boolean;
}) {
  return (
    <Box
      color="blue"
      style={{ transform: rotate ? 'rotate(180deg)' : undefined }}
    >
      <IconButton title={title} onClick={onClick} size={13} padding={2}>
        <ChevronIcon aria-hidden />
      </IconButton>
    </Box>
  );
}

function stopEventPropagation(evt: TouchEvent | MouseEvent) {
  evt.stopPropagation();
}
