import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@reach/disclosure';
import { ReactNode, useState, useEffect, useCallback } from 'react';

import { BoxProps, Box } from './base';
import styled from 'styled-components';
import { css } from '@styled-system/css';

const Summary = styled(DisclosureButton)(
  css({
    alignItems: 'flex-start',
    bg: 'transparent',
    border: 'none',
    color: '#01689b',
    cursor: 'pointer',
    display: 'flex',
    fontSize: 3,
    fontWeight: 'bold',
    justifyContent: 'space-between',
    m: 0,
    p: 3,
    textAlign: 'left',
    width: '100%',

    '&:focus': {
      outline: '1px dashed #01689b',
    },

    '&:active[data-state="collapsed"]': {
      bg: '#ebebeb',
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
    },

    '&[data-state="open"]:after': {
      transform: 'rotate(180deg)',
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
    transition: 'max-height 0.4s ease-in-out, opacity 0.4s ease-in-out',

    '&[data-state="open"]': {
      opacity: 1,
    },
  })
);

interface CollapsableProps extends BoxProps {
  summary: string;
  children: ReactNode;
  id?: string;
}

export const Collapsable = (props: CollapsableProps) => {
  const { summary, children, id } = props;

  const [open, setOpen] = useState(false);
  const [panelHeight, setPanelHeight] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState(false);

  let panelReference: HTMLDivElement | undefined = undefined;

  /* Store the latest reference to the panel */
  const setPanelReference = (element: HTMLDivElement) => {
    if (!element) {
      return;
    }
    panelReference = element;
  };

  function toggle() {
    if (isAnimating) {
      return;
    }
    setOpen(!open);
    requestAnimationFrame(() => {
      setLinkTabability(!open);
      startAnimation(!open);
    });
  }

  /**
   * Starts the panel animation by passing the proper from and to heights
   */
  const startAnimation = (opening: boolean) => {
    setIsAnimating(true);
    const height = panelReference?.scrollHeight ?? 0;
    const from = opening ? 0 : height;
    const to = opening ? height : 0;
    animatePanelHeight(from, to);
  };

  /**
   * Animate the panel height:
   * set from height,
   * wait for browser to render it,
   * set destination height
   */
  const animatePanelHeight = (from: number, to: number) => {
    setPanelHeight(from);
    requestAnimationFrame(() => {
      setPanelHeight(to);
    });
  };

  /**
   * Checks the hash part of the URL to see if it matches this instances id.
   * If so, the collapsable needs to be opened.
   */
  const checkLocationHash = useCallback(() => {
    if (window?.location.hash.substr(1) === id) {
      setOpen(true);
    }
  }, [id]);

  /**
   * Collapsed content should not be accessible using the tab functionality.
   */
  const setLinkTabability = useCallback(
    (open) => {
      if (!panelReference) {
        return;
      }

      const links = panelReference.querySelectorAll('a');
      Array.from(links).forEach((link) => {
        link.setAttribute('tabindex', open ? '0' : '-1');
      });
    },
    [panelReference]
  );

  useEffect(() => {
    checkLocationHash();
    setLinkTabability(open);
  }, [checkLocationHash, setLinkTabability, open]);

  useEffect(() => {
    window.addEventListener('hashchange', checkLocationHash, false);
    return () => {
      window.removeEventListener('hashchange', checkLocationHash, false);
    };
    /* eslint-disable-next-line */
  }, []); // should not use dependencies in array: use effect mimics mount / unmount

  return (
    <Box as="section" borderTop={'1px solid #dfdfdf'} {...(props as any)}>
      <Disclosure open={open} onChange={toggle}>
        <Summary>{summary}</Summary>
        <Panel
          ref={setPanelReference}
          onTransitionEnd={() => setIsAnimating(false)}
          style={{
            /* panel max height is only controlled when collapsed, or during animations */
            maxHeight: !open || isAnimating ? `${panelHeight}px` : undefined,
          }}
        >
          {children}
        </Panel>
      </Disclosure>
    </Box>
  );
};
