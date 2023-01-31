import { colors } from '@corona-dashboard/common';
import { ChevronRight } from '@corona-dashboard/icons';
import css from '@styled-system/css';
import { MouseEvent, TouchEvent } from 'react';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components/base';
import { IconButton } from '~/components/icon-button';
import { Markdown } from '~/components/markdown';
import { SeverityLevels } from '~/components/severity-indicator-tile/types';
import { Anchor, BoldText, InlineText, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { space } from '~/style/theme';
import { replaceVariablesInText } from '~/utils';
import { useIsTouchDevice } from '~/utils/use-is-touch-device';
import { SeverityIndicatorLevel } from '../../severity-indicator-label';
import { SeverityIndicatorTimelineEventConfig } from '../timeline';

interface TimelineTooltipContentProps {
  config: SeverityIndicatorTimelineEventConfig;
  hasMultipleEvents: boolean;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  currentEstimationLabel?: string;
}

export const TimelineTooltipContent = ({ config, hasMultipleEvents, onNext, onPrev, onClose, currentEstimationLabel }: TimelineTooltipContentProps) => {
  const { commonTexts, formatDateFromSeconds } = useIntl();
  const isTouch = useIsTouchDevice();
  const dateStr = [formatDateFromSeconds(config.start, 'weekday-long'), config.end && formatDateFromSeconds(config.end, 'weekday-long')].filter(isDefined).join(' - ');

  return (
    <Box
      color="black"
      maxWidth="100%"
      onMouseLeave={stopEventPropagation}
      onMouseMove={stopEventPropagation}
      onTouchMove={stopEventPropagation}
      onTouchStart={stopEventPropagation}
      px="18px"
      py="15px"
      spacing={3}
      width={{ _: '100vw', sm: '100%' }}
    >
      {isTouch && (
        <Box display="flex" justifyContent={hasMultipleEvents ? 'space-between' : 'center'} alignItems="center" mx={`-${space[2]}`}>
          {hasMultipleEvents && <ChevronButton rotate title={commonTexts.charts.timeline.prev} onClick={onPrev} />}

          <InlineText variant="label1" color={colors.gray6}>
            {dateStr}
          </InlineText>

          {hasMultipleEvents && <ChevronButton title={commonTexts.charts.timeline.next} onClick={onNext} />}
        </Box>
      )}
      <Box spacing={2}>
        {!isTouch && (
          <Text color={colors.gray6} variant="label1" textAlign="center">
            {dateStr}
          </Text>
        )}

        <Box
          alignItems="center"
          css={css({
            columnGap: space[2],
          })}
          display="grid"
          gridTemplateColumns={`${space[4]} auto`}
          gridTemplateRows="auto"
        >
          <SeverityIndicatorLevel level={config.level as SeverityLevels}>{config.level}</SeverityIndicatorLevel>
          <BoldText>{config.title}</BoldText>
        </Box>

        <Text variant="label1">
          {replaceVariablesInText(config.description.split('**').join(''), {
            label: config.title.toLowerCase(),
          })}
        </Text>

        {currentEstimationLabel && (
          <Box textVariant="label1">
            <Markdown
              content={replaceVariablesInText(currentEstimationLabel, {
                date: formatDateFromSeconds(config.end, 'medium'),
              })}
            />
          </Box>
        )}
      </Box>

      {isTouch && (
        <Box borderTop={`1px solid ${colors.gray2}`} display="flex" justifyContent="center" mx="-27px" pt={space[3]} textVariant="label1">
          <Anchor as="button" color={colors.blue8} underline onClick={onClose}>
            {commonTexts.common.sluiten}
          </Anchor>
        </Box>
      )}
    </Box>
  );
};

const ChevronButton = ({ onClick, title, rotate }: { onClick: () => void; title: string; rotate?: boolean }) => {
  return (
    <Box color={colors.blue8} transform={rotate ? 'rotate(180deg)' : undefined}>
      <IconButton padding={space[2]} size={13} title={title} onClick={onClick}>
        <ChevronRight aria-hidden={true} />
      </IconButton>
    </Box>
  );
};

const stopEventPropagation = (event: TouchEvent | MouseEvent) => {
  event.stopPropagation();
};
