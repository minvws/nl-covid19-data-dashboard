import css from '@styled-system/css';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import {
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
import { transform, TransformProps } from '~/style/functions/transform';
import { Preset, preset } from '~/style/preset';
import { styledShouldForwardProp } from '~/utils/styled-should-forward-prop';

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
  TransformProps & { textVariant?: keyof Preset['typography'] };

/**
 * A fully generic styling component used for layouts throughout the app. For
 * simple spacing we have the Spacer component.
 *
 * See https://styled-system.com/guides/build-a-box
 */
export const Box = styled.div.withConfig({
  shouldForwardProp: styledShouldForwardProp,
})<BoxProps>(
  { boxSizing: 'border-box', minWidth: 0 },
  (x) => (x.textVariant ? css(preset.typography[x.textVariant]) : undefined),
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
  transform
);

/**
 * The MotionBox component is enriched with framer-motion to support animated
 * properties.
 */
export const MotionBox = motion(Box);
