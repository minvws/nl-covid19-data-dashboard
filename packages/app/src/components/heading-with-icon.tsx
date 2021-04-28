import css from '@styled-system/css';
import React from 'react';
import { Box } from './base';
import { Heading, HeadingProps } from './typography';

type HeadingWithIconProps = {
  title: string;
  icon: JSX.Element;
  subtitle?: string;
  headingLevel?: 1 | 2 | 3 | 4 | 5;
} & Omit<HeadingProps, 'children' | 'level'>;

function Icon({
  children,
  small,
}: {
  children: React.ReactNode;
  small: boolean;
}) {
  const size = small ? '2.5rem' : '4rem';

  return (
    <Box
      flex="0 0 auto"
      display="flex"
      flexDirection="row"
      flexWrap="nowrap"
      justifyContent="center"
      alignItems="center"
      padding={0}
      marginRight={0}
      css={css({
        width: size,
        height: size,
        '& svg': {
          width: size,
          height: size,
        },
      })}
    >
      {children}
    </Box>
  );
}

export function HeadingWithIcon(props: HeadingWithIconProps) {
  const { icon, title, subtitle, headingLevel = 3, ...headingProps } = props;

  return (
    <Box
      display="flex"
      flexDirection="row"
      flexWrap="nowrap"
      alignItems="center"
      mb={-2}
    >
      <Icon small={headingLevel > 2}>{icon}</Icon>

      <Box>
        <Heading level={headingLevel} mb={0} lineHeight={1.3} {...headingProps}>
          {title}
        </Heading>
        {subtitle}
      </Box>
    </Box>
  );
}
