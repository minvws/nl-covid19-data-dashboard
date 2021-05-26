import '@reach/combobox/styles.css';
import { AppProps } from 'next/app';
import Router from 'next/router';
import { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { IntlContext } from '~/intl';
import { useIntlHelperContext } from '~/intl/hooks/use-intl';
import * as piwik from '~/lib/piwik';
import { LanguageKey } from '~/locale';
import { useLokalizeText } from '~/locale/use-lokalize-text';
import { GlobalStyle } from '~/style/global-style';
import theme from '~/style/theme';
import { assert } from '~/utils/assert';
import { BreakpointContextProvider } from '~/utils/use-breakpoints';

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

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  // const { locale = 'nl' } = useRouter(); // if we replace this with process.env.NEXT_PUBLIC_LOCALE, next export should still be possible?
  const locale = (process.env.NEXT_PUBLIC_LOCALE || 'nl') as LanguageKey;

  const [text, toggleHotReloadButton] = useLokalizeText(locale, {
    enableHotReload: process.env.NEXT_PUBLIC_HOT_RELOAD_LOKALIZE === '1',
  });

  assert(text, `Encountered unknown language: ${locale}`);

  const intlContext = useIntlHelperContext(locale, text);

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

  return (
    <ThemeProvider theme={theme}>
      <IntlContext.Provider value={intlContext}>
        <GlobalStyle />
        <BreakpointContextProvider>
          <Component {...pageProps} />
        </BreakpointContextProvider>
      </IntlContext.Provider>
      {toggleHotReloadButton}
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
