import { useState, useEffect } from 'react';
import { useRouter, Router } from 'next/router';

interface MenuState {
  isMenuOpen: boolean;
  openMenu: (event?: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  handleMenuClick: (
    event?: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => void;
}

/**
 * Keep track of the menu state and handle the opening and closing.
 * Returns controls to the state.
 */
export function useMenuState(defaultOpen = false): MenuState {
  const [isMenuOpen, setMenuOpen] = useState<boolean>(defaultOpen);

  const router = useRouter();

  const openMenu = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent> | undefined
  ): void => {
    event?.preventDefault();

    router.push(
      router.pathname + '?menu',
      router.asPath.split('?')[0] + '?menu',
      { shallow: true }
    );
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent> | undefined
  ) => {
    event?.currentTarget?.blur();
  };

  const setMenuFromRouterState = (url: string) => {
    setMenuOpen(url.indexOf('?menu') !== -1);
  };

  /**
   * Handle the closing of the menu
   * If closed with handleMenuClick the menu would open too soon
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
    handleMenuClick,
  };
}
