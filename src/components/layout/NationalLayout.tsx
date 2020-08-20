import Link from 'next/link';
import useSWR from 'swr';
import { useRouter } from 'next/router';

import GraphHeader from 'components/graphHeader';
import { getLayout as getSiteLayout } from 'components/layout';

import GetestIcon from 'assets/test.svg';
import ReproIcon from 'assets/reproductiegetal.svg';

import siteText from 'locale';

import { WithChildren } from 'types';
import useMediaQuery from 'utils/useMediaQuery';
import BarScale from 'components/barScale';

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
                    className={
                      router.pathname === '/landelijk/positief-geteste-mensen'
                        ? 'metric-link active-metric-link'
                        : 'metric-link'
                    }
                  >
                    <GraphHeader
                      Icon={GetestIcon}
                      title={siteText.positief_geteste_personen.title}
                    />
                    <span>
                      <BarScale
                        min={0}
                        max={10}
                        screenReaderText={
                          siteText.positief_geteste_personen
                            .screen_reader_graph_content
                        }
                        value={
                          data?.infected_people_delta_normalized?.last_value
                            ?.infected_daily_increase ?? 0
                        }
                        id="positief"
                        rangeKey="infected_daily_increase"
                        gradient={[
                          {
                            color: '#3391CC',
                            value: 0,
                          },
                        ]}
                      />
                    </span>
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/landelijk/reproductiegetal">
                  <a
                    onClick={blur}
                    className={
                      router.pathname === '/landelijk/reproductiegetal'
                        ? 'metric-link active-metric-link'
                        : 'metric-link'
                    }
                  >
                    <GraphHeader
                      Icon={ReproIcon}
                      title={siteText.reproductiegetal.title}
                    />
                    <span>
                      <BarScale
                        min={0}
                        max={2}
                        screenReaderText={
                          siteText.reproductiegetal.screen_reader_graph_content
                        }
                        signaalwaarde={1}
                        value={
                          data?.reproduction_index_last_known_average
                            ?.last_value?.reproduction_index_avg ?? 0
                        }
                        id="repro"
                        rangeKey="reproduction_index_avg"
                        gradient={[
                          {
                            color: '#69c253',
                            value: 0,
                          },
                          {
                            color: '#69c253',
                            value: 1,
                          },
                          {
                            color: '#D3A500',
                            value: 1.0104,
                          },
                          {
                            color: '#f35065',
                            value: 1.125,
                          },
                        ]}
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
