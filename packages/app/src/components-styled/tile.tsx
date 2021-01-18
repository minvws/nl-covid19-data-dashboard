import { css } from '@styled-system/css';
import styled from 'styled-components';
import { variant } from 'styled-system';
import { BoxProps } from './base';

interface TileProps {
  variant?: string;
}

export const Tile = styled.article<TileProps & BoxProps>(
  css({
    boxSizing: 'border-box',
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    p: 4,
    borderRadius: 1,
    boxShadow: 'tile',
    bg: 'white',
  }),
  variant({
    variants: {
      withoutBorder: {
        boxShadow: 'none',
        p: 0,
      },
    },
  })
);
