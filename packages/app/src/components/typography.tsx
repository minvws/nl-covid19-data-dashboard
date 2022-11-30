import { Color, colors } from '@corona-dashboard/common';
import css, { CSSProperties } from '@styled-system/css';
import styled, { DefaultTheme } from 'styled-components';
import { Preset, preset } from '~/style/preset';

export interface TextProps {
  variant?: keyof Preset['typography'];
  fontWeight?: keyof DefaultTheme['fontWeights'];
  textTransform?: CSSProperties['textTransform'];
  textAlign?: CSSProperties['textAlign'];
  hyphens?: CSSProperties['hyphens'];
  color?: Color | string;
  ariaLabel?: string;
}

export const textStyle = (props: TextProps & { as?: string }) => {
  return css({
    ...(props.as === 'button'
      ? {
          m: 0,
          p: 0,
          bg: 'transparent',
          border: 0,
          fontSize: 'inherit',
          cursor: 'pointer',
        }
      : undefined),

    ...(props.variant ? preset.typography[props.variant] : undefined),
    ...(props.fontWeight ? { fontWeight: props.fontWeight } : undefined),
    ...(props.color ? { color: props.color } : undefined),
    ...(props.textTransform ? { textTransform: props.textTransform } : undefined),
    ...(props.textAlign ? { textAlign: props.textAlign } : undefined),
    ...(props.hyphens ? { hyphens: props.hyphens } : undefined),
  });
};

export const Text = styled.p<TextProps>(textStyle);

export const InlineText = styled.span<TextProps>(textStyle);

export const BoldText = styled.strong<TextProps>(textStyle);

export interface AnchorProps extends TextProps {
  underline?: boolean | 'hover';
  hoverColor?: TextProps['color'];
  display?: string;
  width?: string | number;
}

export const Anchor = styled.a<AnchorProps>`
  ${textStyle}
  ${({ underline }) =>
    underline
      ? `
          cursor: pointer;
          text-decoration: ${underline === 'hover' ? 'none' : 'underline'};

    &:hover,
    &:focus {
      text-decoration: underline;

      span {
        text-decoration: underline;
      }
    }
  `
      : undefined}
  ${({ hoverColor }) =>
    hoverColor
      ? `
    &:hover,
    &:focus {
      color: ${colors.blue8};
    }
  `
      : undefined}
  ${({ display }) =>
    display
      ? `
    display: ${display};
  `
      : undefined}
`;

export interface HeadingProps extends TextProps {
  level: HeadingLevel;
}

export type HeadingLevel = 1 | 2 | 3 | 4 | 5;

export const Heading = styled.h1.attrs((props: HeadingProps & { as?: string }) => ({
  as: props.as ?? (`h${props.level}` as const),
  variant: props.variant ?? (`h${props.level}` as const),
}))<HeadingProps>(textStyle);

export const styledTextVariant = (variant: string, as?: string) => {
  return styled.p.attrs(() => ({
    as: as ?? 'p',
    variant,
  }));
};
