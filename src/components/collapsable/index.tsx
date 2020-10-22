import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@reach/disclosure';
import { ReactNode, useState, createRef, useEffect, useCallback } from 'react';

import styles from './collapsable.module.scss';
import { useWindowResizeDebounce } from '~/utils/useWindowResizeDebounce';

interface CollapsableProps {
  summary: string;
  children: ReactNode;
  id?: string;
}

export function Collapsable(props: CollapsableProps) {
  const { summary, children, id } = props;

  const panelReference = createRef<HTMLDivElement>();
  const [open, setOpen] = useState(false);

  function toggle() {
    setOpen(!open);
    requestAnimationFrame(setLinkTabability);
  }

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
   * Makes sure the content height is appropriate to be able to animate.
   * This is done on page load and before opening or closing the collapsable.
   */
  const setContentHeight = useCallback(() => {
    const node = panelReference.current as HTMLDivElement;
    node.style.maxHeight = `${node.scrollHeight}px`;
  }, [panelReference]);

  /**
   * Collapsed content should not be accessible using the tab functionality.
   */
  const setLinkTabability = useCallback(() => {
    if (!panelReference.current) {
      return;
    }

    const links = panelReference.current.querySelectorAll('a');
    Array.from(links).forEach((link) => {
      link.setAttribute('tabindex', open ? '0' : '-1');
    });
  }, [open, panelReference]);

  useEffect(() => {
    checkLocationHash();
    setLinkTabability();
    setContentHeight();
  }, [checkLocationHash, setLinkTabability, setContentHeight]);

  useEffect(() => {
    window.addEventListener('hashchange', checkLocationHash, false);
    return () => {
      window.removeEventListener('hashchange', checkLocationHash, false);
    };
  }, []); // should not use dependancies in array: use effect mimics mount / unmount

  useWindowResizeDebounce(setContentHeight, 400);

  return (
    <section id={id} className={styles.root}>
      <Disclosure open={open} onChange={toggle}>
        <DisclosureButton
          className={styles.summary}
          onKeyDown={setContentHeight}
          onClick={setContentHeight}
        >
          {summary}
        </DisclosureButton>
        <DisclosurePanel ref={panelReference} className={styles.content}>
          {children}
        </DisclosurePanel>
      </Disclosure>
    </section>
  );
}
