import React from 'react';

import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';

import styles from './layout.module.scss';
import MaxWidth from 'components/maxWidth';
import text from 'data/textLayout.json';
import useMediaQuery from 'utils/useMediaQuery';

export type LayoutProps = {
  title?: string;
  description?: string;
};

export type FunctionComponentWithLayout<P> = React.FC<P> & {
  getLayout?: (title?: string) => (page: any) => any;
};

const Layout: FunctionComponentWithLayout<LayoutProps> = ({
  children,
  title = 'Dashboard Coronavirus COVID-19 | Rijksoverheid.nl',
  description = 'Informatie over de ontwikkeling van het coronavirus in Nederland.',
}) => {
  const router = useRouter();

  // remove focus after navigation
  const blur = (evt) => evt.target.blur();

  const showSmallLogo = useMediaQuery('(max-width: 480px)');

  return (
    <>
      <Head>
        <title key="title">{title}</title>
        <meta name="og:locale" content="nl_NL" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta key="ogTitle" property="og:title" content={title} />
        <meta key="description" name="description" content={description} />
        <meta
          key="ogDescripton"
          property="og:description"
          content={description}
        />
        <meta key="ogType" property="og:type" content="website" />
        <meta
          key="image"
          name="image"
          content="https://coronadashboard.rijksoverheid.nl/banner.jpg"
        />
        <meta
          key="ogImage"
          name="og:image"
          content="https://coronadashboard.rijksoverheid.nl/banner.jpg"
        />
        <meta
          key="ogUrl"
          name="og:url"
          content="https://coronadashboard.rijksoverheid.nl"
        />
      </Head>

      <div className={styles.skiplinks}>
        <a href="#content">{text.skiplinks.inhoud}</a>
        <a href="#main-navigation">{text.skiplinks.nav}</a>
      </div>

      <header className={styles.header}>
        <div className={styles.logoWrapper}>
          <img
            className={styles.logo}
            src={
              showSmallLogo
                ? '/images/logo-ro-small.svg'
                : '/images/logo-ro.svg'
            }
            alt="Rijksoverheid"
          />
        </div>

        <MaxWidth>
          <h1>{text.header.title}</h1>
          <strong className={styles.badge}>{text.header.disclaimer}</strong>
          <p>
            {text.header.text}{' '}
            <Link href="/over">
              <a className={styles.readMoreLink}>{text.header.link}</a>
            </Link>
          </p>
        </MaxWidth>

        <nav id="main-navigation" className={styles.nav}>
          <MaxWidth>
            <ul className={styles.navList}>
              <li>
                <Link href="/">
                  <a
                    onClick={blur}
                    className={
                      router.pathname === '/'
                        ? styles.link + ' ' + styles.active
                        : styles.link
                    }
                  >
                    {text.nav.links.index}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/regio">
                  <a
                    onClick={blur}
                    className={
                      router.pathname == '/regio'
                        ? styles.link + ' ' + styles.active
                        : styles.link
                    }
                  >
                    {text.nav.links.regio}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/over">
                  <a
                    onClick={blur}
                    className={
                      router.pathname == '/over'
                        ? styles.link + ' ' + styles.active
                        : styles.link
                    }
                  >
                    {text.nav.links.over}
                  </a>
                </Link>
              </li>
            </ul>
          </MaxWidth>
        </nav>
      </header>

      <main id="content">{children}</main>

      <footer>
        <div className={styles.footer}>
          <MaxWidth>
            <h3>Corona Dashboard</h3>
            <nav>
              <ul className={styles.footerList}>
                <li>
                  <Link href="/">
                    <a onClick={blur} className={styles.footerLink}>
                      {text.nav.links.index}
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/regio">
                    <a onClick={blur} className={styles.footerLink}>
                      {text.nav.links.regio}
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/over">
                    <a onClick={blur} className={styles.footerLink}>
                      {text.nav.links.over}
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/verantwoording">
                    <a onClick={blur} className={styles.footerLink}>
                      {text.nav.links.verantwoording}
                    </a>
                  </Link>
                </li>
                <li>
                  <a
                    href={
                      'https://www.rijksoverheid.nl/onderwerpen/coronavirus-covid-19'
                    }
                    rel="noopener noreferrer"
                    className={styles.footerLink}
                  >
                    {text.nav.links.meer}
                  </a>
                </li>
              </ul>
            </nav>
          </MaxWidth>
        </div>
      </footer>
    </>
  );
};

Layout.getLayout = (title) => (page) => <Layout title={title}>{page}</Layout>;

export default Layout;
