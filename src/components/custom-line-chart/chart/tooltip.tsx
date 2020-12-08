import css from '@styled-system/css';
import { memo } from 'react';

import { colors } from '~/style/theme';
import { Box } from '~/components-styled/base';

export type Props = {
  children: any;
  x: number;
  y: number;
  color: string;
};

function Tooltip({ children, x, y, color = colors.data.primary }: Props) {
  return (
    <Box
      position="absolute"
      top={y}
      left={x}
      zIndex={1}
      css={css({ pointerEvents: 'none' })}
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        bg={color}
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
        bg={color}
        borderRadius="50%"
        width="8px"
        height="8px"
        border="1px solid white"
        css={css({
          transform: 'translate(-50%,-50%)',
        })}
      />
      <Box
        bg="white"
        border="1px solid blue"
        position="absolute"
        // minWidth={72}
        // css={css({
        //   transform: 'translate(-50%,-120%)',
        // })}
      >
        {children}
      </Box>
    </Box>
  );
}

export default memo(Tooltip);
