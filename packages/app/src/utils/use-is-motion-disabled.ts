import { useReducedMotion } from 'framer-motion';
import { useIsOldBrowser } from './use-is-old-browser';

/**
 * We'll disable motion when:
 * - the user prefers reduced motion
 * - the user is on IE11 which is performance- and dependency-wise hard to
 *   support.
 */
export function useIsMotionDisabled() {
  const isOldBrowser = useIsOldBrowser(true);
  const prefersReducedMotion = useReducedMotion() === true;

  return isOldBrowser || prefersReducedMotion;
}
