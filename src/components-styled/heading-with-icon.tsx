import css from '@styled-system/css';
import React, { useMemo } from 'react';
import { Box } from './base';
import { Heading } from './typography';

interface IProps {
  title: string;
  icon: JSX.Element;
  subtitle?: string;
  headingLevel?: 2 | 3;
}

export function HeadingWithIcon(props: IProps) {
  const { icon, title, subtitle, headingLevel = 3 } = props;

  const cssProps = useMemo(() => {
    return headingLevel === 3
      ? {
          width: '2.5rem',
          height: '2.5rem',
          '& svg': { width: '2.5rem', height: '2.5rem' },
        }
      : {
          width: '4rem',
          height: '4rem',
          '& svg': { width: '4rem', height: '4rem' },
        };
  }, [headingLevel]);

  return (
    <Box
      display="flex"
      flexDirection="row"
      flexWrap="nowrap"
      alignItems="center"
      mb={-2}
    >
      <Box
        flex="0 0 auto"
        display="flex"
        flexDirection="row"
        flexWrap="nowrap"
        justifyContent="center"
        alignItems="center"
        padding={0}
        marginRight={0}
        css={css(cssProps)}
      >
        {icon}
      </Box>

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
