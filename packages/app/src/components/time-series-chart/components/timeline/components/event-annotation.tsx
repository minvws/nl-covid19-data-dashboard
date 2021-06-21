import { AnimatePresence, motion } from 'framer-motion';
import { transparentize } from 'polished';
import {
  GetX,
  TimelineEventConfig,
} from '~/components/time-series-chart/logic';
import { colors } from '~/style/theme';
import { getTimelineEventRange } from '../logic';

export function TimelineEventAnnotation({
  domain,
  getX,
  height,
  config,
}: {
  domain: [number, number];
  height: number;
  getX: GetX;
  config?: TimelineEventConfig;
}) {
  const eventRange = config && getTimelineEventRange(config, domain);

  const x0 = getX({ __date_unix: eventRange?.highlight.start ?? 0 });
  const x1 = getX({ __date_unix: eventRange?.highlight.end ?? 0 });

  const width = x1 - x0;

  return (
    <AnimatePresence>
      {width > 0 && (
        <motion.rect
          key={config?.date.toString()}
          pointerEvents="none"
          height={height}
          x={x0}
          width={Math.max(1, width)}
          fill={transparentize(0.7, colors.data.primary)}
          initial={{ fill: transparentize(1, colors.data.primary) }}
          exit={{ fill: transparentize(1, colors.data.primary) }}
          animate={{ fill: transparentize(0.7, colors.data.primary) }}
        />
      )}
    </AnimatePresence>
  );
}
