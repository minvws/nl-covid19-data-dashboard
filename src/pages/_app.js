import './index.css';
import 'scss/style.scss';

import 'components/collapse/collapse.scss';
import 'components/graphContainer/graphContainer.scss';
import 'components/graphContent/graphContent.scss';
import 'components/lineChart/lineChart.scss';

// Import Preact DevTools in development
if (process.env.NODE_ENV === 'development') {
  // Must use require here as import statements are only allowed
  // to exist at the top of a file.
  require('preact/debug');
}

import App from 'next/app';
import Router from 'next/router';
import * as piwik from '../lib/piwik';

import { StateProvider } from 'store';

class CoronaDashboard extends App {
  componentDidMount() {
    Router.events.on('routeChangeComplete', this.handleRouteChange);
  }

  componentWillUnmount() {
    Router.events.off('routeChangeComplete', this.handleRouteChange);
  }

  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.trace(error, errorInfo);
  }

  handleRouteChange(url) {
    piwik.pageview(url);
  }

  render() {
    const { Component, pageProps } = this.props;
    const getLayout = Component.getLayout || ((page) => page);

    return (
      <StateProvider>{getLayout(<Component {...pageProps} />)}</StateProvider>
    );
  }
}

export default CoronaDashboard;
