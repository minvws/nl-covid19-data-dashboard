import css, { CSSProperties } from '@styled-system/css';
import styled, { DefaultTheme } from 'styled-components';
import { Preset, preset } from '~/style/preset';

export interface TextProps {
  variant?: keyof Preset['typography'];
  fontWeight?: keyof DefaultTheme['fontWeights'];
  textTransform?: CSSProperties['textTransform'];
  color?:
    | keyof DefaultTheme['colors']
    | `data.${keyof DefaultTheme['colors']['data']}`;
}

export interface AnchorProps extends TextProps {
  underline?: boolean | 'hover';
}

export interface HeadingProps extends TextProps {
  level: HeadingLevel;
}

export type HeadingLevel = 1 | 2 | 3 | 4 | 5;

function textStyle(x: TextProps) {
  return css({
    ...preset.typography[x.variant ?? 'body2'],
    ...(x.fontWeight ? { fontWeight: x.fontWeight } : {}),
    ...(x.color ? { color: x.color } : {}),
    ...(x.textTransform ? { textTransform: x.textTransform } : {}),
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
