import { useEffect, useState } from 'react';

/**
 * Checks the given media query each render and returns the match
 *
 * @param breakpoint The given media query
 * @param initialMatches Indicates the default for the result
 * @returns a boolean indicating whether the given media query matches
 */
export function useMediaQuery(
  breakpoint: string,
  initialMatches = false
): boolean {
  const [matches, setMatches] = useState(initialMatches);

  useEffect(() => {
    const mqList = window.matchMedia(breakpoint);
    const onChange = (evt: MediaQueryListEvent) => setMatches(evt.matches);
    // set the initial value
    setMatches(mqList.matches);

    // attach the listener
    mqList.addListener(onChange);

    return () => mqList.removeListener(onChange);
  }, [breakpoint]);

  return matches;
}
