import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Arrow from '~/assets/arrow.svg';
import CoronaVirus from '~/assets/coronavirus.svg';
import Locatie from '~/assets/locaties.svg';
import RioolwaterMonitoring from '~/assets/rioolwater-monitoring.svg';
import GetestIcon from '~/assets/test.svg';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import Gedrag from '~/assets/gedrag.svg';
import { ComboBox } from '~/components/comboBox';
import { NursingHomeDeathsMetric } from '~/components/common/nursing-home-deaths-metric';
import { NursingHomeInfectedLocationsMetric } from '~/components/common/nursing-home-infected-locations-metric';
import { NursingHomeInfectedPeopleMetric } from '~/components/common/nursing-home-infected-people-metric';
import { getLayout as getSiteLayout } from '~/components/layout';
import { TitleWithIcon } from '~/components/titleWithIcon';
import { IntakeHospitalMetric } from '~/components/veiligheidsregio/intake-hospital-metric';
import { PositivelyTestedPeopleBarScale } from '~/components/veiligheidsregio/positive-tested-people-barscale';
import { PositivelyTestedPeopleMetric } from '~/components/veiligheidsregio/positive-tested-people-metric';
import { SewerWaterMetric } from '~/components/veiligheidsregio/sewer-water-metric';
import safetyRegions from '~/data/index';
import siteText from '~/locale/index';
import { ISafetyRegionData } from '~/static-props/safetyregion-data';
import { getSewerWaterBarScaleData } from '~/utils/sewer-water/safety-region-sewer-water.util';
import { useMediaQuery } from '~/utils/useMediaQuery';
import { useMenuState } from './useMenuState';
import { BehaviorMetric } from '~/domain/behavior/behavior-metric';

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

  const { isMenuOpen, openMenu } = useMenuState(isMainRoute);

  // remove focus after navigation
  const blur = (evt: any) => evt.currentTarget.blur();

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
        className={`safety-region-layout ${
          isMainRoute
            ? 'has-menu-and-content-opened'
            : isMenuOpen
            ? 'has-menu-opened'
            : 'has-menu-closed'
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
            onSelect={handleSafeRegionSelect}
            options={safetyRegions}
          />

          {showMetricLinks && (
            <nav aria-label="metric navigation">
              <h2>{safetyRegionName}</h2>
              <h2>{siteText.veiligheidsregio_layout.headings.besmettingen}</h2>
              <ul>
                <li>
                  <Link
                    href="/veiligheidsregio/[code]/positief-geteste-mensen"
                    as={`/veiligheidsregio/${code}/positief-geteste-mensen`}
                  >
                    <a
                      onClick={blur}
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
                      <span className="metric-wrapper">
                        <PositivelyTestedPeopleMetric
                          data={data.results_per_region.last_value}
                        />
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
              <h2>{siteText.veiligheidsregio_layout.headings.ziekenhuizen}</h2>
              <ul>
                <li>
                  <Link
                    href="/veiligheidsregio/[code]/ziekenhuis-opnames"
                    as={`/veiligheidsregio/${code}/ziekenhuis-opnames`}
                  >
                    <a
                      onClick={blur}
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
                        <IntakeHospitalMetric data={data.results_per_region} />
                      </span>
                    </a>
                  </Link>
                </li>
              </ul>
              <h2>
                {siteText.veiligheidsregio_layout.headings.verpleeghuizen}
              </h2>
              <ul>
                <li>
                  <Link
                    href="/veiligheidsregio/[code]/verpleeghuis-positief-geteste-personen"
                    as={`/veiligheidsregio/${code}/verpleeghuis-positief-geteste-personen`}
                  >
                    <a
                      onClick={blur}
                      className={getClassName(
                        '/veiligheidsregio/[code]/verpleeghuis-positief-geteste-personen'
                      )}
                    >
                      <TitleWithIcon
                        Icon={GetestIcon}
                        title={
                          siteText.verpleeghuis_positief_geteste_personen
                            .titel_sidebar
                        }
                      />
                      <span>
                        <NursingHomeInfectedPeopleMetric
                          data={data.nursing_home.last_value}
                        />
                      </span>
                    </a>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/veiligheidsregio/[code]/verpleeghuis-besmette-locaties"
                    as={`/veiligheidsregio/${code}/verpleeghuis-besmette-locaties`}
                  >
                    <a
                      onClick={blur}
                      className={getClassName(
                        '/veiligheidsregio/[code]/verpleeghuis-besmette-locaties'
                      )}
                    >
                      <TitleWithIcon
                        Icon={Locatie}
                        title={siteText.verpleeghuis_besmette_locaties.titel}
                      />
                      <span>
                        <NursingHomeInfectedLocationsMetric
                          data={data.nursing_home.last_value}
                        />
                      </span>
                    </a>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/veiligheidsregio/[code]/verpleeghuis-sterfte"
                    as={`/veiligheidsregio/${code}/verpleeghuis-sterfte`}
                  >
                    <a
                      onClick={blur}
                      className={getClassName(
                        '/veiligheidsregio/[code]/verpleeghuis-sterfte'
                      )}
                    >
                      <TitleWithIcon
                        Icon={CoronaVirus}
                        title={siteText.verpleeghuis_oversterfte.titel_sidebar}
                      />
                      <span>
                        <NursingHomeDeathsMetric
                          data={data.nursing_home.last_value}
                        />
                      </span>
                    </a>
                  </Link>
                </li>
              </ul>

              <h2>
                {siteText.veiligheidsregio_layout.headings.vroege_signalen}
              </h2>

              <ul>
                <li>
                  <Link
                    href="/veiligheidsregio/[code]/rioolwater"
                    as={`/veiligheidsregio/${code}/rioolwater`}
                  >
                    <a
                      onClick={blur}
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
                        <SewerWaterMetric
                          data={getSewerWaterBarScaleData(data)}
                        />
                      </span>
                    </a>
                  </Link>
                </li>
              </ul>
              <h2>{siteText.nationaal_layout.headings.gedrag}</h2>
              <ul>
                <li>
                  <Link
                    href="/veiligheidsregio/[code]/gedrag"
                    as={`/veiligheidsregio/${code}/gedrag`}
                  >
                    <a
                      onClick={blur}
                      className={getClassName(
                        '/veiligheidsregio/[code]/gedrag'
                      )}
                    >
                      <TitleWithIcon
                        Icon={Gedrag}
                        title={siteText.nl_gedrag.sidebar.titel}
                      />
                      <span>
                        <BehaviorMetric data={data.behavior} />
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
