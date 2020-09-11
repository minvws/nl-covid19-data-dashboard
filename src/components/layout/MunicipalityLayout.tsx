import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';

import TitleWithIcon from 'components/titleWithIcon';
import { getLayout as getSiteLayout } from 'components/layout';
import { PostivelyTestedPeopleBarScale } from 'pages/gemeente/[code]/positief-geteste-mensen';
import { IntakeHospitalBarScale } from 'pages/gemeente/[code]/ziekenhuis-opnames';
import { SewerWaterBarScale } from 'pages/gemeente/[code]/rioolwater';
import Combobox from 'components/comboBox';
import { getSewerWaterBarScaleData } from 'utils/sewer-water/municipality-sewer-water.util';

import GetestIcon from 'assets/test.svg';
import Ziekenhuis from 'assets/ziekenhuis.svg';
import RioolwaterMonitoring from 'assets/rioolwater-monitoring.svg';
import Arrow from 'assets/arrow.svg';

import siteText from 'locale';

import { WithChildren } from 'types';

import useMediaQuery from 'utils/useMediaQuery';

import municipalities from 'data/gemeente_veiligheidsregio.json';
import { IMunicipalityData } from 'static-props/municipality-data';
import { getLocalTitleForMuncipality } from 'utils/getLocalTitleForCode';
import getSafetyRegionForMunicipalityCode from 'utils/getSafetyRegionForMunicipalityCode';

export default MunicipalityLayout;

interface IMunicipality {
  name: string;
  safetyRegion: string;
  gemcode: string;
}

export function getMunicipalityLayout() {
  return function (
    page: React.ReactNode,
    pageProps: IMunicipalityData
  ): React.ReactNode {
    return getSiteLayout(siteText.gemeente_metadata)(
      <MunicipalityLayout {...pageProps}>{page}</MunicipalityLayout>
    );
  };
}

/*
 * MunicipalityLayout is a composition of persistent layouts.
 *
 * ## States
 *
 * ### Mobile
 * - /gemeente -> only show aside
 * - /gemeente/[metric] -> only show content (children)
 *
 * ### Desktop
 * - /gemeente -> shows aside and content (children)
 * - /gemeente/[metric] -> shows aside and content (children)
 *
 * More info on persistent layouts:
 * https://adamwathan.me/2019/10/17/persistent-layout-patterns-in-nextjs/
 */
function MunicipalityLayout(props: WithChildren<IMunicipalityData>) {
  const { children, data } = props;
  const router = useRouter();
  const isLargeScreen = useMediaQuery('(min-width: 1000px)');

  const { code } = router.query;

  const showMetricLinks = router.route !== '/gemeente';

  const isMainRoute =
    router.route === '/gemeente' || router.route === `/gemeente/[code]`;
  const displayTendency = isMainRoute ? 'aside' : 'content';

  // remove focus after navigation
  const blur = (evt: any) => evt.target.blur();

  function getClassName(path: string) {
    return router.pathname === path
      ? 'metric-link active-metric-link'
      : 'metric-link';
  }

  function handleMunicipalitySelect(region: IMunicipality) {
    if (isLargeScreen) {
      router.push(
        '/gemeente/[code]/positief-geteste-mensen',
        `/gemeente/${region.gemcode}/positief-geteste-mensen`
      );
    } else {
      router.push('/gemeente/[code]', `/gemeente/${region.gemcode}`);
    }
  }

  const safetyRegion:
    | { name: string; code: string; id: number }
    | undefined = getSafetyRegionForMunicipalityCode(code as string);

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
        className={`municipality-layout small-screen-${displayTendency}-tendency`}
      >
        {!isMainRoute && (
          <Link href="/gemeente/[code]" as={`/gemeente/${code}`}>
            <a className="back-button">
              <Arrow />
              {siteText.nav.terug_naar_alle_cijfers}
            </a>
          </Link>
        )}
        <aside className="municipality-aside">
          <Combobox<IMunicipality>
            placeholder={siteText.common.zoekveld_placeholder_gemeente}
            handleSelect={handleMunicipalitySelect}
            options={municipalities}
          />

          {showMetricLinks && (
            <nav aria-label="metric navigation">
              <div className="region-names">
                <h2>
                  {getLocalTitleForMuncipality(
                    '{{municipality}}',
                    code as string
                  )}
                </h2>
                {safetyRegion && (
                  <p>
                    {siteText.common.veiligheidsregio_label}{' '}
                    <Link
                      href="/veiligheidsregio/[code]/positief-geteste-mensen"
                      as={`/veiligheidsregio/${safetyRegion.code}/positief-geteste-mensen`}
                    >
                      <a>{safetyRegion.name}</a>
                    </Link>
                  </p>
                )}
              </div>
              <h2>{siteText.nationaal_layout.headings.medisch}</h2>
              <ul>
                <li>
                  <Link
                    href="/gemeente/[code]/positief-geteste-mensen"
                    as={`/gemeente/${code}/positief-geteste-mensen`}
                  >
                    <a
                      onClick={blur}
                      className={getClassName(
                        `/gemeente/[code]/positief-geteste-mensen`
                      )}
                    >
                      <TitleWithIcon
                        Icon={GetestIcon}
                        title={
                          siteText.gemeente_positief_geteste_personen
                            .titel_sidebar
                        }
                      />
                      <span>
                        <PostivelyTestedPeopleBarScale
                          data={data?.positive_tested_people}
                        />
                      </span>
                    </a>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/gemeente/[code]/ziekenhuis-opnames"
                    as={`/gemeente/${code}/ziekenhuis-opnames`}
                  >
                    <a
                      onClick={blur}
                      className={getClassName(
                        `/gemeente/[code]/ziekenhuis-opnames`
                      )}
                    >
                      <TitleWithIcon
                        Icon={Ziekenhuis}
                        title={
                          siteText.gemeente_ziekenhuisopnames_per_dag
                            .titel_sidebar
                        }
                      />
                      <span>
                        <IntakeHospitalBarScale
                          data={data?.hospital_admissions}
                        />
                      </span>
                    </a>
                  </Link>
                </li>
              </ul>

              <h2>{siteText.nationaal_layout.headings.overig}</h2>
              <ul>
                <li>
                  {getSewerWaterBarScaleData(data) ? (
                    <Link
                      href="/gemeente/[code]/rioolwater"
                      as={`/gemeente/${code}/rioolwater`}
                    >
                      <a
                        onClick={blur}
                        className={getClassName(`/gemeente/[code]/rioolwater`)}
                      >
                        <TitleWithIcon
                          Icon={RioolwaterMonitoring}
                          title={
                            siteText.gemeente_rioolwater_metingen.titel_sidebar
                          }
                        />
                        <span>
                          <SewerWaterBarScale
                            data={getSewerWaterBarScaleData(data)}
                          />
                        </span>
                      </a>
                    </Link>
                  ) : (
                    <div className="metric-not-available">
                      <TitleWithIcon
                        Icon={RioolwaterMonitoring}
                        title={
                          siteText.gemeente_rioolwater_metingen.titel_sidebar
                        }
                      />
                      <span>
                        <SewerWaterBarScale
                          data={getSewerWaterBarScaleData(data)}
                        />
                      </span>
                    </div>
                  )}
                </li>
              </ul>
            </nav>
          )}
        </aside>

        <section className="municipality-content">{children}</section>
      </div>
    </>
  );
}
