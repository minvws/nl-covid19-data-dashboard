import css from '@styled-system/css';
import { Children, cloneElement } from 'react';
import { Box } from '~/components/base';

export function LegendIcon({
  color,
  children,
}: {
  color: string;
  children: JSX.Element;
}) {
  return (
    <Box
      css={css({
        bg: color,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        minHeight: '1.4em',
        minWidth: '1.4em',
        maxHeight: '1.4em',
        maxWidth: '1.4em',
        borderRadius: '.7em',
        '& svg': {
          height: '1em',
          width: '1em',
        },
      })}
    >
      {Children.map(children, (child) => {
        return cloneElement(child, {
          preserveAspectRatio: 'xMinYMid meet',
        });
      })}
    </Box>
  );
}
