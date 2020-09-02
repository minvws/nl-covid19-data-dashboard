import Link from 'next/link';
import Head from 'next/head';
import useSWR from 'swr';
import { useRouter } from 'next/router';

import TitleWithIcon from 'components/titleWithIcon';
import { getLayout as getSiteLayout } from 'components/layout';
import { PostivelyTestedPeopleBarScale } from 'pages/gemeente/positief-geteste-mensen';
import { IntakeHospitalBarScale } from 'pages/gemeente/ziekenhuis-opnames';
import { SewerWaterBarScale } from 'pages/gemeente/rioolwater';

import GetestIcon from 'assets/test.svg';
import Ziekenhuis from 'assets/ziekenhuis.svg';
import RioolwaterMonitoring from 'assets/rioolwater-monitoring.svg';

import siteText from 'locale';

import { WithChildren } from 'types';

import useMediaQuery from 'utils/useMediaQuery';

export default MunicipalityLayout;

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
  const { data } = useSWR(`/json/NL.json`);
  const isLargeScreen = useMediaQuery('(min-width: 1000px)', true);
  const showAside = isLargeScreen || router.route === '/gemeente';
  const showContent = isLargeScreen || router.route !== '/gemeente';
  // remove focus after navigation
  const blur = (evt: any) => evt.target.blur();

  function getClassName(path: string) {
    return router.pathname === path
      ? 'metric-link active-metric-link'
      : 'metric-link';
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
            <nav aria-label="metric navigation">
              <h2>{siteText.nationaal_layout.headings.medisch}</h2>
              <ul>
                <li>
                  <Link href="/gemeente/positief-geteste-mensen">
                    <a
                      onClick={blur}
                      className={getClassName(
                        '/gemeente/positief-geteste-mensen'
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
                  <Link href="/gemeente/ziekenhuis-opnames">
                    <a
                      onClick={blur}
                      className={getClassName('/gemeente/ziekenhuis-opnames')}
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

              <h2>{siteText.nationaal_layout.headings.overig}</h2>
              <ul>
                <li>
                  <Link href="/gemeente/rioolwater">
                    <a
                      onClick={blur}
                      className={getClassName('/gemeente/rioolwater')}
                    >
                      <TitleWithIcon
                        Icon={RioolwaterMonitoring}
                        title={siteText.rioolwater_metingen.titel}
                      />
                      <span>
                        <SewerWaterBarScale data={data?.rioolwater_metingen} />
                      </span>
                    </a>
                  </Link>
                </li>
              </ul>
            </nav>
          </aside>
        )}

        {showContent && <section>{children}</section>}
      </div>
    </>
  );
}
