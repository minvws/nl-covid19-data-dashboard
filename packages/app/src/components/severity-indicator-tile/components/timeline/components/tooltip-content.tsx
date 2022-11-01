import { colors } from '@corona-dashboard/common';
import { ChevronRight } from '@corona-dashboard/icons';
import css from '@styled-system/css';
import { MouseEvent, TouchEvent } from 'react';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components/base';
import { IconButton } from '~/components/icon-button';
import { SeverityLevels } from '~/components/severity-indicator-tile/types';
import { Anchor, BoldText, InlineText, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { space } from '~/style/theme';
import { useIsTouchDevice } from '~/utils/use-is-touch-device';
import { SeverityIndicatorLevel } from '../../severity-indicator-label';
import { TimelineEventConfig } from '../timeline';

interface TimelineTooltipContentProps {
  config: TimelineEventConfig;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  hasMultipleEvents: boolean;
}

export const TimelineTooltipContent = ({
  config,
  onNext,
  onPrev,
  onClose,
  hasMultipleEvents,
}: TimelineTooltipContentProps) => {
  const { commonTexts, formatDateFromSeconds } = useIntl();
  const isTouch = useIsTouchDevice();
  const dateStr = [
    formatDateFromSeconds(config.start, 'medium'),
    config.end && formatDateFromSeconds(config.end, 'medium'),
  ]
    .filter(isDefined)
    .join(' - ');

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
          justifyContent={hasMultipleEvents ? 'space-between' : 'center'}
          alignItems="center"
          ml={-2}
          mr={-2}
        >
          {hasMultipleEvents && (
            <ChevronButton
              onClick={onPrev}
              rotate
              title={commonTexts.charts.timeline.prev}
            />
          )}

          <InlineText variant="label1" color={colors.gray6}>
            {dateStr}
          </InlineText>

          {hasMultipleEvents && (
            <ChevronButton
              onClick={onNext}
              title={commonTexts.charts.timeline.next}
            />
          )}
        </Box>
      )}
      <Box spacing={2}>
        {!isTouch && (
          <Text variant="label1" color={colors.gray6} textAlign="center">
            {dateStr}
          </Text>
        )}

        <Box
          display="grid"
          gridTemplateRows="auto"
          gridTemplateColumns={`${space[4]} auto`}
          alignItems="center"
          css={css({
            columnGap: space[2],
          })}
        >
          <SeverityIndicatorLevel
            level={config.level.toString() as SeverityLevels}
          >
            {config.level}
          </SeverityIndicatorLevel>
          <BoldText>{config.title}</BoldText>
        </Box>
        <Text variant="label1">{config.description}</Text>
      </Box>

      {isTouch && (
        <Box
          pt={3}
          mx={-27}
          borderTop={`1px solid ${colors.gray2}`}
          display="flex"
          justifyContent="center"
          textVariant="label1"
        >
          <Anchor as="button" onClick={onClose} color={colors.blue8} underline>
            {commonTexts.common.sluiten}
          </Anchor>
        </Box>
      )}
    </Box>
  );
};

const ChevronButton = ({
  onClick,
  title,
  rotate,
}: {
  onClick: () => void;
  title: string;
  rotate?: boolean;
}) => {
  return (
    <Box
      color={colors.blue8}
      style={{ transform: rotate ? 'rotate(180deg)' : undefined }}
    >
      <IconButton title={title} onClick={onClick} size={13} padding={2}>
        <ChevronRight aria-hidden={true} />
      </IconButton>
    </Box>
  );
};

const stopEventPropagation = (event: TouchEvent | MouseEvent) => {
  event.stopPropagation();
};
