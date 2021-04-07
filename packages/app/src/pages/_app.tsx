import '@reach/combobox/styles.css';
import { AppProps } from 'next/app';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import '~/components-styled/combo-box/combo-box.scss';
import { IntlContext } from '~/intl';
import { useIntlHelperContext } from '~/intl/hooks/use-intl';
import * as piwik from '~/lib/piwik';
import { FeatureProvider } from '~/lib/feature-flags';

import { LanguageKey, languages } from '~/locale';
import { GlobalStyle } from '~/style/global-style';
import theme from '~/style/theme';

import { client } from '~/lib/sanity';

type Flag = {
  key: string;
  status: boolean | undefined;
  title: string;
  _key: string;
  _type: string;
};

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

function createProviderFlags(flagsFromSanity: Flag[]) {
  const filtered = flagsFromSanity
    .filter((feature) => feature?.status === true)
    .map((feature) => feature.key);
  //always return an array
  return filtered ? filtered : [];
}

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  // const { locale = 'nl' } = useRouter(); // if we replace this with process.env.NEXT_PUBLIC_LOCALE, next export should still be possible?
  const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
  const text = languages[locale as LanguageKey];

  const intlContext = useIntlHelperContext(locale, text);

  const [featureflags, setFeatureFlags] = useState<Array<string> | undefined>(
    undefined
  );

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

  // Sanity stores our feature flags
  const query = '*[_type == "featureFlags"]';

  useEffect(() => {
    client.fetch(query).then((featureflags: Flag[]) => {
      const flags = createProviderFlags(featureflags);
      setFeatureFlags(flags);
    });

    const subscription = client.listen(query).subscribe((update) => {
      if (update?.result?.flags) {
        const flags = createProviderFlags(update.result.flags);
        setFeatureFlags(flags);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <IntlContext.Provider value={intlContext}>
        <FeatureProvider features={featureflags}>
          <GlobalStyle />
          <Component {...pageProps} />
        </FeatureProvider>
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
