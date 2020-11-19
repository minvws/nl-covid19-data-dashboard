import css from '@styled-system/css';
import React, { useMemo } from 'react';
import { Box } from './base';
import { Heading } from './typography';

interface IProps {
  title: string;
  Icon: React.ReactNode;
  subtitle?: string;
  as?: 'h2' | 'h3';
}

export function TitleWithIcon(props: IProps) {
  const { Icon, title, subtitle, as = 'h3' } = props;

  const headingLevel = as === 'h3' ? 3 : 2;

  const cssProps = useMemo(() => {
    return as === 'h3'
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
  }, [as]);

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
        {Icon}
      </Box>

      <Box>
        <Heading
          level={headingLevel}
          fontSize={as === 'h3' ? 2 : undefined}
          mb={0}
        >
          {title}
        </Heading>
        {subtitle}
      </Box>
    </Box>
  );
}
