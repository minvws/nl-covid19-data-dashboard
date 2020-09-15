import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import SEOHead from 'components/seoHead';
import MaxWidth from 'components/maxWidth';

import text from 'locale';
import useMediaQuery from 'utils/useMediaQuery';
import formatDate from 'utils/formatDate';

import styles from './layout.module.scss';

import { WithChildren } from 'types';
import getLocale from 'utils/getLocale';

import { ILastGeneratedData } from 'static-props/last-generated-data';

export interface LayoutProps {
  url?: string;
  title: string;
  description?: string;
  openGraphImage?: string;
  twitterImage?: string;
}

export type FCWithLayout<Props = void> = React.FC<Props> & {
  getLayout: (page: React.ReactNode, pageProps: Props) => React.ReactNode;
};

export function getLayoutWithMetadata(metadata: LayoutProps) {
  return function (page: React.ReactNode, pageProps: any) {
    const lastGenerated = pageProps.lastGenerated;
    return getLayout(metadata, lastGenerated)(<>{page}</>);
  };
}

export function getLayout(layoutProps: LayoutProps, lastGenerated: string) {
  return function (page: React.ReactNode): React.ReactNode {
    return (
      <Layout {...layoutProps} lastGenerated={lastGenerated}>
        {page}
      </Layout>
    );
  };
}

export default Layout;

function Layout(props: WithChildren<LayoutProps & ILastGeneratedData>) {
  const {
    children,
    title,
    description,
    openGraphImage,
    twitterImage,
    url,
    lastGenerated,
  } = props;

  const router = useRouter();

  // remove focus after navigation
  const blur = (evt: any) => evt.target.blur();

  const locale = getLocale();
  const showSmallLogo = useMediaQuery('(max-width: 480px)', true);

  const dateTime = new Date(Number(lastGenerated) * 1000).toISOString();

  const dateOfInsertion = lastGenerated
    ? formatDate(Number(lastGenerated) * 1000, 'long')
    : undefined;

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
              href={`https://coronadashboard.rijksoverheid.nl${router.asPath}`}
              lang="nl"
              hrefLang="nl"
              className={locale === 'nl' ? styles.languageActive : undefined}
              title="Website in het Nederlands"
            >
              NL
            </a>
            |
            <a
              href={`https://coronadashboard.government.nl${router.asPath}`}
              lang="en-GB"
              hrefLang="en-GB"
              className={locale === 'en-GB' ? styles.languageActive : undefined}
              title="Website in English"
            >
              EN
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
                      router.pathname.indexOf('/landelijk') === 0 ||
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
                <Link href="/veiligheidsregio">
                  <a
                    onClick={blur}
                    className={
                      router.pathname.indexOf('/veiligheidsregio') === 0
                        ? styles.link + ' ' + styles.active
                        : styles.link
                    }
                  >
                    {text.nav.links.veiligheidsregio}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/gemeente">
                  <a
                    onClick={blur}
                    className={
                      router.pathname.indexOf('/gemeente') === 0
                        ? styles.link + ' ' + styles.active
                        : styles.link
                    }
                  >
                    {text.nav.links.gemeente}
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
            <div className={styles.grid}>
              <div className={styles.footerColumn}>
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
                      <Link href="/veiligheidsregio">
                        <a onClick={blur} className={styles.footerLink}>
                          {text.nav.links.veiligheidsregio}
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
              </div>
              <div className={styles.footerColumn}>
                <h3>{text.laatst_bijgewerkt.message}</h3>
                <time dateTime={dateTime}>{dateOfInsertion}</time>
              </div>
            </div>
          </MaxWidth>
        </div>
      </footer>
    </>
  );
}
