import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Arrow from '~/assets/arrow.svg';
import Arts from '~/assets/arts.svg';
import Notification from '~/assets/notification.svg';
import ReproIcon from '~/assets/reproductiegetal.svg';
import RioolwaterMonitoring from '~/assets/rioolwater-monitoring.svg';
import GetestIcon from '~/assets/test.svg';
import Verpleeghuiszorg from '~/assets/verpleeghuiszorg.svg';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import Ziektegolf from '~/assets/ziektegolf.svg';
import { HeadingWithIcon } from '~/components-styled/heading-with-icon';
import { NursingHomeInfectedPeopleMetric } from '~/components/common/nursing-home-infected-people-metric';
import { InfectiousPeopleMetric } from '~/components/landelijk/infectious-people-metric';
import { IntakeHospitalBarScale } from '~/components/landelijk/intake-hospital-barscale';
import { IntakeHospitalMetric } from '~/components/landelijk/intake-hospital-metric';
import { IntakeIntensiveCareBarscale } from '~/components/landelijk/intake-intensive-care-barscale';
import { IntakeIntensiveCareMetric } from '~/components/landelijk/intake-intensive-care-metric';
import { PositiveTestedPeopleBarScale } from '~/components/landelijk/positive-tested-people-barscale';
import { PositiveTestedPeopleMetric } from '~/components/landelijk/positive-tested-people-metric';
import { ReproductionIndexBarScale } from '~/components/landelijk/reproduction-index-barscale';
import { ReproductionIndexMetric } from '~/components/landelijk/reproduction-index-metric';
import { SewerWaterMetric } from '~/components/landelijk/sewer-water-metric';
import { SuspectedPatientsMetric } from '~/components/landelijk/suspected-patients-metric';
import Layout from '~/components/layout';
import siteText from '~/locale/index';
import { NationalPageProps } from '~/static-props/nl-data';
import theme from '~/style/theme';
import { useBreakpoints } from '~/utils/useBreakpoints';

/**
 * Using composition this can be a less confusing and more direct replacement
 * for getSiteLayout.
 *
 * @TODO replace other use of getSiteLayout()
 */
export function getNationalLayout(
  page: React.ReactNode,
  pageProps: NationalPageProps
) {
  return (
    <Layout
      {...siteText.nationaal_metadata}
      lastGenerated={pageProps.lastGenerated}
    >
      <NationalLayout {...pageProps}>{page}</NationalLayout>
    </Layout>
  );
}

interface NationalLayoutProps extends NationalPageProps {
  children: React.ReactNode;
}

/**
 * NationalLayout is a composition of persistent layouts.
 *
 * ## States
 *
 * ### Mobile
 * - /landelijk -> only show aside
 * - /landelijk/[metric] -> only show content (children)
 *
 * ### Desktop
 * - /landelijk -> shows aside and content (children)
 * - /landelijk/[metric] -> shows aside and content (children)
 *
 * More info on persistent layouts:
 * https://adamwathan.me/2019/10/17/persistent-layout-patterns-in-nextjs/
 */
