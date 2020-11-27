import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Arrow from '~/assets/arrow.svg';
import RioolwaterMonitoring from '~/assets/rioolwater-monitoring.svg';
import GetestIcon from '~/assets/test.svg';
import Verpleeghuiszorg from '~/assets/verpleeghuiszorg.svg';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import { Category } from '~/components-styled/sidebar/category';
import { TitleWithIcon } from '~/components-styled/sidebar/title-with-icon';
import { ComboBox } from '~/components/comboBox';
import { getLayout as getSiteLayout } from '~/components/layout';
import { IntakeHospitalMetric } from '~/components/veiligheidsregio/intake-hospital-metric';
import { PositivelyTestedPeopleBarScale } from '~/components/veiligheidsregio/positive-tested-people-barscale';
import { PositivelyTestedPeopleMetric } from '~/components/veiligheidsregio/positive-tested-people-metric';
import { SewerWaterMetric } from '~/components/veiligheidsregio/sewer-water-metric';
import safetyRegions from '~/data/index';
import siteText from '~/locale/index';
import { ISafetyRegionData } from '~/static-props/safetyregion-data';
import { getSewerWaterBarScaleData } from '~/utils/sewer-water/safety-region-sewer-water.util';
import { useMediaQuery } from '~/utils/useMediaQuery';
import { NursingHomeInfectedPeopleMetric } from '../common/nursing-home-infected-people-metric';

export function getSafetyRegionLayout() {
  return function (
    page: React.ReactNode,
    pageProps: ISafetyRegionData
  ): React.ReactNode {
    return getSiteLayout(
      siteText.veiligheidsregio_metadata,
      pageProps.lastGenerated
    )(<SafetyRegionLayout {...pageProps}>{page}</SafetyRegionLayout>);
  };
}

type TSafetyRegion = {
  name: string;
  displayName?: string;
  code: string;
  id: number;
  searchTerms?: string[];
};

/**
 * SafetyRegionLayout is a composition of persistent layouts.
 *
 * ## States
 *
 * ### Mobile
 * - /veiligheidsregio -> only show aside
 * - /veiligheidsregio/[metric] -> only show content (children)
 *
 * ### Desktop
 * - /veiligheidsregio -> shows aside and content (children)
 * - /veiligheidsregio/[metric] -> shows aside and content (children)
 *
 * More info on persistent layouts:
 * https:adamwathan.me/2019/10/17/persistent-layout-patterns-in-nextjs/
 */
