import { assert } from '@corona-dashboard/common';
import '@reach/combobox/styles.css';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { IntlContext } from '~/intl';
import { useIntlHelperContext } from '~/intl/hooks/use-intl';
import * as piwik from '~/lib/piwik';
import { LanguageKey } from '~/locale';
import { useLokalizeText } from '~/locale/use-lokalize-text';
import { GlobalStyle } from '~/style/global-style';
import theme from '~/style/theme';
import { BreakpointContextProvider } from '~/utils/use-breakpoints';
import { IsTouchDeviceContextProvider } from '~/utils/use-is-touch-device';

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const router = useRouter();
  const { locale = 'nl' } = router;

  const [text, toggleHotReloadButton, dataset] = useLokalizeText(
    locale as LanguageKey
  );

  assert(text, `Encountered unknown language: ${locale}`);

  const intlContext = useIntlHelperContext(
    locale as LanguageKey,
    text,
    dataset
  );

  useEffect(() => {
    const handleRouteChange = (pathname: string) => {
      piwik.pageview();

      if (!pathname.includes('#')) {
        scrollToTop();
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  return (
    <ThemeProvider theme={theme}>
      <IntlContext.Provider value={intlContext}>
        <GlobalStyle />
        <BreakpointContextProvider>
          <IsTouchDeviceContextProvider>
            <Component {...pageProps} />
          </IsTouchDeviceContextProvider>
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
