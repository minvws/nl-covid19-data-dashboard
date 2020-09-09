import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';

import TitleWithIcon from 'components/titleWithIcon';
import { getLayout as getSiteLayout } from 'components/layout';
import { ReproductionIndexBarScale } from 'pages/landelijk/reproductiegetal';
import { PostivelyTestedPeopleBarScale } from 'pages/landelijk/positief-geteste-mensen';
import { InfectiousPeopleBarScale } from 'pages/landelijk/besmettelijke-mensen';
import { IntakeHospitalBarScale } from 'pages/landelijk/ziekenhuis-opnames';
import { IntakeIntensiveCareBarscale } from 'pages/landelijk/intensive-care-opnames';
import { SuspectedPatientsBarScale } from 'pages/landelijk/verdenkingen-huisartsen';
import { SewerWaterBarScale } from 'pages/landelijk/rioolwater';
import { NursingHomeInfectedPeopleBarScale } from 'pages/landelijk/verpleeghuis-positief-geteste-personen';
import { NursingHomeInfectedLocationsBarScale } from 'pages/landelijk/verpleeghuis-besmette-locaties';
import { NursingHomeDeathsBarScale } from 'pages/landelijk/verpleeghuis-sterfte';

import GetestIcon from 'assets/test.svg';
import ReproIcon from 'assets/reproductiegetal.svg';
import Ziektegolf from 'assets/ziektegolf.svg';
import Ziekenhuis from 'assets/ziekenhuis.svg';
import Arts from 'assets/arts.svg';
import RioolwaterMonitoring from 'assets/rioolwater-monitoring.svg';
import Locatie from 'assets/locaties.svg';
import CoronaVirus from 'assets/coronavirus.svg';
import Arrow from 'assets/arrow.svg';

import siteText from 'locale';

import { WithChildren } from 'types';

import { INationalData } from 'static-props/nl-data';

export default NationalLayout;

export function getNationalLayout() {
  return function (
    page: React.ReactNode,
    pageProps: INationalData
  ): React.ReactNode {
    return getSiteLayout(siteText.nationaal_metadata)(
      <NationalLayout {...pageProps}>{page}</NationalLayout>
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
function NationalLayout(props: WithChildren<INationalData>) {
  const { children, data } = props;
  const router = useRouter();
  const isMainRoute = router.route === '/landelijk';
  const displayTendency = isMainRoute ? 'aside' : 'content';

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

      <div
        className={`national-layout small-screen-${displayTendency}-tendency`}
      >
        {!isMainRoute && (
          <Link href="/landelijk">
            <a className="back-button">
              <Arrow />
              {siteText.nav.terug_naar_alle_cijfers}
            </a>
          </Link>
        )}
        <aside className="national-aside">
          <nav aria-label="metric navigation">
            <h2>{siteText.nationaal_layout.headings.medisch}</h2>
            <ul>
              <li>
                <Link href="/landelijk/positief-geteste-mensen">
                  <a
                    onClick={blur}
                    className={getClassName(
                      '/landelijk/positief-geteste-mensen'
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
                <Link href="/landelijk/besmettelijke-mensen">
                  <a
                    onClick={blur}
                    className={getClassName('/landelijk/besmettelijke-mensen')}
                  >
                    <TitleWithIcon
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
                <Link href="/landelijk/reproductiegetal">
                  <a
                    onClick={blur}
                    className={getClassName('/landelijk/reproductiegetal')}
                  >
                    <TitleWithIcon
                      Icon={ReproIcon}
                      title={siteText.reproductiegetal.titel}
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
                <Link href="/landelijk/ziekenhuis-opnames">
                  <a
                    onClick={blur}
                    className={getClassName('/landelijk/ziekenhuis-opnames')}
                  >
                    <TitleWithIcon
                      Icon={Ziekenhuis}
                      title={siteText.ziekenhuisopnames_per_dag.titel}
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
                    <TitleWithIcon
                      Icon={Arts}
                      title={siteText.ic_opnames_per_dag.titel}
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

            <h2>{siteText.nationaal_layout.headings.overig}</h2>
            <ul>
              <li>
                <Link href="/landelijk/verdenkingen-huisartsen">
                  <a
                    onClick={blur}
                    className={getClassName(
                      '/landelijk/verdenkingen-huisartsen'
                    )}
                  >
                    <TitleWithIcon
                      Icon={Arts}
                      title={siteText.verdenkingen_huisartsen.titel}
                    />
                    <span>
                      <SuspectedPatientsBarScale
                        data={data?.verdenkingen_huisartsen}
                      />
                    </span>
                  </a>
                </Link>
              </li>

              <li>
                <Link href="/landelijk/rioolwater">
                  <a
                    onClick={blur}
                    className={getClassName('/landelijk/rioolwater')}
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

            <h2>{siteText.nationaal_layout.headings.verpleeghuis}</h2>
            <ul>
              <li>
                <Link href="/landelijk/verpleeghuis-positief-geteste-personen">
                  <a
                    onClick={blur}
                    className={getClassName(
                      '/landelijk/verpleeghuis-positief-geteste-personen'
                    )}
                  >
                    <TitleWithIcon
                      Icon={GetestIcon}
                      title={
                        siteText.verpleeghuis_positief_geteste_personen.titel
                      }
                    />
                    <span>
                      <NursingHomeInfectedPeopleBarScale
                        data={data?.infected_people_nursery_count_daily}
                      />
                    </span>
                  </a>
                </Link>
              </li>

              <li>
                <Link href="/landelijk/verpleeghuis-besmette-locaties">
                  <a
                    onClick={blur}
                    className={getClassName(
                      '/landelijk/verpleeghuis-besmette-locaties'
                    )}
                  >
                    <TitleWithIcon
                      Icon={Locatie}
                      title={siteText.verpleeghuis_besmette_locaties.titel}
                    />
                    <span>
                      <NursingHomeInfectedLocationsBarScale
                        data={data?.total_newly_reported_locations}
                      />
                    </span>
                  </a>
                </Link>
              </li>

              <li>
                <Link href="/landelijk/verpleeghuis-sterfte">
                  <a
                    onClick={blur}
                    className={getClassName('/landelijk/verpleeghuis-sterfte')}
                  >
                    <TitleWithIcon
                      Icon={CoronaVirus}
                      title={siteText.verpleeghuis_oversterfte.titel}
                    />
                    <span>
                      <NursingHomeDeathsBarScale
                        data={data?.deceased_people_nursery_count_daily}
                      />
                    </span>
                  </a>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        <section className="national-content">{children}</section>
      </div>
    </>
  );
}
