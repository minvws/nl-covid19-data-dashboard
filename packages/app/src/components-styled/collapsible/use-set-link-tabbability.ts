import { useEffect, useRef, useCallback } from 'react';

export function useSetLinkTabbability(open: boolean) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  /**
   * Collapsed content should not be accessible using the tab functionality.
   */
  const setLinkTabability = useCallback(
    (open) => {
      if (!wrapperRef.current) {
        return;
      }

      const links = wrapperRef.current?.querySelectorAll('a');
      Array.from(links).forEach((link) => {
        link.setAttribute('tabindex', open ? '0' : '-1');
      });
    },
    [wrapperRef]
  );

  useEffect(() => setLinkTabability(open), [setLinkTabability, open]);

  return { wrapperRef } as const;
}
