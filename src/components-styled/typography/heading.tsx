import React from 'react';
import styled from 'styled-components';
import {
  compose,
  typography,
  margin,
  padding,
  color,
  ColorProps,
  TypographyProps,
  MarginProps,
  PaddingProps,
} from 'styled-system';

interface HeadingProps extends StyledHeadingProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  level: 1 | 2 | 3 | 4 | 5;
}

/**
 * A generic heading component. The level determines the styling for the
 * element and it's default heading tag. Using the "as" prop you can then
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

export const Heading1 = styled.h1<StyledHeadingProps>(composedStyles);

Heading1.defaultProps = {
  fontFamily: 'body',
  fontSize: 5,
  lineHeight: 2,
  color: 'body',
  mb: 4,
};

const Heading2 = styled.h2<StyledHeadingProps>(composedStyles);

Heading2.defaultProps = {
  fontFamily: 'body',
  fontSize: 4,
  lineHeight: 2,
  mb: 4,
};

const Heading3 = styled.h3<StyledHeadingProps>(composedStyles);

Heading3.defaultProps = {
  fontFamily: 'body',
  fontSize: 3,
  lineHeight: 2,
  mb: 3,
};

const Heading4 = styled.h4<StyledHeadingProps>(composedStyles);

Heading4.defaultProps = {
  fontFamily: 'body',
  fontSize: 2,
  lineHeight: 2,
  mb: 3,
};

const Heading5 = styled.h5<StyledHeadingProps>(composedStyles);

Heading5.defaultProps = {
  fontFamily: 'body',
  fontSize: 1,
  lineHeight: 2,
  mb: 3,
};
