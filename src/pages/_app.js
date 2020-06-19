import './index.css';
import 'scss/style.scss';

import 'components/barScale/barScale.scss';
import 'components/collapse/collapse.scss';
import 'components/graphContainer/graphContainer.scss';
import 'components/graphContent/graphContent.scss';
import 'components/lineChart/lineChart.scss';
import 'pages/regio/regio.scss';

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
