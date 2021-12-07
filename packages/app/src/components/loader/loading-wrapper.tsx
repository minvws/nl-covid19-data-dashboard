import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Loader } from '~/components/loader/loader';

interface LoadingRouterProps {
  previousUrl?: string;
}

export function LoadingWrapper(props: LoadingRouterProps) {
  const { previousUrl } = props;
  const router = useRouter();

  const [routerLoadState, setRouterLoadState] = useState<
    'idle' | 'loading' | 'complete'
  >('loading');
  const [currentRoute, setCurrentRoute] = useState<string>('');
  const handleLoadingTimeout = () => setRouterLoadState('loading');;
  const loaderTimeout = useRef(() => setTimeout(handleLoadingTimeout, 700));

  useEffect(() => {
    const handleRouteChangeStart = async (url: string) => {
      await setRouterLoadState('idle');

      if (
        url.startsWith('/' + previousUrl) &&
        routerLoadState !== 'loading' &&
        routerLoadState !== 'complete' &&
        currentRoute !== url
      ) {
        loaderTimeout.current();
      }
    };

    const handleRouteChangeComplete = (url: string) => {
      clearTimeout(loaderTimeout.current());
      setRouterLoadState('complete');
      setCurrentRoute(url);
    };

    const handleRouteChangeError = () => {
      clearTimeout(loaderTimeout.current());
      setRouterLoadState('complete');
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeError);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeError);
      clearTimeout(loaderTimeout.current());
    };
  }, [currentRoute, previousUrl, router.events, routerLoadState]);

  return routerLoadState === 'complete'
    ? null
    : <Loader showLoader={routerLoadState === 'loading'} />
}
