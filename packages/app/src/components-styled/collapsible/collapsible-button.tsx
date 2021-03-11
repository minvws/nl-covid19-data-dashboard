import { useState } from 'react';
import css from '@styled-system/css';
import styled from 'styled-components';
import { asResponsiveArray } from '~/style/utils';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@reach/disclosure';

import useResizeObserver from 'use-resize-observer';
import { Box } from '~/components-styled/base';
import { useSetLinkTabbability } from './use-set-link-tabbability';

interface CollapsibleButtonProps {
  children: React.ReactNode;
  label: string;
}

export const CollapsibleButton = ({
  label,
  children,
}: CollapsibleButtonProps) => {
  const { ref: contentRef, height: contentHeight } = useResizeObserver();
  const { ref: buttonRef, height: buttonHeight } = useResizeObserver();
  const [open, setOpen] = useState(false);
  const { wrapperRef } = useSetLinkTabbability(open);

  const openHeight =
    buttonHeight && contentHeight ? buttonHeight + contentHeight : 0;
  return (
    <Container minHeight={open ? openHeight : 0}>
      <Disclosure open={open} onChange={() => setOpen(!open)}>
        <ExpandButton ref={buttonRef}>
          {label}
          <Chevron open={open} />
        </ExpandButton>

        <Panel ref={wrapperRef} style={{ height: open ? contentHeight : 0 }}>
          <div ref={contentRef}>{children}</div>
        </Panel>
      </Disclosure>
    </Container>
  );
};

const Container = styled(Box).attrs({ as: 'section' })(
  css({
    position: 'relative',
    display: 'inline-flex',
    flexDirection: 'column',
    padding: 0,
    margin: '0 auto',
    transitionProperty: 'min-width, min-height',
    transitionDuration: '0.5s',
    bg: 'tileGray',
    width: '100%',
  })
);

const Panel = styled(DisclosurePanel)(
  css({
    transitionProperty: 'height, opacity',
    transitionDuration: '0.5s',
    width: '100%',
    overflow: 'hidden',
    opacity: 0,
    display: 'block',
    '&[data-state="open"]': {
      opacity: 1,
    },
  })
);

const ExpandButton = styled(DisclosureButton)(
  css({
    position: 'relative',
    px: asResponsiveArray({ _: 2, sm: 4 }),
    py: 3,
    border: 'none',
    background: 'none',
    font: 'inherit',
    color: 'blue',
    cursor: 'pointer',
    fontWeight: 'bold',
    zIndex: 1,

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
