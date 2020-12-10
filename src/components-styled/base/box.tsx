import styled from 'styled-components';
import {
  backgroundImage,
  BackgroundImageProps,
  backgroundPosition,
  BackgroundPositionProps,
  backgroundRepeat,
  BackgroundRepeatProps,
  backgroundSize,
  BackgroundSizeProps,
  borders,
  BordersProps,
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
import { spacing, SpacingProps } from '~/style/functions/spacing';

export type BoxProps = SpaceProps &
  SpacingProps &
  LayoutProps &
  FlexboxProps &
  ColorProps &
  PositionProps &
  TypographyProps &
  BordersProps &
  ShadowProps &
  GridProps &
  BackgroundImageProps &
  BackgroundSizeProps &
  BackgroundPositionProps &
  BackgroundRepeatProps;

/**
 * A fully generic styling component used for layouts throughout the app. For
 * simple spacing we have the Spacer component.
 *
 * See https://styled-system.com/guides/build-a-box
 */
export const Box = styled.div<BoxProps>(
  { boxSizing: 'border-box', minWidth: 0 },
  space,
  spacing,
  layout,
  flexbox,
  color,
  position,
  typography,
  borders,
  shadow,
  grid,
  backgroundImage,
  backgroundPosition,
  backgroundRepeat,
  backgroundSize
);
