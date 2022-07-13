/**
 * Checks wether an element is at the top of the browser's viewport.
 * @param element - the element to get the position for
 * @returns boolean
 */
export const isElementAtTopOfViewport = (element: HTMLElement): boolean =>
  element.getBoundingClientRect().top <= 1;
