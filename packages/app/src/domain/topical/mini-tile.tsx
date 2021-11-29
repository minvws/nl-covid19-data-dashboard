import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { Message } from '~/components/message';
import { Heading } from '~/components/typography';
import { asResponsiveArray } from '~/style/utils';

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
    <Box spacing={3}>
      <Box spacing={2}>
        <Heading level={3} as="h2">
          <Box as="span" fontWeight="bold" display="flex" alignItems="center">
            <Icon>{icon}</Icon>
            <Box as="span" display="inline-block" position="relative">
              {title}
            </Box>
          </Box>
        </Heading>
      </Box>
      {warning && (
        <Box maxWidth="maxWidthText" pb={2}>
          <Message variant="warning">{warning}</Message>
        </Box>
      )}
      <Box display="grid" gridTemplateColumns={{ _: '1fr', md: '1fr 1fr' }}>
        <Box pr={{ _: 0, md: 3 }}>{children}</Box>
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
    height: '2.5rem',
    mr: asResponsiveArray({ _: 2, md: 3 }),

    svg: {
      width: '2rem',
      height: '100%',
    },
  })
);
