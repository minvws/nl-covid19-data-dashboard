import css from '@styled-system/css';
import { Children, cloneElement } from 'react';
import { DisplayProps, HeightProps, WidthProps } from 'styled-system';
import { Box } from './base';

type Props = {
  children: JSX.Element;
  centered?: boolean;
} & WidthProps &
  HeightProps &
  DisplayProps;

export function IconContainer(props: Props) {
  const { width, height, children, display = 'inline-block', centered } = props;
  const aspectRatio = centered ? 'xMidYMid meet' : 'xMinYMid meet';
  return (
    <Box
      role="img"
      aria-hidden="true"
      width={width}
      height={height}
      display={display}
      css={css({
        '& svg': {
          height: '100%',
          width: '100%',
        },
      })}
    >
      {Children.map(children, (child) => {
        return cloneElement(child, {
          preserveAspectRatio: aspectRatio,
          focusable: 'false',
        });
      })}
    </Box>
  );
}
