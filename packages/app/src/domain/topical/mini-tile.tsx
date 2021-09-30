import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { Message } from '~/components/message';
import { Heading } from '~/components/typography';

export type MiniTileProps = {
  icon: JSX.Element;
  title: string;
  text: ReactNode;
  warning?: string;
  children: ReactNode;
};

export function MiniTile(props: MiniTileProps) {
  const { icon, text, title, warning, children } = props;

  return (
    <Box ml={{ _: undefined, md: 3 }}>
      <Box>
        <Heading level={3} as="h2">
          <Box as="span" fontWeight="bold" display="flex" alignItems="center">
            <Icon>{icon}</Icon>
            <Box as="span" display="inline-block" position="relative">
              {title}
            </Box>
          </Box>
        </Heading>
        {warning && (
          <Box pb={2}>
            <Message variant="warning">{warning}</Message>
          </Box>
        )}
      </Box>
      <Box display="grid" gridTemplateColumns={{ _: '1fr', md: '1fr 1fr' }}>
        <Box>{children}</Box>
        <Box position="relative" pl={{ _: 0, md: 4 }}>
          <Box spacing={3} py={{ _: 3, md: 0 }}>
            {text}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

const Icon = styled.span(
  css({
    svg: {
      height: '3rem',
      mr: 3,
      ml: '2px',
    },
  })
);
