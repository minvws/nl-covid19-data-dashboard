import css from '@styled-system/css';
import React from 'react';
import { Box } from './base';
import { Heading, HeadingLevel } from './typography';

type HeadingWithIconProps = {
  title: string;
  icon: JSX.Element;
  headingLevel?: HeadingLevel;
};

const iconSizeForHeadingLevel: Record<HeadingLevel, string> = {
  1: '4rem',
  2: '4rem',
  3: '2.5rem',
  4: '2rem',
  5: '1.75rem',
};

export function HeadingWithIcon(props: HeadingWithIconProps) {
  const { icon, title, headingLevel = 3 } = props;

  return (
    <Box
      display="flex"
      flexDirection="row"
      flexWrap="nowrap"
      alignItems="center"
    >
      <Icon size={iconSizeForHeadingLevel[headingLevel]}>{icon}</Icon>
      <Heading level={headingLevel} hyphens="auto">
        {title}
      </Heading>
    </Box>
  );
}

function Icon({ children, size }: { children: React.ReactNode; size: string }) {
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
