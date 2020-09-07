import Link from 'next/link';
import Head from 'next/head';
import { useState } from 'react';
import useSWR from 'swr';
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

import siteText from 'locale';

import { WithChildren } from 'types';

import useMediaQuery from 'utils/useMediaQuery';
import { Municipal } from 'types/data';

import municipalities from 'data/gemeente_veiligheidsregio.json';

export default MunicipalityLayout;

export type TMunicipality = typeof municipalities;

export function getMunicipalityLayout() {
  return function (page: React.ReactNode): React.ReactNode {
    return getSiteLayout(siteText.gemeente_metadata)(
      <MunicipalityLayout>{page}</MunicipalityLayout>
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
function MunicipalityLayout(props: WithChildren) {
  const { children } = props;
  const router = useRouter();
  const { code } = router.query;
  const { data } = useSWR<Municipal>(`/json/${code}.json`);
  const isLargeScreen = useMediaQuery('(min-width: 1000px)', true);
  const showAside = isLargeScreen || router.route === '/gemeente';
  const showContent = isLargeScreen || router.route !== '/gemeente';
  const showMetricLinks = router.route !== '/gemeente';

  const [selectedMunicipality, setSelectedMunicipality] = useState<
    TMunicipality[number]
  >();

  // remove focus after navigation
  const blur = (evt: any) => evt.target.blur();

  function getClassName(path: string) {
    return router.pathname === path
      ? 'metric-link active-metric-link'
      : 'metric-link';
  }

  function handleMunicipalitySelect(region: TMunicipality[number]) {
    setSelectedMunicipality(region);

    if (isLargeScreen) {
      router.push(
        '/gemeente/[code]/positief-geteste-mensen',
        `/gemeente/${region.gemcode}/positief-geteste-mensen`
      );
    } else {
      router.push('/gemeente/[code]', `/gemeente/${region.gemcode}`);
    }
  }

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

      <div className="municipality-layout">
        {showAside && (
          <aside className="municipality-aside">
            <Combobox<TMunicipality[number]>
              handleSelect={handleMunicipalitySelect}
              options={municipalities}
            />

            {showMetricLinks && selectedMunicipality && (
              <nav aria-label="metric navigation">
                <h2>{siteText.nationaal_layout.headings.medisch}</h2>
                <ul>
                  <li>
                    <Link
                      href="/gemeente/[code]/positief-geteste-mensen"
                      as={`/gemeente/${selectedMunicipality.gemcode}/positief-geteste-mensen`}
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
                      as={`/gemeente/${selectedMunicipality.gemcode}/ziekenhuis-opnames`}
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
                    <Link
                      href="/gemeente/[code]/rioolwater"
                      as={`/gemeente/${selectedMunicipality.gemcode}/rioolwater`}
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
                  </li>
                </ul>
              </nav>
            )}
          </aside>
        )}

        {showContent && <section>{children}</section>}
      </div>
    </>
  );
}
