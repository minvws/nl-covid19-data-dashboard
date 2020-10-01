import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';

import siteText from '~/locale/index';
import safetyRegions from '~/data/index';
import { WithChildren } from '~/types/index';
import { ISafetyRegionData } from '~/static-props/safetyregion-data';

import { useMediaQuery } from '~/utils/useMediaQuery';
import { getSewerWaterBarScaleData } from '~/utils/sewer-water/safety-region-sewer-water.util';

import { PositivelyTestedPeopleBarScale } from '~/components/veiligheidsregio/positive-tested-people-barscale';
import { IntakeHospitalBarScale } from '~/components/veiligheidsregio/intake-hospital-barscale';
import { SewerWaterBarScale } from '~/components/veiligheidsregio/sewer-water-barscale';

import { TitleWithIcon } from '~/components/titleWithIcon';
import { getLayout as getSiteLayout } from '~/components/layout';
import { ComboBox } from '~/components/comboBox';

import GetestIcon from '~/assets/test.svg';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import RioolwaterMonitoring from '~/assets/rioolwater-monitoring.svg';
import Arrow from '~/assets/arrow.svg';
import { useMenuState } from './useMenuState';

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

/*
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
function SafetyRegionLayout(props: WithChildren<ISafetyRegionData>) {
  const { children, data } = props;

  const router = useRouter();
  const isLargeScreen = useMediaQuery('(min-width: 1000px)', true);

  const { code } = router.query;

  const isMainRoute =
    router.route === '/veiligheidsregio' ||
    router.route === `/veiligheidsregio/[code]`;

  const showMetricLinks = router.route !== '/veiligheidsregio';

  const { isMenuOpen, openMenu, handleMenuClick } = useMenuState(isMainRoute);

  function getClassName(path: string) {
    return router.pathname === path
      ? 'metric-link active-metric-link'
      : 'metric-link';
  }

  function handleSafeRegionSelect(region: TSafetyRegion) {
    if (isLargeScreen) {
      router.push(
        '/veiligheidsregio/[code]/positief-geteste-mensen',
        `/veiligheidsregio/${region.code}/positief-geteste-mensen`
      );
    } else {
      router.push(
        '/veiligheidsregio/[code]',
        `/veiligheidsregio/${region.code}`
      );
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
        className={`safety-region-layout  has-menu-${
          isMainRoute ? 'and-content-opened' : isMenuOpen ? 'opened' : 'closed'
        }`}
      >
        <Link href="/veiligheidsregio/[code]" as={`/veiligheidsregio/${code}`}>
          <a className="back-button" onClick={openMenu}>
            <Arrow />
            {siteText.nav.terug_naar_alle_cijfers}
          </a>
        </Link>
        <aside className="safety-region-aside">
          <ComboBox<TSafetyRegion>
            placeholder={siteText.common.zoekveld_placeholder_regio}
            handleSelect={handleSafeRegionSelect}
            options={safetyRegions}
          />

          {showMetricLinks && (
            <nav aria-label="metric navigation">
              <h2>{siteText.veiligheidsregio_layout.headings.medisch}</h2>

              <ul>
                <li>
                  <Link
                    href="/veiligheidsregio/[code]/positief-geteste-mensen"
                    as={`/veiligheidsregio/${code}/positief-geteste-mensen`}
                  >
                    <a
                      onClick={handleMenuClick}
                      className={getClassName(
                        `/veiligheidsregio/[code]/positief-geteste-mensen`
                      )}
                    >
                      <TitleWithIcon
                        Icon={GetestIcon}
                        title={
                          siteText.veiligheidsregio_positief_geteste_personen
                            .titel_sidebar
                        }
                      />
                      <span>
                        <PositivelyTestedPeopleBarScale
                          data={data?.results_per_region}
                          showAxis={true}
                        />
                      </span>
                    </a>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/veiligheidsregio/[code]/ziekenhuis-opnames"
                    as={`/veiligheidsregio/${code}/ziekenhuis-opnames`}
                  >
                    <a
                      onClick={handleMenuClick}
                      className={getClassName(
                        `/veiligheidsregio/[code]/ziekenhuis-opnames`
                      )}
                    >
                      <TitleWithIcon
                        Icon={Ziekenhuis}
                        title={
                          siteText.veiligheidsregio_ziekenhuisopnames_per_dag
                            .titel_sidebar
                        }
                      />
                      <span>
                        <IntakeHospitalBarScale
                          data={data?.results_per_region}
                          showAxis={true}
                        />
                      </span>
                    </a>
                  </Link>
                </li>
              </ul>

              <h2>{siteText.veiligheidsregio_layout.headings.overig}</h2>
              <ul>
                <li>
                  <Link
                    href="/veiligheidsregio/[code]/rioolwater"
                    as={`/veiligheidsregio/${code}/rioolwater`}
                  >
                    <a
                      onClick={handleMenuClick}
                      className={getClassName(
                        `/veiligheidsregio/[code]/rioolwater`
                      )}
                    >
                      <TitleWithIcon
                        Icon={RioolwaterMonitoring}
                        title={
                          siteText.veiligheidsregio_rioolwater_metingen
                            .titel_sidebar
                        }
                      />
                      <span>
                        <SewerWaterBarScale
                          data={getSewerWaterBarScaleData(data)}
                          showAxis={true}
                        />
                      </span>
                    </a>
                  </Link>
                </li>
              </ul>
            </nav>
          )}
        </aside>

        <section className="safety-region-content">{children}</section>

        <Link href="/veiligheidsregio/[code]" as={`/veiligheidsregio/${code}`}>
          <a className="back-button back-button-footer" onClick={openMenu}>
            <Arrow />
            {siteText.nav.terug_naar_alle_cijfers}
          </a>
        </Link>
      </div>
    </>
  );
}
