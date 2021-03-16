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
  const { ref: contentRef, height: contentHeight = 0 } = useResizeObserver();
  const { ref: buttonRef, height: buttonHeight = 0 } = useResizeObserver();
  const [isOpen, setIsOpen] = useState(false);
  const { wrapperRef } = useSetLinkTabbability(isOpen);

  /**
   * falback to `undefined` to prevent an initial animation from `0` to
   * measured height
   */
  const height = buttonHeight + (isOpen ? contentHeight : 0) || undefined;

  return (
    <Container style={{ height }}>
      <Disclosure open={isOpen} onChange={() => setIsOpen(!isOpen)}>
        <div
          ref={buttonRef}
          css={css({ display: 'flex', justifyContent: 'center' })}
        >
          <DisclosureButton>
            {label} {buttonHeight} {contentHeight}
            <Chevron open={isOpen} />
          </DisclosureButton>
        </div>

        <DisclosurePanel>
          <div ref={contentRef} style={{ height }}>
            <div ref={wrapperRef}>{children}</div>
          </div>
        </DisclosurePanel>
      </Disclosure>
    </Container>
  );
};

const Container = styled(Box).attrs({ as: 'section' })(
  css({
    borderRadius: 1,
    position: 'relative',
    display: 'inline-flex',
    flexDirection: 'column',
    padding: 0,
    margin: '0 auto',
    transitionProperty: 'height',
    transitionDuration: '0.5s',
    bg: 'tileGray',
    width: '100%',

    //button
    '[data-reach-disclosure-button]': {
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
      width: '100%',
    },
    '[data-reach-disclosure-button]:focus': {
      outlineWidth: '1px',
      outlineStyle: 'dashed',
      outlineColor: 'blue',
    },
    '[data-reach-disclosure-button][data-state="open"]:after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      bg: 'lightGray',
      height: '1px',
    },
    //panel
    '[data-reach-disclosure-panel]': {
      transitionProperty: 'height, opacity',
      transitionDuration: '0.5s',
      width: '100%',
      overflow: 'hidden',
      opacity: 0,
      display: 'block',
    },
    '[data-reach-disclosure-panel][data-state="open"]': {
      opacity: 1,
    },
    '[data-reach-disclosure-panel][data-state="collapsed"]': {
      height: 0,
      opacity: 0,
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
