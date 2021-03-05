import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@reach/disclosure';
import { css } from '@styled-system/css';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer';
import { Box, BoxProps } from './base';

const Summary = styled(DisclosureButton)(
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

const Panel = styled(DisclosurePanel)(
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

interface CollapsableProps extends BoxProps {
  summary: string;
  children: ReactNode;
  id?: string;
  hideBorder?: boolean;
}

export const Collapsible = ({
  summary,
  children,
  id,
  hideBorder,
}: CollapsableProps) => {
  const [open, setOpen] = useState(true);
  const panelReference = useRef<HTMLDivElement>(null);

  const { ref, height: contentHeight } = useResizeObserver();

  /**
   * Checks the hash part of the URL to see if it matches this instances id.
   * If so, the collapsible needs to be opened.
   */
  useEffect(() => {
    const isOpenedByQueryParam = window.location.hash.substr(1) === id;
    setOpen(isOpenedByQueryParam);
  }, [id]);

  /**
   * Collapsed content should not be accessible using the tab functionality.
   */
  const setLinkTabability = useCallback(
    (open) => {
      if (!panelReference.current) {
        return;
      }

      const links = panelReference.current?.querySelectorAll('a');
      Array.from(links).forEach((link) => {
        link.setAttribute('tabindex', open ? '0' : '-1');
      });
    },
    [panelReference]
  );

  useEffect(() => setLinkTabability(open), [setLinkTabability, open]);

  return (
    <Box
      as="section"
      borderTop={hideBorder ? undefined : '1px solid'}
      borderTopColor={hideBorder ? undefined : 'lightGray'}
      id={id}
    >
      <Disclosure open={open} onChange={() => setOpen(!open)}>
        <Summary>
          {summary}
          {id && (
            <AnchorLink onClick={(e) => e.stopPropagation()} href={`#${id}`}>
              #
            </AnchorLink>
          )}
        </Summary>

        <Panel
          ref={panelReference}
          style={{
            /* panel max height is only controlled when collapsed, or during animations */
            height: open ? contentHeight : 0,
          }}
        >
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
        </Panel>
      </Disclosure>
    </Box>
  );
};
