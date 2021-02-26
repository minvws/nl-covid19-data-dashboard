import { useReducedMotion } from 'framer-motion';
import { useIsIE11 } from './use-is-ie11';

/**
 * We'll disable motion when:
 * - the user prefers reduced motion
 * - the user is on IE11 which is performance- and dependency-wise hard to
 *   support.
 */
export function useIsMotionDisabled() {
  const isIE11 = useIsIE11(true);
  const prefersReducedMotion = useReducedMotion() === true;

  return isIE11 || prefersReducedMotion;
}
