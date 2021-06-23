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
  const x0 = timelineState.current?.range.highlight.start ?? 0;
  const x1 = timelineState.current?.range.highlight.end ?? 0;

  const width = x1 - x0;

  return (
    <AnimatePresence>
      {width > 0 && (
        <motion.rect
          key={timelineState.current?.event.date.toString()}
          pointerEvents="none"
          height={height}
          x={x0}
          width={Math.max(1, width)}
          style={{ mixBlendMode: 'multiply' }}
          initial={{ fill: inactiveColor }}
          exit={{ fill: inactiveColor }}
          animate={{ fill: activeColor }}
        />
      )}
    </AnimatePresence>
  );
}
