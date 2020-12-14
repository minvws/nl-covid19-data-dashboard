import css from '@styled-system/css';
import { ReactNode } from 'react';
import { Box } from '~/components-styled/base';
import { colors } from '~/style/theme';

const BOUND_OFFSET = 70;

type Bounds = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

export type Props = {
  children: ReactNode;
  x: number;
  y: number;
  primaryColor?: string;
  borderColor?: string;
  bounds: Bounds;
};

/**
 * @TODO improve how bounds are used to keep tooltips within the chart
 */
export function Tooltip({
  children,
  x,
  y,
  primaryColor = colors.data.primary,
  borderColor = '#01689B',
  bounds,
}: Props) {
  const yTransform = 'calc(-100% - 10px)';

  let xTransform = '-50%';
  if (x > bounds.right - BOUND_OFFSET) {
    xTransform = `calc(-100% + ${bounds.right - x}px)`;
  }
  if (x < bounds.left + BOUND_OFFSET) {
    xTransform = `calc(-50% + ${BOUND_OFFSET - x}px)`;
  }

  return (
    <>
      <Box
        position="absolute"
        top={y}
        left={x}
        css={css({ pointerEvents: 'none' })}
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          bg={primaryColor}
          borderRadius="50%"
          height="18px"
          width="18px"
          opacity={0.2}
          css={css({
            transform: 'translate(-50%,-50%)',
          })}
        />
        <Box
          position="absolute"
          top={0}
          left={0}
          bg={primaryColor}
          borderRadius="50%"
          width="8px"
          height="8px"
          border="1px solid white"
          css={css({
            transform: 'translate(-50%,-50%)',
          })}
        />
      </Box>

      <Box
        bg="white"
        border={`1px solid ${borderColor}`}
        top={y}
        left={x}
        position="absolute"
        minWidth={72}
        px={2}
        py={1}
        fontSize={1}
        css={css({
          transform: `translate(${xTransform},${yTransform})`,
          pointerEvents: 'none',
          transition: 'left 0.075s, top 0.075s',
          whiteSpace: 'nowrap',
        })}
      >
        {children}
      </Box>
    </>
  );
}
