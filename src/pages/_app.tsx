import './index.css';
import 'scss/style.scss';

import 'components/legenda/legenda.scss';
import 'components/lineChart/lineChart.scss';

// Import Preact DevTools in development
if (process.env.NODE_ENV === 'development') {
  // Must use require here as import statements are only allowed
  // to exist at the top of a file.
  require('preact/debug');
}

import { useEffect } from 'react';
import Router from 'next/router';
import * as piwik from '../lib/piwik';

import { SWRConfig } from 'swr';

interface IProps {
  Component: any;
  pageProps: any;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default MyApp;

function MyApp(props: IProps): React.ReactElement {
  const { Component, pageProps } = props;
  const page = (page: any) => page;
  const getLayout = Component.getLayout || page;

  useEffect(() => {
    const handleRouteChange = () => piwik.pageview();

    Router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  return (
    <SWRConfig
      value={{
        fetcher,
      }}
    >
      {getLayout(<Component {...pageProps} />)}
    </SWRConfig>
  );
}
