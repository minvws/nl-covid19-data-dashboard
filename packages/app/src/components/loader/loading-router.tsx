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
  const [noWait, setNoWait] = useState(false);

  useEffect(() => {
    router.events.on('routeChangeStart', (url) => {
      if(url.startsWith("/" + layout)) {
        if (noWait) {
          setTimeout(() => {setLoaded(true)}, 700);
        }
      } else {
        setLoaded(false)
      }
    });
    router.events.on('routeChangeComplete', () => {
      setLoaded(false);
      setNoWait(true);
    });
  });

  return (
    <Box position="relative">
      {children}
      { loaded && <Loader/> }
    </Box>
  );
}
