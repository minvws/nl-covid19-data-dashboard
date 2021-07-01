import css from '@styled-system/css';
import { MouseEvent, TouchEvent } from 'react';
import styled from 'styled-components';
import { isDefined } from 'ts-is-present';
import ChevronIcon from '~/assets/chevron.svg';
import { Box } from '~/components/base';
import { IconButton } from '~/components/icon-button';
import { InlineText, Text } from '~/components/typography';
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
          <InlineText fontSize={1} color="labelGray">
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
          <Text fontSize={1} color="labelGray">
            {dateStr}
          </Text>
        )}

        <Text fontSize={1} fontWeight="bold">
          {config.title}
        </Text>
        <Text mb={0} fontSize={1}>
          {config.description}
        </Text>
      </Box>

      {isTouch && (
        <Box
          pt={3}
          mx={-27}
          borderTop="1px solid"
          borderTopColor="lightGray"
          display="flex"
          justifyContent="center"
          fontSize={1}
        >
          <TextButton onClick={onClose}>
            {intl.siteText.common.sluiten}
          </TextButton>
        </Box>
      )}
    </Box>
  );
}

const TextButton = styled.button(
  css({
    m: 0,
    p: 0,
    bg: 'transparent',
    border: 0,
    color: 'link',
    textDecoration: 'underline',
    fontSize: 'inherit',
  })
);

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
