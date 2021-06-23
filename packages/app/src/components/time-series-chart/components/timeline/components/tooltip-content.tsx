import css from '@styled-system/css';
import { MouseEvent, TouchEvent, useCallback } from 'react';
import styled from 'styled-components';
import ChevronIcon from '~/assets/chevron.svg';
import { Box } from '~/components/base';
import { IconButton } from '~/components/icon-button';
import { TimelineEventConfig } from '~/components/time-series-chart/logic';
import { InlineText, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { useIsTouchDevice } from '~/utils/use-is-touch-device';

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
  const date = Array.isArray(config.date)
    ? config.date
        .map((x) => intl.formatDateFromSeconds(x, 'medium'))
        .join(' - ')
    : intl.formatDateFromSeconds(config.date, 'medium');

  const stopPropagation = useCallback(
    (evt: TouchEvent | MouseEvent) => evt.stopPropagation(),
    []
  );

  return (
    <Box
      color="black"
      px={18}
      py={15}
      spacing={3}
      onTouchStart={stopPropagation}
      onTouchMove={stopPropagation}
      onMouseMove={stopPropagation}
      onMouseLeave={stopPropagation}
    >
      {isTouch && (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          ml={-2}
          mr={-2}
        >
          <ChevronButton onClick={onPrev} title="@TODO prev" rotate />
          <InlineText fontSize={1} color="labelGray">
            {date}
          </InlineText>
          <ChevronButton onClick={onNext} title="@TODO next" />
        </Box>
      )}
      <Box spacing={2}>
        {!isTouch && (
          <Text fontSize={1} color="labelGray">
            {date}
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
          <TextButton onClick={onClose}>@TODO Sluiten</TextButton>
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
        <ChevronIcon />
      </IconButton>
    </Box>
  );
}
