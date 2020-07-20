import './index.css';
import 'scss/style.scss';

import 'components/collapse/collapse.scss';
import 'components/legenda/legenda.scss';
import 'components/dateReported/dateReported.scss';
import 'components/graphContainer/graphContainer.scss';
import 'components/graphContent/graphContent.scss';
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

import { StateProvider } from 'store';

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);

  useEffect(() => {
    const handleRouteChange = (url) => {
      piwik.pageview(url);
    };
    Router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  return (
    <StateProvider>{getLayout(<Component {...pageProps} />)}</StateProvider>
  );
}

export default MyApp;
