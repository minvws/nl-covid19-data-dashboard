import React, { useEffect, useState }from 'react';
import { useRouter } from 'next/router'
import { Loader } from '~/components/loader/loader';
import { Box } from '~/components/base';

interface LoadingRouterProps {
  children?: React.ReactNode;
  layout?: string;
}

export function LoadingRouter(props: LoadingRouterProps) {
  const { children, layout } = props;
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    router.events.on('routeChangeStart', (url) => {
      if(url.startsWith("/" + layout)) {
        setTimeout(() => {
          setIsLoading(hasCompleted)
        }, 700);
      }
    });
    router.events.on('routeChangeComplete', () => {
      setIsLoading(false);
      setHasCompleted(true);
    });
  });

  return (
    <Box position="relative">
      {children}
      { isLoading && <Loader/> }
    </Box>
  );
}
