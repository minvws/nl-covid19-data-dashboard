import { css } from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { Box, BoxProps } from '~/components/base';
import { space } from '~/style/theme';
import { useCollapsible } from '~/utils/use-collapsible';

interface CollapsibleContentProps extends BoxProps {
  label: string;
  children: ReactNode;
}

export function CollapsibleContent({ label, children }: CollapsibleContentProps) {
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
    margin: '0',
    paddingX: '0',
    paddingY: space[3],
    width: '100%',
    bg: 'transparent',
    border: 'none',
    color: 'blue8',
    fontFamily: 'body',
    fontWeight: 'bold',
    fontSize: '1rem',
    textAlign: 'left',
    position: 'relative',
    cursor: 'pointer',

    '&:focus': {
      outlineWidth: '1px',
      outlineStyle: 'dashed',
      outlineColor: 'blue8',
    },
  })
);
