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

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    router.events.on('routeChangeStart', (url) => {
      url.startsWith("/" + layout) && setTimeout(() => {setLoaded(true)}, 700);
    });
    router.events.on('routeChangeComplete', () => {
      setLoaded(false);
    });
  });

  return (
    <Box position="relative">
      {children}
      { loaded && <Loader/> }
    </Box>
  );
}
