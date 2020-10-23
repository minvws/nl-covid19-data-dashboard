import { useState, useEffect } from 'react';
import { useRouter, Router } from 'next/router';

interface MenuState {
  isMenuOpen: boolean;
  openMenu: (event?: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

/**
 * Keep track of the menu state and handle the opening and closing.
 * Returns controls to the state.
 */
export function useMenuState(defaultOpen = false): MenuState {
  const [isMenuOpen, setMenuOpen] = useState<boolean>(defaultOpen);

  const router = useRouter();

  /*
   * Retrieve the URL for the current route with menu state,
   * including query params.
   */
  function getFullMenuUrl(): string {
    let fullMenuUrl = `${router.pathname}?menu`;

    if (router.query.code) {
      fullMenuUrl = fullMenuUrl.replace('[code]', router.query.code as string);
    }

    const queryParams = Object.entries(router.query)
      .filter(([key]) => !['menu', 'code'].includes(key))
      .map(([key, value]) => {
        return [
          encodeURIComponent(key),
          encodeURIComponent(value as string),
        ].join('=');
      })
      .join('&');

    if (queryParams) {
      fullMenuUrl += `&${queryParams}`;
    }

    return fullMenuUrl;
  }

  const openMenu = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent> | undefined
  ): void => {
    event?.preventDefault();

    const fullMenuUrl = getFullMenuUrl();
    router.push(router.pathname, fullMenuUrl, { shallow: true });
  };

  const setMenuFromRouterState = (url: string) => {
    setMenuOpen(url.includes('?menu'));
  };

  /**
   * Handle the closing of the menu
   * If closed with blur the menu would open too soon
   * This closes the menu at the moment the content is loaded and displayed,
   * (just as non-JS would kept displayed)
   * */
  useEffect(() => {
    Router.events.on('beforeHistoryChange', setMenuFromRouterState);
    Router.events.on('routeChangeComplete', setMenuFromRouterState);
    return () => {
      Router.events.off('beforeHistoryChange', setMenuFromRouterState);
      Router.events.off('routeChangeComplete', setMenuFromRouterState);
    };
  }, []);

  return {
    isMenuOpen,
    openMenu,
  };
}
