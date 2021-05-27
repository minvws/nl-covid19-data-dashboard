import css from '@styled-system/css';
import React from 'react';
import { Box } from './base';
import { IconContainer } from './icon-container';
import { Heading, HeadingProps } from './typography';

type HeadingWithIconProps = {
  title: string;
  icon: JSX.Element;
  subtitle?: string;
  headingLevel?: 1 | 2 | 3 | 4 | 5;
} & Omit<HeadingProps, 'children' | 'level'>;

function Icon({ children, small }: { children: JSX.Element; small: boolean }) {
  const size = small ? '2.5rem' : '4rem';

  return (
    <IconContainer height={size} width={size} centered>
      {children}
    </IconContainer>
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
