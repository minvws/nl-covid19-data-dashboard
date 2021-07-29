import css, { CSSProperties } from '@styled-system/css';
import styled, { DefaultTheme } from 'styled-components';
import { Preset, preset } from '~/style/preset';
import { Color } from '~/style/theme';

export interface TextProps {
  variant?: keyof Preset['typography'];
  fontWeight?: keyof DefaultTheme['fontWeights'];
  textTransform?: CSSProperties['textTransform'];
  textAlign?: CSSProperties['textAlign'];
  color?: Color;
}

export interface AnchorProps extends TextProps {
  underline?: boolean | 'hover';
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
    ...preset.typography[x.variant ?? 'body2'],
    ...(x.fontWeight ? { fontWeight: x.fontWeight } : {}),
    ...(x.color ? { color: x.color } : {}),
    ...(x.textTransform ? { textTransform: x.textTransform } : {}),
    ...(x.textAlign ? { textAlign: x.textAlign } : {}),
  });
}

export const Text = styled.p.attrs(getTextAttributes)<TextProps>(textStyle);

export const InlineText =
  styled.span.attrs(getTextAttributes)<TextProps>(textStyle);

export const Anchor = styled.a.attrs(getTextAttributes)<AnchorProps>(
  textStyle,
  (x) =>
    x.underline &&
    css({
      textDecoration: x.underline === 'hover' ? 'none' : 'underline',
      '&:hover': { textDecoration: 'underline' },
    })
);

export const Heading = styled.h1.attrs(getHeadingAttributes)<HeadingProps>(
  textStyle,
  css({ hyphens: 'auto' })
);

function getTextAttributes(x: HeadingProps & { as?: string }) {
  return {
    variant: x.variant || (`body2` as const),
  };
}

function getHeadingAttributes(x: HeadingProps & { as?: string }) {
  return {
    as: x.as ?? (`h${x.level}` as const),
    variant: x.variant ?? (`h${x.level}` as const),
  };
}
