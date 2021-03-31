import styled from 'styled-components';
import {
  compose,
  typography,
  margin,
  padding,
  color,
  SpaceProps,
  LayoutProps,
  ColorProps,
  PositionProps,
  TypographyProps,
} from 'styled-system';
import { styledShouldForwardProp } from '~/utils/styled-should-forward-prop';
import {
  textTransform,
  TextTransformProps,
} from '~/style/functions/text-transform';

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
})<TextProps>(compose(margin, padding, typography, color), textTransform);

export const InlineText = styled.span.withConfig({
  shouldForwardProp: styledShouldForwardProp,
})<TextProps>(compose(margin, padding, typography, color), textTransform);

/**
 * By setting defaultProps we can set themed defaults for the text component to
 * match what normally would be the default body text styling.
 */
Text.defaultProps = {
  fontFamily: 'body',
  fontSize: 2,
  lineHeight: 2,
};
