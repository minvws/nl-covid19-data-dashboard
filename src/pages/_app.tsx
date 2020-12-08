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
    window.document.documentElement.classList.add('js');
    const handleRouteChange = () => {
      piwik.pageview();
      scrollToTop();
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

function scrollToTop() {
  const navigationBar = document.querySelector(
    '#main-navigation'
  ) as HTMLElement | null;
  const offset = navigationBar?.offsetTop ?? 0;

  window.scrollTo(0, window.scrollY >= offset ? offset : 0);
}
