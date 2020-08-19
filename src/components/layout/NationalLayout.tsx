import Link from 'next/link';
import { useRouter } from 'next/router';

import GraphHeader from 'components/graphHeader';
import { getLayout as getSiteLayout } from 'components/layout';

import GetestIcon from 'assets/test.svg';
import ReproIcon from 'assets/reproductiegetal.svg';

import siteText from 'locale';

import { WithChildren } from 'types';
import useMediaQuery from 'utils/useMediaQuery';

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
  const isLargeScreen = useMediaQuery('(min-width: 1000px)', true);
  const showAside = isLargeScreen || router.route === '/landelijk';
  const showContent = isLargeScreen || router.route !== '/landelijk';

  return (
    <div className="national-layout">
      {showAside && (
        <aside className="national-aside">
          <nav aria-label="metric navigation">
            <h2>Medische indicatoren</h2>
            <ul>
              <li>
                <Link href="/landelijk/positief-geteste-mensen">
                  <a>
                    <GraphHeader
                      Icon={GetestIcon}
                      title={siteText.positief_geteste_personen.title}
                    />
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/landelijk/reproductiegetal">
                  <a>
                    <GraphHeader
                      Icon={ReproIcon}
                      title={siteText.reproductiegetal.title}
                    />
                  </a>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
      )}

      {showContent && <div>{children}</div>}
    </div>
  );
}
