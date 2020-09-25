import '@reach/combobox/styles.css';
import './index.css';
import '~/scss/style.scss';

import '~/components/legenda/legenda.scss';
import '~/components/comboBox/comboBox.scss';

// Import Preact DevTools in development
// if (process.env.NODE_ENV === 'development') {
//   // Must use require here as import statements are only allowed
//   // to exist at the top of a file.
//   require('preact/debug');
// }

import { useEffect } from 'react';
import Router from 'next/router';
import * as piwik from '../lib/piwik';

interface IProps {
  Component: any;
  pageProps: any;
}

export default MyApp;

function MyApp(props: IProps): React.ReactElement {
  const { Component, pageProps } = props;
  const page = (page: React.ReactNode) => page;
  const getLayout = Component.getLayout || page;

  useEffect(() => {
    window.document.documentElement.className += ' js';
    const handleRouteChange = () => {
      window.scrollTo(0, 0);
      piwik.pageview();
    };

    Router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  return getLayout(<Component {...pageProps} />, pageProps);
}
