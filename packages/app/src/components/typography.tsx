import css, { CSSProperties } from '@styled-system/css';
import styled, { DefaultTheme } from 'styled-components';
import { Preset, preset } from '~/style/preset';
import { Color } from '~/style/theme';

export interface TextProps {
  variant?: keyof Preset['typography'];
  fontWeight?: keyof DefaultTheme['fontWeights'];
  textTransform?: CSSProperties['textTransform'];
  textAlign?: CSSProperties['textAlign'];
  hyphens?: CSSProperties['hyphens'];
  color?: Color | string;
}

export interface AnchorProps extends TextProps {
  underline?: boolean | 'hover';
  hoverColor?: TextProps['color'];
}

export interface HeadingProps extends TextProps {
  level: HeadingLevel;
}

export type HeadingLevel = 1 | 2 | 3 | 4 | 5;

function textStyle(x: TextProps & { as?: string }) {
  return css({
    ...(x.as === 'button'
      ? {
          m: 0,
          p: 0,
          bg: 'transparent',
          border: 0,
          fontSize: 'inherit',
          cursor: 'pointer',
        }
      : undefined),

    ...(x.variant ? preset.typography[x.variant] : undefined),

    ...(x.fontWeight ? { fontWeight: x.fontWeight } : undefined),
    ...(x.color ? { color: x.color } : undefined),
    ...(x.textTransform ? { textTransform: x.textTransform } : undefined),
    ...(x.textAlign ? { textAlign: x.textAlign } : undefined),
    ...(x.hyphens ? { hyphens: x.hyphens } : undefined),
  });
}

export const Text = styled.p<TextProps>(textStyle);

export const InlineText = styled.span<TextProps>(textStyle);

export const Anchor = styled.a<AnchorProps>(
  textStyle,
  (x) =>
    x.underline &&
    css({
      textDecoration: x.underline === 'hover' ? 'none' : 'underline',
      '&:hover, &:focus': { textDecoration: 'underline' },
    }),
  (x) =>
    x.hoverColor &&
    css({
      '&:hover,&:focus': { color: 'blue' },
    })
);

export const Heading = styled.h1.attrs((x: HeadingProps & { as?: string }) => ({
  as: x.as ?? (`h${x.level}` as const),
  variant: x.variant ?? (`h${x.level}` as const),
}))<HeadingProps>(textStyle);
