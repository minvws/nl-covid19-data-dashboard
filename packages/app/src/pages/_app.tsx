import '@reach/combobox/styles.css';
import { AppProps } from 'next/app';
import Router, { useRouter } from 'next/router';
import { useEffect, createContext, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import '~/components-styled/combo-box/combo-box.scss';
import { FCWithLayout } from '~/domain/layout/layout';
import * as piwik from '~/lib/piwik';
import { GlobalStyle } from '~/style/global-style';
import theme from '~/style/theme';

if (typeof window !== 'undefined') {
  require('proxy-polyfill/proxy.min.js');

  if (process.env.NODE_ENV === 'development') {
    /**
     * this polyfill allows next.js to show runtime errors in IE11
     */
    require('@webcomponents/shadydom');
  }

  if (!window.ResizeObserver) {
    const ResizeObserver = require('resize-observer-polyfill').default;
    window.ResizeObserver = ResizeObserver;
  }
}

type AppPropsWithLayout = AppProps & {
  Component: FCWithLayout;
};

export const IntlContext = createContext({ messages: null as any });

export default function App(props: AppPropsWithLayout) {
  const { Component, pageProps } = props;
  const page = (page: React.ReactNode) => page;
  const getLayout = Component.getLayout || page;

  const { locale } = useRouter();

  const [intlState] = useState({
    messages: require(`~/locale/${locale}.json`),
  });

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
      <IntlContext.Provider value={intlState}>
        <GlobalStyle />
        {pageWithLayout}
      </IntlContext.Provider>
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
