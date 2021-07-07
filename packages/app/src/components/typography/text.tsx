import styled from 'styled-components';
import {
  color,
  ColorProps,
  compose,
  layout,
  LayoutProps,
  margin,
  padding,
  position,
  PositionProps,
  SpaceProps,
  typography,
  TypographyProps,
} from 'styled-system';
import {
  textTransform,
  TextTransformProps,
} from '~/style/functions/text-transform';
import { styledShouldForwardProp } from '~/utils/styled-should-forward-prop';

export type TextProps = SpaceProps &
  LayoutProps &
  ColorProps &
  PositionProps &
  TypographyProps &
  TextTransformProps;

/**
 * A generic text component that can be used for any paragraph or other piece of
 * text, only for headers we have a dedicated Title component.
 */
export const Text = styled.p.withConfig({
  shouldForwardProp: styledShouldForwardProp,
})<TextProps>(
  compose(margin, padding, typography, color, layout, position),
  textTransform
);

export const InlineText = styled.span.withConfig({
  shouldForwardProp: styledShouldForwardProp,
})<TextProps>(
  compose(margin, padding, typography, color, layout, position),
  textTransform
);

/**
 * By setting defaultProps we can set themed defaults for the text component to
 * match what normally would be the default body text styling.
 */
Text.defaultProps = {
  fontFamily: 'body',
  fontSize: 2,
  lineHeight: 2,
};
