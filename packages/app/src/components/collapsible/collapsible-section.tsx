import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@reach/disclosure';
import { css } from '@styled-system/css';
import { ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer';
import { Box, BoxProps } from '~/components/base';
import { useSetLinkTabbability } from './use-set-link-tabbability';

const Summary = styled((props) => <DisclosureButton {...props} />)(
  css({
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    overflow: 'visible',
    width: '100%',
    m: 0,
    p: 3,
    bg: 'transparent',
    border: 'none',
    color: 'blue',
    fontFamily: 'body',
    fontWeight: 'bold',
    fontSize: '1.25rem',
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
      ml: 'auto',
      mr: -2,
      mt: '0.35em',
      py: 0,
    },

    '&[data-state="open"]:after': {
      transform: 'rotate(180deg)',
    },
  })
);

const AnchorLink = styled.a(
  css({
    color: 'lightGray',
    px: 3,
    py: 1,
    transition: 'opacity 0.3s',
    fontSize: 2,
    textDecoration: 'none',
    position: 'absolute',
    right: '100%',
    '&:hover, &:focus': {
      color: 'blue',
    },
    '[data-state="collapsed"] &': {
      opacity: 0,
    },
  })
);

const Panel = styled((props) => <DisclosurePanel {...props} />)(
  css({
    display: 'block',
    opacity: 0,
    overflow: 'hidden',
    px: 3,
    py: 0,
    transition: 'height 0.4s ease-in-out, opacity 0.4s ease-in-out',
    '&[data-state="open"]': {
      opacity: 1,
    },
  })
);

function locationHashEquals(id: string) {
  return window.location.hash === `#${id}`;
}

interface CollapsibleSectionProps extends BoxProps {
  summary: string;
  children: ReactNode;
  id?: string;
  hideBorder?: boolean;
}

export const CollapsibleSection = ({
  summary,
  children,
  id,
  hideBorder,
}: CollapsibleSectionProps) => {
  /* Start in an open state so it is open when JS is disabled */
  const [isOpen, setIsOpen] = useState(true);
  const { wrapperRef } = useSetLinkTabbability(isOpen);

  const { ref, height: contentHeight } = useResizeObserver();

  /**
   * Checks the hash part of the URL to see if it matches this instances id.
   * If so, the collapsible needs to be opened.
   */
  useEffect(() => {
    function handleHashChange() {
      if (id && locationHashEquals(id)) {
        setIsOpen(true);
      }
    }

    window.addEventListener('hashchange', handleHashChange);

    /**
     * Since we are open by default, we need to close all sections which are not
     * opened by a hash now
     */
    setIsOpen(!!id && locationHashEquals(id));

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [id]);

  return (
    <Box
      as="section"
      borderTop={hideBorder ? undefined : '1px solid'}
      borderTopColor={hideBorder ? undefined : 'lightGray'}
      id={id}
    >
      <Disclosure open={isOpen} onChange={() => setIsOpen(!isOpen)}>
        <Summary>
          {summary}
          {id && (
            <AnchorLink onClick={(e) => e.stopPropagation()} href={`#${id}`}>
              #
            </AnchorLink>
          )}
        </Summary>

        <Panel
          style={{
            /* panel max height is only controlled when collapsed, or during animations */
            height: isOpen ? contentHeight : 0,
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
