import '@reach/combobox/styles.css';
import Router from 'next/router';
import { AppProps } from 'next/app';
import { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { FCWithLayout } from '~/components/layout';
import '~/components/comboBox/comboBox.scss';
import * as piwik from '~/lib/piwik';
import '~/scss/style.scss';
import { GlobalStyle } from '~/style/global-style';
import theme from '~/style/theme';

/* Polyfill for flatMap */
import 'core-js/features/array/flat-map';

type AppPropsWithLayout = AppProps & {
  Component: FCWithLayout;
};

export default function App(props: AppPropsWithLayout) {
  const { Component, pageProps } = props;
  const page = (page: React.ReactNode) => page;
  const getLayout = Component.getLayout || page;

  useEffect(() => {
    window.document.documentElement.className += ' js';
    const handleRouteChange = (url: string) => {
      if (url.indexOf('?menu') !== -1) {
        /* Opening a menu on mobile scrolls to the top of the menus */
        window.document
          .querySelector('#main-navigation,aside')
          ?.scrollIntoView(true);
      } else {
        /* Any other page scrolls to the top */
        window.scrollTo(0, 0);
      }
      piwik.pageview();
    };

    Router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  const pageWithLayout = getLayout(<Component {...pageProps} />, pageProps);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {pageWithLayout}
    </ThemeProvider>
  );
}
