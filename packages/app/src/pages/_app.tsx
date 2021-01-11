import '@reach/combobox/styles.css';
import { AppProps } from 'next/app';
import Router from 'next/router';
import { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import '~/components/comboBox/comboBox.scss';
import { FCWithLayout } from '~/domain/layout/layout';
import * as piwik from '~/lib/piwik';
import { GlobalStyle } from '~/style/global-style';
import theme from '~/style/theme';

import { IntlProvider, FormattedMessage, FormattedNumber } from 'react-intl';

type AppPropsWithLayout = AppProps & {
  Component: FCWithLayout;
};

export default function App(props: AppPropsWithLayout) {
  const { Component, pageProps } = props;
  const page = (page: React.ReactNode) => page;
  const getLayout = Component.getLayout || page;

  useEffect(() => {
    const handleRouteChange = (pathname: string) => {
      piwik.pageview();

      if (!pathname.includes('#')) {
        scrollToTop();
      }
    };

    Router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  const pageWithLayout = getLayout(<Component {...pageProps} />, pageProps);

  return (
    <ThemeProvider theme={theme}>
      <IntlProvider locale="nl" defaultLocale="nl">
        <GlobalStyle />
        {pageWithLayout}
      </IntlProvider>
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
