import css from '@styled-system/css';
import React from 'react';
import styled from 'styled-components';
import {
  color,
  ColorProps,
  margin,
  MarginProps,
  padding,
  PaddingProps,
  typography,
  TypographyProps,
} from 'styled-system';
import { styledShouldForwardProp } from '~/utils/styled-should-forward-prop';

export interface HeadingProps extends StyledHeadingProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  level: HeadingLevel;
}

export type HeadingLevel = 1 | 2 | 3 | 4 | 5;

/**
 * A generic heading component. The level determines the styling for the
 * element and its default heading tag. Using the "as" prop you can then
 * override the tag so that it matches the required html semantics html in
 * cases where the styling differs from the actual hierarchy.
 */

type StyledHeadingProps = MarginProps &
  PaddingProps &
  TypographyProps &
  ColorProps;

const levelStyles: Record<HeadingLevel, ReturnType<typeof css>> = {
  1: css({ fontSize: 5, mb: 4 }),
  2: css({ fontSize: 4, mb: 3 }),
  3: css({ fontSize: 3, mb: 3 }),
  4: css({ fontSize: 2, mb: 3 }),
  5: css({ fontSize: 1, mb: 3 }),
};

export const Heading = styled.h1
  .withConfig({
    shouldForwardProp: styledShouldForwardProp,
  })
  .attrs<HeadingProps>((x) => ({
    as: x.as || `h${x.level}`,
  }))<HeadingProps>(
  (x) => levelStyles[x.level],
  css({ fontFamily: 'body', lineHeight: 2, mt: 0 }),
  margin,
  padding,
  typography,
  color
);
