import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '~/components/loader/loader';
import { useFeature } from '~/lib/features';

const SHOW_LOADER_AFTER_AMOUNT_OF_MS = 700;

interface LoadingRouterProps {
  previousUrl?: string;
}

export function LoadingWrapper(props: LoadingRouterProps) {
  const loadingIndicatorFeature = useFeature('loadingIndicator');

  const { previousUrl } = props;
  const router = useRouter();

  const [routerLoadState, setRouterLoadState] = useState<
    'idle' | 'loading' | 'complete'
  >('loading');
  const [currentRoute, setCurrentRoute] = useState<string>('');
  const handleLoadingTimeout = () => setRouterLoadState('loading');
  const timeoutIdRef = useRef(0);

  useEffect(() => {
    const handleRouteChangeStart = (
      url: string,
      { shallow }: { shallow: boolean }
    ) => {
      if (shallow) return;
      setRouterLoadState('idle');
      window.scrollTo(0, 0);
      if (url.startsWith('/' + previousUrl) && currentRoute !== url) {
        timeoutIdRef.current = window.setTimeout(
          handleLoadingTimeout,
          SHOW_LOADER_AFTER_AMOUNT_OF_MS
        );
      }
    };

    const handleRouteChangeComplete = (url: string) => {
      if (timeoutIdRef.current > 0) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = 0;
      }
      setRouterLoadState('complete');
      setCurrentRoute(url);
    };

    const handleRouteChangeError = () => {
      if (timeoutIdRef.current > 0) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = 0;
      }
      setRouterLoadState('complete');
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeError);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeError);

      if (timeoutIdRef.current > 0) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = 0;
      }
    };
  }, [currentRoute, previousUrl, router.events, routerLoadState]);

  if (!loadingIndicatorFeature.isEnabled) return null;

  return <Loader showLoader={routerLoadState === 'loading'} />;
}
