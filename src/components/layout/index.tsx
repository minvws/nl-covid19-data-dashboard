import React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from './layout.module.scss';
import MaxWidth from 'components/maxWidth';
import text from 'locale';
import useMediaQuery from 'utils/useMediaQuery';
import SEOHead from 'components/seoHead';
import { Translation } from 'types/data';

export interface LayoutProps {
  url?: Translation;
  title: Translation;
  description?: Translation;
  openGraphImage?: string;
  twitterImage?: string;
}

export type FunctionComponentWithLayout<P = void> = React.FC<P> & {
  getLayout: (seoProps?: LayoutProps) => (page: any) => any;
};

const Layout: FunctionComponentWithLayout<LayoutProps> = (props) => {
  const {
    children,
    title,
    description,
    openGraphImage,
    twitterImage,
    url,
  } = props;
  const router = useRouter();

  // remove focus after navigation
  const blur = (evt: any) => evt.target.blur();

  const showSmallLogo = useMediaQuery('(max-width: 480px)');

  return (
    <>
      <SEOHead
        title={title?.translation}
        description={description?.translation}
        openGraphImage={openGraphImage}
        twitterImage={twitterImage}
        url={url?.translation}
      />

      <div className={styles.skiplinks}>
        <a href="#content">{text.skiplinks.inhoud.translation}</a>
        <a href="#main-navigation">{text.skiplinks.nav.translation}</a>
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
            loading="lazy"
          />
        </div>

        <MaxWidth>
          <h1>{text.header.title.translation}</h1>
          <p>
            {text.header.text.translation}{' '}
            <Link href="/over">
              <a className={styles.readMoreLink}>
                {text.header.link.translation}
              </a>
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
                    {text.nav.links.index.translation}
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
                    {text.nav.links.regio.translation}
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
                    {text.nav.links.over.translation}
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
                      {text.nav.links.index.translation}
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/regio">
                    <a onClick={blur} className={styles.footerLink}>
                      {text.nav.links.regio.translation}
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/over">
                    <a onClick={blur} className={styles.footerLink}>
                      {text.nav.links.over.translation}
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/verantwoording">
                    <a onClick={blur} className={styles.footerLink}>
                      {text.nav.links.verantwoording.translation}
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
                    {text.nav.links.meer.translation}
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

Layout.getLayout = (seoProps) => (page) => (
  // ???
  // @ts-ignore
  <Layout {...seoProps}>{page}</Layout>
);

export default Layout;
