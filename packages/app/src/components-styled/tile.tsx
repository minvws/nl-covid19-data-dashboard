import { css } from '@styled-system/css';
import styled from 'styled-components';
import {
  borders,
  color,
  flexbox,
  grid,
  layout,
  position,
  shadow,
  space,
  typography,
  variant,
} from 'styled-system';
import { spacing } from '~/style/functions/spacing';
import { BoxProps } from './base';

interface TileProps extends BoxProps {
  variant?: string;
}

export const Tile = styled.article<TileProps>(
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
      withoutBorder: css({
        boxShadow: 'none',
        p: 0,
      }),
    },
  }),
  space,
  spacing,
  layout,
  flexbox,
  color,
  position,
  typography,
  borders,
  shadow,
  grid
);
