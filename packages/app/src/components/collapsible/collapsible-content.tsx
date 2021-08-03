import { css } from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { Box, BoxProps } from '~/components/base';
import { useCollapsible } from '~/utils/use-collapsible';

interface CollapsibleContentProps extends BoxProps {
  label: string;
  children: ReactNode;
}

export function CollapsibleContent({
  label,
  children,
}: CollapsibleContentProps) {
  const collapsible = useCollapsible();

  return (
    <Box as="section">
      {collapsible.button(
        <Label>
          {label} {collapsible.chevron}
        </Label>
      )}
      {collapsible.content(children)}
    </Box>
  );
}

const Label = styled.button(
  css({
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    overflow: 'visible',
    m: 0,
    px: 0,
    py: 3,
    width: '100%',
    bg: 'transparent',
    border: 'none',
    color: 'blue',
    fontFamily: 'body',
    fontWeight: 'bold',
    fontSize: '1rem',
    textAlign: 'left',
    position: 'relative',
    cursor: 'pointer',

    '&:focus': {
      outlineWidth: '1px',
      outlineStyle: 'dashed',
      outlineColor: 'blue',
    },
  })
);
