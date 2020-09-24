import { useState, useEffect } from 'react';
import { Router } from 'next/router';

interface MenuStateReturn {
  isMenuOpen: boolean;
  openMenu: (event?: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  closeMenu: (event?: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

/**
 * Keep track of the menu state and handle the opening and closing.
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

  const closeMenu = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent> | undefined
  ) => {
    /* Do not immediately close the menu, it is too instant */
    if (event?.currentTarget) {
      event.currentTarget.blur();
    }
  };

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
    closeMenu,
  };
}
