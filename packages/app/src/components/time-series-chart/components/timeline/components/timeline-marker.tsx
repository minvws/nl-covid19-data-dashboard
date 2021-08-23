import css from '@styled-system/css';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { colors } from '~/style/theme';

export function TimelineMarker({
  isHighlighted,
  size = 10,
}: {
  isHighlighted?: boolean;
  size?: number;
}) {
  const borderWidth = Math.round(size * 0.2);
  const highlightBorderWidth = isHighlighted ? 2 * borderWidth : borderWidth;
  const innerPointSize = size - 2 * borderWidth;

  return (
    <div
      role="img"
      style={{ padding: highlightBorderWidth }}
      aria-hidden={true}
    >
      <div style={{ width: size, height: size }}>
        <StyledPointMarker
          size={innerPointSize}
          color={colors.data.primary}
          initial={false}
          borderWidth={borderWidth}
          transition={{ ease: 'easeOut' }}
          animate={{
            boxShadow: `0 0 0 ${highlightBorderWidth}px ${colors.data.primary}`,
          }}
        />
      </div>
    </div>
  );
}

const StyledPointMarker = styled(motion.div)<{
  color: string;
  size: number;
  borderWidth: number;
}>((x) =>
  css({
    position: 'relative',
    left: `${x.borderWidth}px`,
    top: `${x.borderWidth}px`,
    width: `${x.size}px`,
    height: `${x.size}px`,
    borderRadius: `${x.size / 2}px`,
    background: 'white',
  })
);
