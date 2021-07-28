import css from '@styled-system/css';
import styled from 'styled-components';
import { Preset, preset } from '~/style/preset';

interface TextProps {
  variant?: keyof Preset['typography'];
  noMargin?: boolean;
}

export interface HeadingProps extends TextProps {
  level: HeadingLevel;
}

export type HeadingLevel = 1 | 2 | 3 | 4 | 5;

export const Text = styled.p<TextProps>(
  (x) => css(preset.typography[x.variant ?? 'body1']),
  (x) => (x.noMargin ? css({ marginBottom: 0 }) : undefined)
);

export const InlineText = styled.span<TextProps>(
  (x) => css(preset.typography[x.variant ?? 'body1']),
  css({ marginBottom: 0 })
);

export const Heading = styled.h1.attrs<HeadingProps>((x) => ({
  as: `h${x.level}` as const,
  variant: `h${x.level}` as const,
}))<HeadingProps>((x) => css(preset.typography[x.variant ?? 'h2']));
