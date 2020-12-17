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

export type TextProps = SpaceProps &
  LayoutProps &
  ColorProps &
  PositionProps &
  TypographyProps;

/**
 * A generic text component that can be used for any paragraph or other piece of
 * text, only for headers we have a dedicated Title component.
 */
export const Text = styled.p<TextProps>(
  compose(margin, padding, typography, color)
);

export const InlineText = styled.span<TextProps>(
  compose(margin, padding, typography, color)
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
