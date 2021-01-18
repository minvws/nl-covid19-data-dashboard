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

const composedStyles = [
  css({
    fontFamily: 'body',
    lineHeight: 2,
    mt: 0,
  }),
  margin,
  padding,
  typography,
  color,
];

const Heading1 = styled.h1<StyledHeadingProps>(
  css({ fontSize: 5, mb: 4 }),
  ...composedStyles
);

const Heading2 = styled.h2<StyledHeadingProps>(
  css({ fontSize: 4, mb: 3 }),
  ...composedStyles
);

const Heading3 = styled.h3<StyledHeadingProps>(
  css({ fontSize: 3, mb: 3 }),
  ...composedStyles
);

const Heading4 = styled.h4<StyledHeadingProps>(
  css({ fontSize: 2, mb: 3 }),
  ...composedStyles
);

const Heading5 = styled.h5<StyledHeadingProps>(
  css({ fontSize: 1, mb: 3 }),
  ...composedStyles
);
