import { useState, useEffect } from 'react';
import { Router } from 'next/router';

interface MenuStateReturn {
  isMenuOpen: boolean;
  openMenu: (event?: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  handleMenuClick: (
    event?: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => void;
}

/**
 * Keep track of the menu state and handle the opening and closing.
 * Returns controls to the state.
 * @param defaultOpen
 */
export function useMenuState(defaultOpen = false): MenuStateReturn {
  const [isMenuOpen, setMenu] = useState<boolean>(defaultOpen);

  const openMenu = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent> | undefined
  ): void => {
    if (event) {
      event.preventDefault();
    }
    setMenu(true);
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent> | undefined
  ) => {
    if (event?.currentTarget) {
      event.currentTarget.blur();
    }
  };

  /**
   * Handle the closing of the menu
   * If closed with handleMenuClick the menu would open too soon
   * This closes the menu at the moment the content is loaded and displayed,
   * (just as non-JS would kept displayed)
   * */
  useEffect(() => {
    const handleCloseMenu = () => {
      setMenu(false);
    };
    Router.events.on('beforeHistoryChange', handleCloseMenu);
    return () => {
      Router.events.off('beforeHistoryChange', handleCloseMenu);
    };
  });

  return {
    isMenuOpen,
    openMenu,
    handleMenuClick,
  };
}
