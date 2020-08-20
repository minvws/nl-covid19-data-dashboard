import Link from 'next/link';
import useSWR from 'swr';
import { useRouter } from 'next/router';

import GraphHeader from 'components/graphHeader';
import { getLayout as getSiteLayout } from 'components/layout';
import { ReproductionIndexBarScale } from 'pages/landelijk/reproductiegetal';
import { PostivelyTestedPeopleBarScale } from 'pages/landelijk/positief-geteste-mensen';

import GetestIcon from 'assets/test.svg';
import ReproIcon from 'assets/reproductiegetal.svg';
import Ziektegolf from 'assets/ziektegolf.svg';
import Ziekenhuis from 'assets/ziekenhuis.svg';
import Arts from 'assets/arts.svg';

import siteText from 'locale';

import { WithChildren } from 'types';
import useMediaQuery from 'utils/useMediaQuery';
import { InfectiousPeopleBarScale } from 'pages/landelijk/besmettelijke-mensen';
import { IntakeHospitalBarScale } from 'pages/landelijk/ziekenhuis-opnames';
import { IntakeIntensiveCareBarscale } from 'pages/landelijk/intensive-care-opnames';

export default NationalLayout;

export function getNationalLayout() {
  return function (page: React.ReactNode): React.ReactNode {
    return getSiteLayout(siteText.nationaal_metadata)(
      <NationalLayout>{page}</NationalLayout>
    );
  };
}

/*
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
function NationalLayout(props: WithChildren) {
  const { children } = props;
  const router = useRouter();
  const { data } = useSWR(`/json/NL.json`);
  const isLargeScreen = useMediaQuery('(min-width: 1000px)', true);
  const showAside = isLargeScreen || router.route === '/landelijk';
  const showContent = isLargeScreen || router.route !== '/landelijk';
  // remove focus after navigation
  const blur = (evt: any) => evt.target.blur();

  function getClassName(path: string) {
    return router.pathname === path
      ? 'metric-link active-metric-link'
      : 'metric-link';
  }

  return (
    <div className="national-layout">
      {showAside && (
        <aside className="national-aside">
          <nav aria-label="metric navigation">
            <h2>Medische indicatoren</h2>
            <ul>
              <li>
                <Link href="/landelijk/positief-geteste-mensen">
                  <a
                    onClick={blur}
                    className={getClassName(
                      '/landelijk/positief-geteste-mensen'
                    )}
                  >
                    <GraphHeader
                      Icon={GetestIcon}
                      title={siteText.positief_geteste_personen.title}
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
                <Link href="/landelijk/reproductiegetal">
                  <a
                    onClick={blur}
                    className={getClassName('/landelijk/reproductiegetal')}
                  >
                    <GraphHeader
                      Icon={ReproIcon}
                      title={siteText.reproductiegetal.title}
                    />
                    <span>
                      <ReproductionIndexBarScale
                        data={data?.reproduction_index}
                        lastKnown={data?.reproduction_index_last_known_average}
                      />
                    </span>
                  </a>
                </Link>
              </li>

              <li>
                <Link href="/landelijk/besmettelijke-mensen">
                  <a
                    onClick={blur}
                    className={getClassName('/landelijk/besmettelijke-mensen')}
                  >
                    <GraphHeader
                      Icon={Ziektegolf}
                      title={siteText.besmettelijke_personen.title}
                    />
                    <span>
                      <InfectiousPeopleBarScale
                        data={data?.infectious_people_count_normalized}
                      />
                    </span>
                  </a>
                </Link>
              </li>

              <li>
                <Link href="/landelijk/ziekenhuis-opnames">
                  <a
                    onClick={blur}
                    className={getClassName('/landelijk/ziekenhuis-opnames')}
                  >
                    <GraphHeader
                      Icon={Ziekenhuis}
                      title={siteText.ziekenhuisopnames_per_dag.title}
                    />
                    <span>
                      <IntakeHospitalBarScale data={data?.intake_hospital_ma} />
                    </span>
                  </a>
                </Link>
              </li>

              <li>
                <Link href="/landelijk/intensive-care-opnames">
                  <a
                    onClick={blur}
                    className={getClassName(
                      '/landelijk/intensive-care-opnames'
                    )}
                  >
                    <GraphHeader
                      Icon={Arts}
                      title={siteText.ic_opnames_per_dag.title}
                    />
                    <span>
                      <IntakeIntensiveCareBarscale
                        data={data?.intake_intensivecare_ma}
                      />
                    </span>
                  </a>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
      )}

      {showContent && (
        <section>
          <div>{children}</div>
        </section>
      )}
    </div>
  );
}
