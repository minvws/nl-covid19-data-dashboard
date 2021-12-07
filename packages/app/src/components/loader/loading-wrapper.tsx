import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Loader } from '~/components/loader/loader';

interface LoadingRouterProps {
  previousUrl?: string;
}

export function LoadingWrapper(props: LoadingRouterProps) {
  const { previousUrl } = props;
  const router = useRouter();

  const [routerLoadState, setRouterLoadState] = useState<'idle'|'loading'|'complete'>('loading');
  const [currentRoute, setCurrentRoute] = useState<string>('');

  useEffect(() => {
    const handleRouteChangeStart  = (url) => {
      setRouterLoadState('idle');
      window.scrollTo(0, 0);
      console.log(routerLoadState);
      if (url.startsWith('/' + previousUrl) && routerLoadState === 'idle' && currentRoute !== url) {
        setTimeout(() => {
          setRouterLoadState('loading');
        }, 700);
      }
    }

    const handleRouteChangeComplete  = (url) => {
      setRouterLoadState('complete');
      setCurrentRoute(url)
    }

    const handleRouteChangeError  = () => {
      setRouterLoadState('complete');
    }

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeError);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeError);
    }
  }, [currentRoute, previousUrl, router.events, routerLoadState]);

  return (
    <>
      {(routerLoadState === 'loading' || routerLoadState === 'idle') && <Loader showLoader={routerLoadState === 'loading'} />}
    </>
  );
}