function SafetyRegionLayout(
  props: ISafetyRegionData & { children: React.ReactNode }
) {
  const { children, data, safetyRegionName } = props;

  const router = useRouter();
  const isLargeScreen = useMediaQuery('(min-width: 1000px)', true);

  const { code } = router.query;

  const isMainRoute =
    router.route === '/veiligheidsregio' ||
    router.route === `/veiligheidsregio/[code]`;

  const showMetricLinks = router.route !== '/veiligheidsregio';

  const isMenuOpen = router.query.menu === '1';
  const menuUrl = {
    pathname: router.pathname,
    query: { ...router.query, menu: '1' },
  };

  function getClassName(path: string) {
    return router.pathname === path
      ? 'metric-link active-metric-link'
      : 'metric-link';
  }

  function handleSafeRegionSelect(region: TSafetyRegion) {
    if (isLargeScreen) {
      router.push(`/veiligheidsregio/${region.code}/positief-geteste-mensen`);
    } else {
      router.push(`/veiligheidsregio/${region.code}`);
    }
  }

  return (
    <>
      <Head>
        <link
          key="dc-spatial"
          rel="dcterms:spatial"
          href="https:standaarden.overheid.nl/owms/terms/Nederland"
        />
        <link
          key="dc-spatial-title"
          rel="dcterms:spatial"
          href="https:standaarden.overheid.nl/owms/terms/Nederland"
          title="Nederland"
        />
      </Head>

      <div
        className={`safety-region-layout ${
          isMainRoute
            ? 'has-menu-and-content-opened'
            : isMenuOpen
            ? 'has-menu-opened'
            : 'has-menu-closed'
        }`}
      >
        <Link href={menuUrl}>
          <a className="back-button">
            <Arrow />
            {siteText.nav.terug_naar_alle_cijfers}
          </a>
        </Link>
        <aside className="safety-region-aside">
          <ComboBox<TSafetyRegion>
            placeholder={siteText.common.zoekveld_placeholder_regio}
            onSelect={handleSafeRegionSelect}
            options={safetyRegions}
          />

          {showMetricLinks && (
            <nav
              /** re-mount when route changes in order to blur anchors */
              key={router.asPath}
              aria-label="metrieken per categorie keuze"
              role="navigation"
            >
              <Category>{safetyRegionName}</Category>
              <ul>
                <li>
                  <Category>
                    {siteText.veiligheidsregio_layout.headings.besmettingen}
                  </Category>
                  <ul>
                    <li>
                      <Link
                        href={`/veiligheidsregio/${code}/positief-geteste-mensen`}
                      >
                        <a
                          className={getClassName(
                            `/veiligheidsregio/[code]/positief-geteste-mensen`
                          )}
                        >
                          <TitleWithIcon
                            icon={<GetestIcon />}
                            title={
                              siteText
                                .veiligheidsregio_positief_geteste_personen
                                .titel_sidebar
                            }
                          />
                          <span className="metric-wrapper">
                            <PositivelyTestedPeopleMetric data={data} />
                            <PositivelyTestedPeopleBarScale
                              data={data.results_per_region}
                              showAxis={false}
                              showValue={false}
                            />
                          </span>
                        </a>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Category>
                    {siteText.veiligheidsregio_layout.headings.ziekenhuizen}
                  </Category>
                  <ul>
                    <li>
                      <Link
                        href={`/veiligheidsregio/${code}/ziekenhuis-opnames`}
                      >
                        <a
                          className={getClassName(
                            `/veiligheidsregio/[code]/ziekenhuis-opnames`
                          )}
                        >
                          <TitleWithIcon
                            icon={<Ziekenhuis />}
                            title={
                              siteText
                                .veiligheidsregio_ziekenhuisopnames_per_dag
                                .titel_sidebar
                            }
                          />
                          <span className="metric-wrapper">
                            <IntakeHospitalMetric data={data} />
                          </span>
                        </a>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Category>
                    {
                      siteText.veiligheidsregio_layout.headings
                        .kwetsbare_groepen
                    }
                  </Category>
                  <ul>
                    <li>
                      <Link href={`/veiligheidsregio/${code}/verpleeghuiszorg`}>
                        <a
                          className={getClassName(
                            '/veiligheidsregio/[code]/verpleeghuiszorg'
                          )}
                        >
                          <TitleWithIcon
                            icon={<Verpleeghuiszorg />}
                            title={
                              siteText
                                .veiligheidsregio_verpleeghuis_besmette_locaties
                                .titel_sidebar
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
                </li>
                <li>
                  <Category>
                    {siteText.veiligheidsregio_layout.headings.vroege_signalen}
                  </Category>
                  <ul>
                    <li>
                      <Link href={`/veiligheidsregio/${code}/rioolwater`}>
                        <a
                          className={getClassName(
                            `/veiligheidsregio/[code]/rioolwater`
                          )}
                        >
                          <TitleWithIcon
                            icon={<RioolwaterMonitoring />}
                            title={
                              siteText.veiligheidsregio_rioolwater_metingen
                                .titel_sidebar
                            }
                          />
                          <span className="metric-wrapper">
                            <SewerWaterMetric
                              data={getSewerWaterBarScaleData(data)}
                            />
                          </span>
                        </a>
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
          )}
        </aside>

        <main className="safety-region-content">{children}</main>

        <Link href={menuUrl}>
          <a className="back-button back-button-footer">
            <Arrow />
            {siteText.nav.terug_naar_alle_cijfers}
          </a>
        </Link>
      </div>
    </>
  );
}
