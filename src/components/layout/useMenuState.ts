import { useState, useEffect } from 'react';
import { Router } from 'next/router';

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

  const openMenu = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent> | undefined
  ): void => {
    event?.preventDefault();
    setMenuOpen(true);
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent> | undefined
  ) => {
    event?.currentTarget?.blur();
  };

  /**
   * Handle the closing of the menu
   * If closed with handleMenuClick the menu would open too soon
   * This closes the menu at the moment the content is loaded and displayed,
   * (just as non-JS would kept displayed)
   * */
  useEffect(() => {
    const handleCloseMenu = () => {
      setMenuOpen(false);
    };
    Router.events.on('beforeHistoryChange', handleCloseMenu);
    return () => {
      Router.events.off('beforeHistoryChange', handleCloseMenu);
    };
  }, []);

  return {
    isMenuOpen,
    openMenu,
    handleMenuClick,
  };
}
