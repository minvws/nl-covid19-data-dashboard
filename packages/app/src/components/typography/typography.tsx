import css from '@styled-system/css';
import styled, { DefaultTheme } from 'styled-components';
import { Preset, preset } from '~/style/preset';

export interface TextProps {
  variant?: keyof Preset['typography'];
  fontWeight?: keyof DefaultTheme['fontWeights'];
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

function textStyle(defaultVariant: keyof Preset['typography']) {
  return (x: TextProps) =>
    css({
      ...preset.typography[x.variant ?? defaultVariant],
      ...(x.fontWeight ? { fontWeight: x.fontWeight } : {}),
      ...(x.color ? { color: x.color } : {}),
    });
}

export const Text = styled.p<TextProps>(textStyle('body1'));

export const InlineText = styled.span<TextProps>(textStyle('body1'));

export const Anchor = styled.a<AnchorProps>(
  textStyle('body1'),
  (x) =>
    x.underline &&
    css({
      textDecoration: x.underline === 'hover' ? 'none' : 'underline',
      '&:hover': { textDecoration: 'underline' },
    })
);

export const Heading = styled.h1.attrs(getHeadingAttributes)<HeadingProps>(
  textStyle('h2'),
  css({ hyphens: 'auto' })
);

function getHeadingAttributes(x: HeadingProps & { as?: string }) {
  return {
    as: x.as || (`h${x.level}` as const),
    variant: x.variant || (`h${x.level}` as const),
  };
}
