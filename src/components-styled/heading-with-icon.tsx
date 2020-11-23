import css from '@styled-system/css';
import React from 'react';
import { Box } from './base';
import { Heading } from './typography';

interface IProps {
  title: string;
  icon: JSX.Element;
  subtitle?: string;
  headingLevel?: 2 | 3;
}

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

export function HeadingWithIcon(props: IProps) {
  const { icon, title, subtitle, headingLevel = 3 } = props;

  return (
    <Box
      display="flex"
      flexDirection="row"
      flexWrap="nowrap"
      alignItems="center"
      mb={-2}
    >
      <Icon small={headingLevel === 3}>{icon}</Icon>

      <Box>
        <Heading
          level={headingLevel}
          fontSize={headingLevel === 3 ? 2 : undefined}
          mb={0}
        >
          {title}
        </Heading>
        {subtitle}
      </Box>
    </Box>
  );
}
