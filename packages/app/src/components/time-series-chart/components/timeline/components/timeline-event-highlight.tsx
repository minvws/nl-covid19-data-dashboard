import { AnimatePresence, motion } from 'framer-motion';
import { transparentize } from 'polished';
import { colors } from '~/style/theme';
import { TimelineState } from '../logic';

const activeColor = transparentize(0.7, colors.data.primary);
const inactiveColor = transparentize(1, colors.data.primary);

export function TimelineEventHighlight({
  height,
  timelineState,
}: {
  height: number;
  timelineState: TimelineState;
}) {
  const { xOffset, event } = timelineState.current || {};
  const { x0 = 0, x1 = 0 } = xOffset?.highlight || {};

  const width = Math.max(1, x1 - x0);

  return (
    <AnimatePresence>
      {timelineState.current && (
        <motion.rect
          key={`${event?.start}-${event?.end}`}
          pointerEvents="none"
          height={height}
          x={x0}
          width={width}
          style={{ mixBlendMode: 'multiply' }}
          initial={{ fill: inactiveColor }}
          exit={{ fill: inactiveColor }}
          animate={{ fill: activeColor }}
        />
      )}
    </AnimatePresence>
  );
}
