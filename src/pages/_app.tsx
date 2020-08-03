import './index.css';
import 'scss/style.scss';

import { IntlProvider } from 'react-intl';

import locale, { targetLanguage } from 'locale';

import 'components/collapse/collapse.scss';
import 'components/legenda/legenda.scss';
import 'components/graphContainer/graphContainer.scss';
import 'components/graphContent/graphContent.scss';
import 'components/lineChart/lineChart.scss';

// Import Preact DevTools in development
if (process.env.NODE_ENV === 'development') {
  // Must use require here as import statements are only allowed
  // to exist at the top of a file.
  require('preact/debug');
}

import { useEffect } from 'react';
import Router from 'next/router';
import * as piwik from '../lib/piwik';

import { SWRConfig } from 'swr';

import { StateProvider } from 'store';

interface IProps {
  Component: any;
  pageProps: any;
}

function flattenMessages(nestedMessages: any, prefix = '') {
  return Object.keys(nestedMessages).reduce((messages: any, key) => {
    const value = nestedMessages[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      messages[prefixedKey] = value;
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }

    return messages;
  }, {});
}
const fetcher = (url: string) => fetch(url).then((r) => r.json());

function MyApp(props: IProps): React.ReactElement {
  const { Component, pageProps } = props;
  const getLayout = Component.getLayout || ((page: any) => page);

  useEffect(() => {
    const handleRouteChange = () => piwik.pageview();

    Router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  const messages = flattenMessages(locale);

  return (
    <IntlProvider
      messages={messages}
      locale={targetLanguage}
      defaultLocale="nl"
    >
      <SWRConfig
        value={{
          fetcher,
        }}
      >
        <StateProvider>{getLayout(<Component {...pageProps} />)}</StateProvider>
      </SWRConfig>
    </IntlProvider>
  );
}

export default MyApp;
