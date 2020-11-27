import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Heading } from '~/components-styled/typography';
import { MaxWidth } from '~/components/maxWidth';
import { SEOHead } from '~/components/seoHead';
import text from '~/locale/index';
import { ILastGeneratedData } from '~/static-props/last-generated-data';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { getLocale } from '~/utils/getLocale';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { useMediaQuery } from '~/utils/useMediaQuery';
import styles from './layout.module.scss';

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

  const locale = getLocale();
  const showSmallLogo = useMediaQuery('(max-width: 480px)', true);

  const dateTime = formatDateFromSeconds(Number(lastGenerated), 'iso');
  const dateOfInsertion = lastGenerated
    ? formatDateFromSeconds(Number(lastGenerated), 'long')
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
        <a href="#footer-navigation">{text.skiplinks.footernav}</a>
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
          <div
            style={{
              fontSize: '2.02729rem',
              lineHeight: '1.23318',
              marginBottom: 0,
              marginTop: '2.5rem',
              fontWeight: 'bold',
            }}
          >
            {text.header.title}
          </div>
          <p>
            {text.header.text}{' '}
            <Link href="/over">
              <a className={styles.readMoreLink}>{text.header.link}</a>
            </Link>
          </p>
        </MaxWidth>

        <nav
          /** re-mount when route changes in order to blur anchors */
          key={router.route}
          id="main-navigation"
          className={styles.nav}
          role="navigation"
          aria-label="landelijk regio gemeente keuze"
        >
          <MaxWidth>
            <ul className={styles.navList}>
              <li>
                <Link href="/">
                  <a
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

      <div id="content">{children}</div>

      <footer
        /** re-mount when route changes in order to blur anchors */
        key={router.route}
      >
        <div className={styles.footer}>
          <MaxWidth>
            <div className={styles.grid}>
              <div className={styles.footerColumn}>
                <Heading level={4} fontSize={3}>
                  {text.nav.title}
                </Heading>
                <nav
                  aria-label="pagina keuze"
                  role="navigation"
                  id="footer-navigation"
                >
                  <ul className={styles.footerList}>
                    <li>
                      <Link href="/">
                        <a className={styles.footerLink}>
                          {text.nav.links.index}
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/veiligheidsregio">
                        <a className={styles.footerLink}>
                          {text.nav.links.veiligheidsregio}
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/gemeente">
                        <a className={styles.footerLink}>
                          {text.nav.links.gemeente}
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/over">
                        <a className={styles.footerLink}>
                          {text.nav.links.over}
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/veelgestelde-vragen">
                        <a className={styles.footerLink}>
                          {text.nav.links.veelgestelde_vragen}
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/over-risiconiveaus">
                        <a className={styles.footerLink}>
                          {text.nav.links.over_risiconiveaus}
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/verantwoording">
                        <a className={styles.footerLink}>
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
                <Heading level={4} fontSize={3}>
                  {text.laatst_bijgewerkt.title}
                </Heading>
                <p
                  dangerouslySetInnerHTML={{
                    __html: replaceVariablesInText(
                      text.laatst_bijgewerkt.message,
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
