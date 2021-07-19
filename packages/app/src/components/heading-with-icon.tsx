import css from '@styled-system/css';
import React from 'react';
import { VisuallyHidden } from '~/components/visually-hidden';
import { Box } from './base';
import { Heading, HeadingLevel } from './typography';

type HeadingWithIconProps = {
  title: string;
  icon: JSX.Element;
  subtitle?: string;
  headingLevel?: HeadingLevel;
  category?: string;
  screenReaderCategory?: string;
};

const iconSizeForHeadingLevel: Record<HeadingLevel, string> = {
  1: '4rem',
  2: '3.5rem',
  3: '2.5rem',
  4: '2rem',
  5: '1.75rem',
};

export function HeadingWithIcon({
  icon,
  title,
  subtitle,
  headingLevel = 3,
  category,
  screenReaderCategory,
  ...headingProps
}: HeadingWithIconProps) {
  return (
    <Box
      display="flex"
      flexDirection="row"
      flexWrap="nowrap"
      alignItems="center"
    >
      <Icon size={iconSizeForHeadingLevel[headingLevel]}>{icon}</Icon>

      <Box>
        {category && (
          <Heading level={1} m={0} fontSize={2} color="category">
            {category}
            {screenReaderCategory && (
              <VisuallyHidden>{`- ${screenReaderCategory}`}</VisuallyHidden>
            )}
          </Heading>
        )}
        <Heading
          {...headingProps}
          level={headingLevel}
          lineHeight={1.3}
          fontSize={{ _: 3, md: 4 }}
          // pb={category ? 3 : 0}
          m={0}
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

function Icon({ children, size }: { children: React.ReactNode; size: string }) {
  return (
    <Box
      flex="0 0 auto"
      display="flex"
      flexDirection="row"
      flexWrap="nowrap"
      justifyContent="center"
      alignItems="center"
      transform="translateY(7px)"
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
