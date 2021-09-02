// eslint-disable-next-line no-restricted-imports
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

type LinkProps = NextLinkProps & {
  scrollBehavior?: ScrollBehavior;
  children?: React.ReactNode;
};

/**
 * Link component which disables the default Next/Link scroll behavior
 */

export function Link({ scrollBehavior = 'auto', ...props }: LinkProps) {
  const router = useRouter();

  const onClick = useCallback(() => {
    const handleRouteChange = (pathname: string) => {
      if (!pathname.includes('#')) {
        scrollToTop();
      }
      document.documentElement.style.scrollBehavior = '';
      router.events.off('routeChangeComplete', handleRouteChange);
    };

    // Default is 'smooth' through CSS so hash links have smooth scroll as
    // well, so we have to temporarily overwrite it if it is 'auto' to get an
    // instant scroll.
    if (scrollBehavior === 'auto') {
      document.documentElement.style.scrollBehavior = 'auto';
    }
    router.events.on('routeChangeComplete', handleRouteChange);
  }, [router, scrollBehavior]);

  return (
    <span onClick={onClick}>
      <NextLink prefetch={false} scroll={false} locale={false} {...props} />
    </span>
  );
}

function scrollToTop() {
  const navigationBar = document.querySelector(
    '#main-navigation'
  ) as HTMLElement | null;
  const offset = navigationBar?.offsetTop ?? 0;

  window.scrollTo(0, window.scrollY >= offset ? offset : 0);
}
