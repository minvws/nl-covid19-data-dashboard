import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@reach/disclosure';
import { css } from '@styled-system/css';
import { ReactNode, useState } from 'react';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer';
import { Box, BoxProps } from '~/components/base';
import { useSetLinkTabbability } from './use-set-link-tabbability';

const Label = styled((props) => <DisclosureButton {...props} />)(
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

    '&:active[data-state="collapsed"]': {
      bg: 'shadow',
    },

    '&::after': {
      backgroundImage: 'url("/images/chevron-down.svg")',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '0.9em 0.55em',
      content: '""',
      flex: '0 0 1.9em',
      height: '0.55em',
      mr: -2,
      mt: '0.35em',
      py: 0,
      transition: 'transform 0.4s',
    },

    '&[data-state="open"]:after': {
      transform: 'rotate(180deg)',
    },
  })
);

const Panel = styled((props) => <DisclosurePanel {...props} />)(
  css({
    display: 'block',
    opacity: 0,
    overflow: 'hidden',
    py: 0,
    transition: 'height 0.4s ease-in-out, opacity 0.4s ease-in-out',
    '&[data-state="open"]': {
      opacity: 1,
    },
  })
);

interface CollapsibleContentProps extends BoxProps {
  label: string;
  children: ReactNode;
}

export const CollapsibleContent = ({
  label,
  children,
}: CollapsibleContentProps) => {
  const [open, setOpen] = useState(false);
  const { wrapperRef } = useSetLinkTabbability(open);

  const { ref, height: contentHeight } = useResizeObserver();

  return (
    <Box as="section">
      <Disclosure open={open} onChange={() => setOpen(!open)}>
        <Label>{label}</Label>

        <Panel
          style={{
            /* panel max height is only controlled when collapsed, or during animations */
            height: open ? contentHeight : 0,
          }}
        >
          <div ref={wrapperRef}>
            <div
              ref={ref}
              css={css({
                /**
                 * Outside margins of children are breaking height calculations ヽ(ಠ_ಠ)ノ..
                 * We'll add `overflow: hidden` in order to fix this.
                 */
                overflow: 'hidden',
              })}
            >
              {children}
            </div>
          </div>
        </Panel>
      </Disclosure>
    </Box>
  );
};
