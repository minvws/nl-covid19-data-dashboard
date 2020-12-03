import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Box } from '~/components-styled/base';
import { MaxWidth } from '~/components-styled/max-width';
import { SEOHead } from '~/components/seoHead';
import { SiteHeader } from '~/domain/site/header';
import text from '~/locale/index';
import { ILastGeneratedData } from '~/static-props/last-generated-data';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
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

      <nav
        role="navigation"
        className={styles.skiplinks}
        aria-label={text.aria_labels.skip_links}
      >
        <a href="#content">{text.skiplinks.inhoud}</a>
        <a href="#main-navigation">{text.skiplinks.nav}</a>
        <a href="#metric-navigation">{text.skiplinks.metric_nav}</a>
        <a href="#footer-navigation">{text.skiplinks.footer_nav}</a>
      </nav>

      <SiteHeader />

      <div>{children}</div>

      <footer
        /** re-mount when route changes in order to blur anchors */
        key={router.route}
      >
        <div className={styles.footer}>
          <MaxWidth>
            <div className={styles.grid}>
              <div className={styles.footerColumn}>
                <Box fontSize={3} fontWeight="bold">
                  {text.nav.title}
                </Box>
                <nav
                  aria-label={text.aria_labels.footer_keuze}
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
                <Box fontSize={3} fontWeight="bold">
                  {text.laatst_bijgewerkt.title}
                </Box>
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
