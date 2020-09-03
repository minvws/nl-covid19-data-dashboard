import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import useSWR from 'swr';
import { useRouter } from 'next/router';

import TitleWithIcon from 'components/titleWithIcon';
import { getLayout as getSiteLayout } from 'components/layout';
import { PostivelyTestedPeopleBarScale } from 'pages/veiligheidsregio/[code]/positief-geteste-mensen';
import { IntakeHospitalBarScale } from 'pages/veiligheidsregio/[code]/ziekenhuis-opnames';
import { SewerWaterBarScale } from 'pages/veiligheidsregio/[code]/rioolwater';
import Combobox from 'components/comboBox';

import GetestIcon from 'assets/test.svg';
import Ziekenhuis from 'assets/ziekenhuis.svg';
import RioolwaterMonitoring from 'assets/rioolwater-monitoring.svg';

import siteText from 'locale';
import safetyRegions from 'data/index';

import { WithChildren } from 'types';

import useMediaQuery from 'utils/useMediaQuery';

export default SafetyRegionLayout;

export function getSafetyRegionLayout() {
  return function (page: React.ReactNode): React.ReactNode {
    return getSiteLayout(siteText.veiligheidsregio_metadata)(
      <SafetyRegionLayout>{page}</SafetyRegionLayout>
    );
  };
}

type TSafetyRegion = {
  name: string;
  code: string;
  id: number;
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
 * https://adamwathan.me/2019/10/17/persistent-layout-patterns-in-nextjs/
 */
function SafetyRegionLayout(props: WithChildren) {
  const { children } = props;

  const router = useRouter();
  // TODO: replace with regio data
  const { data } = useSWR(`/json/NL.json`);
  const isLargeScreen = useMediaQuery('(min-width: 1000px)', true);
  const [selectedSafetyRegion, setSelectedSafetyRegion] = useState<
    TSafetyRegion
  >();

  const showAside = isLargeScreen || router.route === '/veiligheidsregio';
  const showContent = isLargeScreen || router.route !== '/veiligheidsregio';
  const showMetricLinks = router.route !== '/veiligheidsregio';
  // remove focus after navigation
  const blur = (evt: any) => evt.target.blur();

  function getClassName(path: string) {
    return router.pathname === path
      ? 'metric-link active-metric-link'
      : 'metric-link';
  }

  function handleSafeRegionSelect(region: TSafetyRegion) {
    setSelectedSafetyRegion(region);

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
          href="https://standaarden.overheid.nl/owms/terms/Nederland"
        />
        <link
          key="dc-spatial-title"
          rel="dcterms:spatial"
          href="https://standaarden.overheid.nl/owms/terms/Nederland"
          title="Nederland"
        />
      </Head>

      <div className="safety-region-layout">
        {showAside && (
          <aside className="safety-region-aside">
            <Combobox<TSafetyRegion>
              handleSelect={handleSafeRegionSelect}
              options={safetyRegions}
            />

            {showMetricLinks && selectedSafetyRegion && (
              <nav aria-label="metric navigation">
                <h2>{siteText.veiligheidsregio_layout.headings.medisch}</h2>

                <ul>
                  <li>
                    <Link
                      href="/veiligheidsregio/[code]/positief-geteste-mensen"
                      as={`/veiligheidsregio/${selectedSafetyRegion.code}/positief-geteste-mensen`}
                    >
                      <a
                        onClick={blur}
                        className={getClassName(
                          `/veiligheidsregio/[code]/positief-geteste-mensen`
                        )}
                      >
                        <TitleWithIcon
                          Icon={GetestIcon}
                          title={siteText.positief_geteste_personen.titel}
                        />
                        <span>
                          <PostivelyTestedPeopleBarScale
                            data={data?.infected_people_delta_normalized}
                          />
                        </span>
                      </a>
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/veiligheidsregio/[code]/ziekenhuis-opnames"
                      as={`/veiligheidsregio/${selectedSafetyRegion.code}/ziekenhuis-opnames`}
                    >
                      <a
                        onClick={blur}
                        className={getClassName(
                          `/veiligheidsregio/[code]/ziekenhuis-opnames`
                        )}
                      >
                        <TitleWithIcon
                          Icon={Ziekenhuis}
                          title={siteText.ziekenhuisopnames_per_dag.titel}
                        />
                        <span>
                          <IntakeHospitalBarScale
                            data={data?.intake_hospital_ma}
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
                      as={`/veiligheidsregio/${selectedSafetyRegion.code}/rioolwater`}
                    >
                      <a
                        onClick={blur}
                        className={getClassName(
                          `/veiligheidsregio/[code]/rioolwater`
                        )}
                      >
                        <TitleWithIcon
                          Icon={RioolwaterMonitoring}
                          title={siteText.rioolwater_metingen.titel}
                        />
                        <span>
                          <SewerWaterBarScale
                            data={data?.rioolwater_metingen}
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