function NationalLayout(props: NationalLayoutProps) {
  const { children, data } = props;
  const router = useRouter();
  const breakpoints = useBreakpoints();

  function getClassName(path: string) {
    return router.pathname === path
      ? 'metric-link active-metric-link'
      : 'metric-link';
  }

  const menuOpenUrl = {
    pathname: router.pathname,
    query: { ...router.query, menu: '1' },
  };

  const isMenuOpen =
    (router.pathname === '/' && !('menu' in router.query)) ||
    router.query.menu === '1';

  return (
    <>
      <Head>
        <link
          key="dc-spatial"
          rel="dcterms:spatial"
          href="https://standaarden.overheid.nl/owms/terms/Nederland"
        />
        <link
          key="dc-spatial-title"
          rel="dcterms:spatial"
          href="https://standaarden.overheid.nl/owms/terms/Nederland"
          title="Nederland"
        />
      </Head>

      <div
        className={`national-layout ${
          isMenuOpen ? 'has-menu-opened' : 'has-menu-closed'
        }`}
      >
        <Link href={menuOpenUrl}>
          <a className="back-button">
            <Arrow />
            {router.pathname === '/'
              ? siteText.nav.terug_naar_alle_cijfers_homepage
              : siteText.nav.terug_naar_alle_cijfers}
          </a>
        </Link>
        <aside className="national-aside">
          <nav
            /** re-mount when route changes in order to blur anchors */
            key={router.asPath}
            aria-label="metric navigation"
          >
            <h2>{siteText.nationaal_layout.headings.algemeen}</h2>
            <ul className="last-developments">
              <li>
                <Link
                  href={{
                    pathname: '/',
                    query: breakpoints.md
                      ? {} // only add menu flags on narrow devices
                      : isMenuOpen
                      ? { menu: '0' }
                      : { menu: '1' },
                  }}
                >
                  <a className={`last-developments-link ${getClassName('/')}`}>
                    <HeadingWithIcon
                      icon={<Notification color={theme.colors.notification} />}
                      title={siteText.laatste_ontwikkelingen.title}
                      subtitle={siteText.laatste_ontwikkelingen.menu_subtitle}
                    />
                  </a>
                </Link>
              </li>
            </ul>
            <h2>{siteText.nationaal_layout.headings.besmettingen}</h2>
            <ul>
              <li>
                <Link href="/landelijk/positief-geteste-mensen">
                  <a
                    className={getClassName(
                      '/landelijk/positief-geteste-mensen'
                    )}
                  >
                    <HeadingWithIcon
                      icon={<GetestIcon />}
                      title={siteText.positief_geteste_personen.titel_sidebar}
                    />
                    <span className="metric-wrapper">
                      <PositiveTestedPeopleMetric data={data} />
                      <PositiveTestedPeopleBarScale
                        data={data}
                        showAxis={false}
                        showValue={false}
                      />
                    </span>
                  </a>
                </Link>
              </li>

              <li>
                <Link href="/landelijk/besmettelijke-mensen">
                  <a
                    className={getClassName('/landelijk/besmettelijke-mensen')}
                  >
                    <HeadingWithIcon
                      icon={<Ziektegolf />}
                      title={siteText.besmettelijke_personen.titel_sidebar}
                    />
                    <span className="metric-wrapper">
                      <InfectiousPeopleMetric
                        data={
                          data.infectious_people_last_known_average?.last_value
                        }
                      />
                    </span>
                  </a>
                </Link>
              </li>

              <li>
                <Link href="/landelijk/reproductiegetal">
                  <a className={getClassName('/landelijk/reproductiegetal')}>
                    <HeadingWithIcon
                      icon={<ReproIcon />}
                      title={siteText.reproductiegetal.titel_sidebar}
                    />
                    <span className="metric-wrapper">
                      <ReproductionIndexMetric
                        data={
                          data.reproduction_index_last_known_average.last_value
                        }
                      />
                      <ReproductionIndexBarScale
                        data={data.reproduction_index_last_known_average}
                        showAxis={false}
                        showValue={false}
                      />
                    </span>
                  </a>
                </Link>
              </li>
            </ul>

            <h2>{siteText.nationaal_layout.headings.ziekenhuizen}</h2>

            <ul>
              <li>
                <Link href="/landelijk/ziekenhuis-opnames">
                  <a className={getClassName('/landelijk/ziekenhuis-opnames')}>
                    <HeadingWithIcon
                      icon={<Ziekenhuis />}
                      title={siteText.ziekenhuisopnames_per_dag.titel_sidebar}
                    />
                    <span className="metric-wrapper">
                      <IntakeHospitalMetric data={data} />
                      <IntakeHospitalBarScale
                        data={data}
                        showAxis={false}
                        showValue={false}
                      />
                    </span>
                  </a>
                </Link>
              </li>

              <li>
                <Link href="/landelijk/intensive-care-opnames">
                  <a
                    className={getClassName(
                      '/landelijk/intensive-care-opnames'
                    )}
                  >
                    <HeadingWithIcon
                      icon={<Arts />}
                      title={siteText.ic_opnames_per_dag.titel_sidebar}
                    />
                    <span className="metric-wrapper">
                      <IntakeIntensiveCareMetric data={data} />
                      <IntakeIntensiveCareBarscale
                        data={data.intake_intensivecare_ma}
                        showAxis={false}
                        showValue={false}
                      />
                    </span>
                  </a>
                </Link>
              </li>
            </ul>

            <h2>{siteText.nationaal_layout.headings.kwetsbare_groepen}</h2>

            <ul>
              <li>
                <Link href="/landelijk/verpleeghuiszorg">
                  <a className={getClassName('/landelijk/verpleeghuiszorg')}>
                    <HeadingWithIcon
                      icon={<Verpleeghuiszorg />}
                      title={
                        siteText.verpleeghuis_besmette_locaties.titel_sidebar
                      }
                    />
                    <span className="metric-wrapper">
                      <NursingHomeInfectedPeopleMetric
                        data={data.nursing_home.last_value}
                      />
                    </span>
                  </a>
                </Link>
              </li>
            </ul>

            <h2>{siteText.nationaal_layout.headings.vroege_signalen}</h2>

            <ul>
              <li>
                <Link href="/landelijk/verdenkingen-huisartsen">
                  <a
                    className={getClassName(
                      '/landelijk/verdenkingen-huisartsen'
                    )}
                  >
                    <HeadingWithIcon
                      icon={<Arts />}
                      title={siteText.verdenkingen_huisartsen.titel_sidebar}
                    />
                    <span className="metric-wrapper">
                      <SuspectedPatientsMetric
                        data={data.verdenkingen_huisartsen.last_value}
                      />
                    </span>
                  </a>
                </Link>
              </li>

              <li>
                <Link href="/landelijk/rioolwater">
                  <a className={getClassName('/landelijk/rioolwater')}>
                    <HeadingWithIcon
                      icon={<RioolwaterMonitoring />}
                      title={siteText.rioolwater_metingen.titel_sidebar}
                    />
                    <span className="metric-wrapper">
                      <SewerWaterMetric data={data.sewer} />
                    </span>
                  </a>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        <section className="national-content">{children}</section>

        <Link href={menuOpenUrl}>
          <a className="back-button back-button-footer">
            <Arrow />
            {router.pathname === '/'
              ? siteText.nav.terug_naar_alle_cijfers_homepage
              : siteText.nav.terug_naar_alle_cijfers}
          </a>
        </Link>
      </div>
    </>
  );
}
