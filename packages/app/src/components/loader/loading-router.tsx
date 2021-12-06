import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Loader } from '~/components/loader/loader';
import { Box } from '~/components/base';

interface LoadingRouterProps {
  children: React.ReactNode;
  previousUrl?: string;
}

export function LoadingRouter(props: LoadingRouterProps) {
  const { children, previousUrl } = props;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    router.events.on('routeChangeStart', (url) => {
      window.scrollTo(0, 0);
      if (url.startsWith('/' + previousUrl)) {
        setTimeout(() => {
          setIsLoading(hasCompleted);
        }, 700);
      }
    });
    router.events.on('routeChangeComplete', () => {
      setIsLoading(false);
      setHasCompleted(true);
    });
  }, [hasCompleted, previousUrl, router.events]);

  return (
    <Box position="relative">
      {children}
      {isLoading && <Loader />}
    </Box>
  );
}
