import React from 'react';
import styled from 'styled-components';
import {
  color,
  ColorProps,
  compose,
  margin,
  MarginProps,
  padding,
  PaddingProps,
  typography,
  TypographyProps,
} from 'styled-system';

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
export function Heading({ level, ...otherProps }: HeadingProps) {
  switch (level) {
    case 1:
      return <Heading1 {...(otherProps as any)} />;
    case 2:
      return <Heading2 {...(otherProps as any)} />;
    case 3:
      return <Heading3 {...(otherProps as any)} />;
    case 4:
      return <Heading4 {...(otherProps as any)} />;
    case 5:
      return <Heading5 {...(otherProps as any)} />;
    default:
      throw new Error(`Invalid heading level ${level}`);
  }
}

type StyledHeadingProps = MarginProps &
  PaddingProps &
  TypographyProps &
  ColorProps;

const composedStyles = compose(margin, padding, typography, color);

const Heading1 = styled.h1<StyledHeadingProps>(composedStyles);

Heading1.defaultProps = {
  fontFamily: 'body',
  fontSize: 5,
  lineHeight: 2,
  color: 'body',
  mt: 0,
  mb: 4,
};

const Heading2 = styled.h2<StyledHeadingProps>(composedStyles);

Heading2.defaultProps = {
  fontFamily: 'body',
  fontSize: 4,
  lineHeight: 2,
  mt: 0,
  mb: 3,
};

const Heading3 = styled.h3<StyledHeadingProps>(composedStyles);

Heading3.defaultProps = {
  fontFamily: 'body',
  fontSize: 3,
  lineHeight: 2,
  mt: 0,
  mb: 3,
};

const Heading4 = styled.h4<StyledHeadingProps>(composedStyles);

Heading4.defaultProps = {
  fontFamily: 'body',
  fontSize: 2,
  lineHeight: 2,
  mt: 0,
  mb: 3,
};

const Heading5 = styled.h5<StyledHeadingProps>(composedStyles);

Heading5.defaultProps = {
  fontFamily: 'body',
  fontSize: 1,
  lineHeight: 2,
  mt: 0,
  mb: 3,
};
