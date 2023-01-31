import { colors } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { m } from 'framer-motion';
import styled from 'styled-components';

interface TimelineMarkerProps {
  color?: string;
  hasPadding?: boolean;
  isHighlighted?: boolean;
  size?: number;
}

export const TimelineMarker = ({ color = colors.primary, isHighlighted, hasPadding = true, size = 10 }: TimelineMarkerProps) => {
  const borderWidth = Math.round(size * 0.2);
  const highlightBorderWidth = isHighlighted ? 2 * borderWidth : borderWidth;
  const innerPointSize = size - 2 * borderWidth;

  return (
    <div role="img" style={{ padding: hasPadding ? highlightBorderWidth : '0' }} aria-hidden={true}>
      <div style={{ width: size, height: size }}>
        <StyledPointMarker
          size={innerPointSize}
          color={color}
          initial={false}
          $borderWidth={borderWidth}
          transition={{ ease: 'easeOut' }}
          animate={{
            boxShadow: `0 0 0 ${highlightBorderWidth}px ${color}`,
          }}
        />
      </div>
    </div>
  );
};

const StyledPointMarker = styled(m.div)<{
  color: string;
  size: number;
  $borderWidth: number; // Prevent prop to be rendered to the DOM by using Transient prop
}>((x) =>
  css({
    position: 'relative',
    left: `${x.$borderWidth}px`,
    top: `${x.$borderWidth}px`,
    width: `${x.size}px`,
    height: `${x.size}px`,
    borderRadius: `${x.size / 2}px`,
    background: 'white',
  })
);
