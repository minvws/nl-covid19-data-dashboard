import { memo } from 'react';
import css from '@styled-system/css';

import { colors } from '~/style/theme';
import { Box } from '~/components-styled/base';

export type Props = {
  children: any;
  x: number;
  y: number;
  primaryColor?: string;
  borderColor?: string;
  bounds: any;
};

// TODO: improve how bounds are used to keep tooltips within the chart
function Tooltip({
  children,
  x,
  y,
  primaryColor = colors.data.primary,
  borderColor = '#01689B',
  bounds,
}: Props) {
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
          transform: `translate(${
            x < bounds.width - 75
              ? '-50%'
              : `calc(-100% + ${bounds.width - x}px)`
          },calc(-100% - 10px))`,
          pointerEvents: 'none',
          transition: 'left 0.1s, top 0.1s',
          whiteSpace: 'nowrap',
        })}
      >
        {children}
      </Box>
    </>
  );
}

export default memo(Tooltip);
