import { useEffect, useRef, useCallback } from 'react';

export function useSetCollapsibleLinkTabbability(open: boolean) {
  const panelRef = useRef<HTMLDivElement>(null);

  /**
   * Collapsed content should not be accessible using the tab functionality.
   */
  const setLinkTabability = useCallback(
    (open) => {
      if (!panelRef.current) {
        return;
      }

      const links = panelRef.current?.querySelectorAll('a');
      Array.from(links).forEach((link) => {
        link.setAttribute('tabindex', open ? '0' : '-1');
      });
    },
    [panelRef]
  );

  useEffect(() => setLinkTabability(open), [setLinkTabability, open]);

  return { panelRef } as const;
}
