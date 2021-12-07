import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Loader } from '~/components/loader/loader';
import { Box } from '~/components/base';

interface LoadingRouterProps {
  children: React.ReactNode;
  previousUrl?: string;
}

export function LoadingWrapper(props: LoadingRouterProps) {
  const { children, previousUrl } = props;
  const router = useRouter();

  const [routerLoadState, setRouterLoadState] = useState<'idle'|'loading'|'complete'>('idle');

  useEffect(() => {
    router.events.on('routeChangeStart', (url) => {
      setRouterLoadState('idle');
      window.scrollTo(0, 0);
      if (url.startsWith('/' + previousUrl) && routerLoadState === 'idle') {
        setTimeout(() => {
          setRouterLoadState('loading');
        }, 700);
      }
    });
    router.events.on('routeChangeComplete', () => {
      setRouterLoadState('complete');
    });
  }, [routerLoadState, previousUrl, router.events]);

  return (
    <Box position="relative">
      {children}
      {(routerLoadState === 'loading' || routerLoadState === 'idle') && <Loader showLoader={routerLoadState === 'loading'} />}
    </Box>
  );
}
