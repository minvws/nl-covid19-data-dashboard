import styled from 'styled-components';
import {
  border,
  BorderProps,
  color,
  ColorProps,
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

export type BoxProps = SpaceProps &
  LayoutProps &
  FlexboxProps &
  ColorProps &
  PositionProps &
  TypographyProps &
  BorderProps &
  ShadowProps &
  GridProps;

/**
 * A fully generic styling component used for layouts throughout the app. For
 * simple spacing we have the Spacer component.
 *
 * See https://styled-system.com/guides/build-a-box
 */
export const Box = styled.div<BoxProps>(
  { boxSizing: 'border-box', minWidth: 0 },
  space,
  layout,
  flexbox,
  color,
  position,
  typography,
  border,
  shadow,
  grid
);
