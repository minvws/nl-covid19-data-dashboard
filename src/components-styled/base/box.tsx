import styled from 'styled-components';
import {
  border,
  BorderProps,
  color,
  ColorProps,
  compose,
  flexbox,
  FlexboxProps,
  grid,
  GridProps,
  layout,
  LayoutProps,
  position,
  PositionProps,
  shadow,
  ShadowProps,
  space,
  SpaceProps,
  typography,
  TypographyProps,
} from 'styled-system';

type BoxProps = SpaceProps &
  LayoutProps &
  FlexboxProps &
  ColorProps &
  PositionProps &
  TypographyProps &
  BorderProps &
  ShadowProps &
  GridProps;

/**
 * We use the Box component as a generic spacing/layout component throughout the app
 */
export const Box = styled.div<BoxProps>`
  ${compose(
    space,
    layout,
    flexbox,
    color,
    position,
    typography,
    border,
    shadow,
    grid
  )}
`;
