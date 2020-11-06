import React, { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import LocaleContext, { ILocale } from '~/locale/localeContext';
import { ILastGeneratedData } from '~/static-props/last-generated-data';
import styles from './layout.module.scss';

import { useMediaQuery } from '~/utils/useMediaQuery';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { getLocale } from '~/utils/getLocale';

import { SEOHead } from '~/components/seoHead';
import { MaxWidth } from '~/components/maxWidth';

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

export function getLayoutWithMetadata(metadataKey: string) {
  return function (page: React.ReactNode, pageProps: any) {
    const { lastGenerated } = pageProps;
    return getLayout(metadataKey, lastGenerated)(<>{page}</>);
  };
}

export function getLayout(metadataKey: string, lastGenerated: string) {
  return function (page: React.ReactNode): React.ReactNode {
    const { siteText }: ILocale = useContext(LocaleContext);

    return (
      <Layout {...siteText[metadataKey]} lastGenerated={lastGenerated}>
        {page}
      </Layout>
    );
  };
}

export default Layout;

function Layout(
  props: LayoutProps & ILastGeneratedData & { children: React.ReactNode }
) {
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
  const { siteText }: ILocale = useContext(LocaleContext);

  // remove focus after navigation
  const blur = (evt: any) => evt.target.blur();

  const locale = getLocale();
  const showSmallLogo = useMediaQuery('(max-width: 480px)', true);

  const dateTime = formatDateFromSeconds(
    siteText.utils,
    Number(lastGenerated),
    'iso'
  );
  const dateOfInsertion = lastGenerated
    ? formatDateFromSeconds(siteText.utils, Number(lastGenerated), 'long')
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
        <a href="#content">{siteText.skiplinks.inhoud}</a>
        <a href="#main-navigation">{siteText.skiplinks.nav}</a>
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
            alt={siteText.header.logo_alt}
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
          <h1>{siteText.header.title}</h1>
          <p>
            {siteText.header.text}{' '}
            <Link href="/over">
              <a className={styles.readMoreLink}>{siteText.header.link}</a>
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
                    {siteText.nav.links.index}
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
                    {siteText.nav.links.veiligheidsregio}
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
                    {siteText.nav.links.gemeente}
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
                    {siteText.nav.links.over}
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
                <h3>{siteText.nav.title}</h3>
                <nav>
                  <ul className={styles.footerList}>
                    <li>
                      <Link href="/">
                        <a onClick={blur} className={styles.footerLink}>
                          {siteText.nav.links.index}
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/veiligheidsregio">
                        <a onClick={blur} className={styles.footerLink}>
                          {siteText.nav.links.veiligheidsregio}
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/gemeente">
                        <a onClick={blur} className={styles.footerLink}>
                          {siteText.nav.links.gemeente}
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/over">
                        <a onClick={blur} className={styles.footerLink}>
                          {siteText.nav.links.over}
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/veelgestelde-vragen">
                        <a onClick={blur} className={styles.footerLink}>
                          {siteText.nav.links.veelgestelde_vragen}
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/over-risiconiveaus">
                        <a onClick={blur} className={styles.footerLink}>
                          {siteText.nav.links.over_risiconiveaus}
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/verantwoording">
                        <a onClick={blur} className={styles.footerLink}>
                          {siteText.nav.links.verantwoording}
                        </a>
                      </Link>
                    </li>
                    <li>
                      <a
                        href={siteText.nav.links.meer_href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.footerLink}
                      >
                        {siteText.nav.links.meer}
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
              <div className={styles.footerColumn}>
                <h3>{siteText.laatst_bijgewerkt.title}</h3>
                <p
                  dangerouslySetInnerHTML={{
                    __html: replaceVariablesInText(
                      siteText.laatst_bijgewerkt.message,
                      {
                        dateOfInsertion: `<time datetime=${dateTime}>${dateOfInsertion}</time>`,
                      }
                    ),
                  }}
                />
              </div>
            </div>
          </MaxWidth>
        </div>
      </footer>
    </>
  );
}
