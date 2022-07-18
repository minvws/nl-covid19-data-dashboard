/**
 * Checks wether the current scroll position is at the bottom of the page.
 * @returns boolean
 */
export const isAtBottomOfPage = (): boolean =>
  window.innerHeight + Math.round(window.scrollY) >= document.body.scrollHeight;
