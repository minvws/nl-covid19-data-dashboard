import { assert } from '@corona-dashboard/common';
import '@reach/combobox/styles.css';
import { LazyMotion } from 'framer-motion';
import { AppProps } from 'next/app';
import Head from 'next/head';
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

const pagesWithSmoothScroll = ['landelijk', 'veiligheidsregio', 'gemeente'] as const;

const loadAnimationFeatures = () => import('~/style/animations').then((mod) => mod.default);

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const router = useRouter();
  const { locale = 'nl' } = router;

  const [text, toggleHotReloadButton, dataset] = useLokalizeText(locale as LanguageKey);

  assert(text, `[${loadAnimationFeatures.name}] Encountered unknown language: ${locale}`);

  const intlContext = useIntlHelperContext(locale as LanguageKey, text.common, dataset);

  useEffect(() => {
    const handleRouteChange = (pathname: string) => {
      piwik.pageview();

      if (pathname.includes('#')) {
        return;
      }

      // For any page that should not smooth scroll after load, we should
      // disable smooth scroll during the page transition
      if (!pagesWithSmoothScroll.some((fragment) => pathname.includes(fragment))) {
        document.documentElement.style.scrollBehavior = 'auto';
      }

      scrollToTop();

      document.documentElement.style.scrollBehavior = '';
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  return (
    <>
      <Head>
        <meta key="viewport" name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5" />
      </Head>
      <ThemeProvider theme={theme}>
        <IntlContext.Provider value={intlContext}>
          <GlobalStyle />
          <LazyMotion strict features={loadAnimationFeatures}>
            <BreakpointContextProvider>
              <IsTouchDeviceContextProvider>
                <Component {...pageProps} />
              </IsTouchDeviceContextProvider>
            </BreakpointContextProvider>
          </LazyMotion>
        </IntlContext.Provider>
        {toggleHotReloadButton}
      </ThemeProvider>
    </>
  );
}

function scrollToTop() {
  const navigationBar = document.querySelector('#main-navigation') as HTMLElement | null;
  const offset = navigationBar?.offsetTop ?? 0;

  window.scrollTo(0, window.scrollY >= offset ? offset : 0);
}
