import css from '@styled-system/css';
import React from 'react';
import { Box } from './base';
import { Heading, HeadingProps, HeadingLevel } from './typography';

type HeadingWithIconProps = {
  title: string;
  icon: JSX.Element;
  subtitle?: string;
  headingLevel?: HeadingLevel;
} & Omit<HeadingProps, 'children' | 'level'>;

const iconSizeForHeadingLevel: Record<HeadingLevel, string> = {
  1: '4rem',
  2: '4rem',
  3: '2.5rem',
  4: '2rem',
  5: '1.75rem',
};

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

export function HeadingWithIcon(props: HeadingWithIconProps) {
  const {
    icon,
    title,
    subtitle,
    headingLevel = 3,
    mb = -2,
    ml = 0,
    ...headingProps
  } = props;

  return (
    <Box
      display="flex"
      flexDirection="row"
      flexWrap="nowrap"
      alignItems="center"
      mb={mb}
      ml={ml}
    >
      <Icon size={iconSizeForHeadingLevel[headingLevel]}>{icon}</Icon>

      <Box>
        <Heading
          level={headingLevel}
          mb={0}
          lineHeight={1.3}
          {...headingProps}
          css={css({
            hyphens: 'auto',
          })}
        >
          {title}
        </Heading>
        {subtitle}
      </Box>
    </Box>
  );
}
