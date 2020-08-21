import React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from './layout.module.scss';
import MaxWidth from 'components/maxWidth';
import text from 'locale';
import useMediaQuery from 'utils/useMediaQuery';
import SEOHead from 'components/seoHead';
import getLocale from 'utils/getLocale';

export interface LayoutProps {
  url?: string;
  title: string;
  description?: string;
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

  const locale = getLocale();
  const showSmallLogo = useMediaQuery('(max-width: 480px)', true);

  return (
    <>
      <SEOHead
        title={title}
        description={description}
        openGraphImage={openGraphImage}
        twitterImage={twitterImage}
        url={url}
      />

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
            alt={text.header.logo_alt}
            // loading="lazy"
            width={showSmallLogo ? 40 : 314}
            height={showSmallLogo ? 76 : 125}
          />
        </div>

        <MaxWidth>
          <div className={styles.languageSwitcher}>
            <a
              href={`${text.language_switcher.nl_base_url}${router.asPath}`}
              lang="nl"
              hrefLang="nl"
              className={locale === 'nl' ? styles.languageActive : undefined}
              title={text.language_switcher.nl_title}
            >
              {text.language_switcher.nl}
            </a>
            |
            <a
              href={`${text.language_switcher.en_base_url}${router.asPath}`}
              lang="en-GB"
              hrefLang="en-GB"
              className={locale === 'en-GB' ? styles.languageActive : undefined}
              title={text.language_switcher.en_title}
            >
              {text.language_switcher.en}
            </a>
          </div>
          <h1>{text.header.title}</h1>
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
            <h3>{text.nav.title}</h3>
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
                    href={text.nav.links.meer_href}
                    target="_blank"
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

Layout.getLayout = (seoProps) => (page) => (
  // ???
  // @ts-ignore
  <Layout {...seoProps}>{page}</Layout>
);

export default Layout;
