import { useState } from 'react';
import css from '@styled-system/css';
import styled from 'styled-components';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@reach/disclosure';

import useResizeObserver from 'use-resize-observer';
import { Box } from './base';

interface CollapsibleButtonProps {
  children: React.ReactNode;
  label: string;
}

export function CollapsibleButton({ label, children }: CollapsibleButtonProps) {
  const { ref: contentRef, height: contentHeight } = useResizeObserver();
  const { ref: buttonRef, height: buttonHeight } = useResizeObserver();
  const [open, setOpen] = useState(false);

  const openHeight =
    buttonHeight && contentHeight ? buttonHeight + contentHeight : 0;
  return (
    <Box as="section">
      <Disclosure open={open} onChange={() => setOpen(!open)}>
        <Box display="flex" alignItems="center">
          <Background
            minWidth={open ? '100%' : 0}
            css={css({
              '&::after': {
                content: '""',
                position: 'absolute',
                zIndex: 0,
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                bg: 'tileGray',
                minHeight: open ? openHeight : 0,
                transitionProperty: 'min-height',
                transitionDuration: '0.5s',
              },
            })}
          >
            <ExpandButton ref={buttonRef}>
              {label}
              <Chevron open={open} />
            </ExpandButton>
          </Background>
        </Box>
        <Content style={{ height: open ? contentHeight : 0 }}>
          <div ref={contentRef}>{children}</div>
        </Content>
      </Disclosure>
    </Box>
  );
}

const Background = styled(Box)(
  css({
    position: 'relative',
    padding: 0,
    margin: '0 auto',
    transitionProperty: 'min-width, min-height',
    transitionDuration: '0.5s',
  })
);

const Content = styled(DisclosurePanel)(
  css({
    display: 'block',
    overflow: 'hidden',
    transition: 'height .3s, opacity 0.5s',
    width: '100%',
    opacity: 0,
    '&[data-state="open"]': {
      opacity: 1,
      transition: 'height .5s, opacity 1s 0.2s',
    },
  })
);

const ExpandButton = styled(DisclosureButton)(
  css({
    position: 'relative',
    px: 4,
    py: 3,
    border: 'none',
    background: 'none',
    font: 'inherit',
    color: 'blue',
    cursor: 'pointer',
    fontWeight: 'bold',
    zIndex: 1,
    width: '100%',

    '&:focus': {
      outlineWidth: '1px',
      outlineStyle: 'dashed',
      outlineColor: 'blue',
    },

    '&[data-state="open"]:after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      bg: 'lightGray',
      height: '1px',
    },
  })
);

const Chevron = styled.div<{
  open: boolean;
}>((x) =>
  css({
    ml: 2,
    backgroundImage: 'url("/images/chevron-down.svg")',
    backgroundSize: '0.9em 0.5em',
    backgroundPosition: '0 50%',
    backgroundRepeat: 'no-repeat',
    height: '0.5em',
    width: '1em',
    display: 'inline-block',
    transitionProperty: 'transform',
    transitionDuration: '0.5s',
    transform: x.open ? 'rotate(-180deg)' : '',
  })
);
