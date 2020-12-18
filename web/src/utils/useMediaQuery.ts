import { useState, useEffect } from 'react';

export function useMediaQuery(
  breakpoint: string,
  initialMatches?: boolean
): boolean {
  const [matches, setMatches] = useState(() => {
    if (initialMatches === undefined) {
      try {
        return window.matchMedia(breakpoint).matches;
      } catch (err) {
        return false;
      }
    }

    return initialMatches;
  });

  useEffect(() => {
    const mqList = window.matchMedia(breakpoint);
    const onChange = (evt: any) => setMatches(evt.matches);

    // set the initial value
    setMatches(mqList.matches);

    // attach the listener
    mqList.addListener(onChange);

    return () => mqList.removeListener(onChange);
  }, [breakpoint]);

  return matches;
}
