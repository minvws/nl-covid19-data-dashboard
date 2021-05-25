import css from '@styled-system/css';
import { ReactNode } from 'react';
import { DisplayProps, HeightProps, WidthProps } from 'styled-system';
import { Box } from './base';

type Props = {
  children: ReactNode;
} & WidthProps &
  HeightProps &
  DisplayProps;

export function IconContainer(props: Props) {
  const { width, height = width, children, display = 'inline-block' } = props;
  return (
    <Box
      role="img"
      aria-hidden="true"
      width={width}
      height={height}
      display={display}
      css={css({
        '& svg': {
          height,
          flexGrow: 0,
          flexShrink: 0,
        },
      })}
    >
      {children}
    </Box>
  );
}
