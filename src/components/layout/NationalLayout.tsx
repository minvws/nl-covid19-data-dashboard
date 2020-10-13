import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { TitleWithIcon } from '~/components/titleWithIcon';
import { getLayout as getSiteLayout } from '~/components/layout';

import { ReproductionIndexBarScale } from '~/components/landelijk/reproduction-index-barscale';
import { PositiveTestedPeopleBarScale } from '~/components/landelijk/positive-tested-people-barscale';
import { InfectiousPeopleBarScale } from '~/components/landelijk/infectious-people-barscale';
import { IntakeHospitalBarScale } from '~/components/landelijk/intake-hospital-barscale';

import { IntakeIntensiveCareBarscale } from '~/components/landelijk/intake-intensive-care-barscale';
import { SuspectedPatientsBarScale } from '~/components/landelijk/suspected-patients-barscale';
import { SewerWaterBarScale } from '~/components/landelijk/sewer-water-barscale';
import { NursingHomeInfectedPeopleBarScale } from '~/components/common/nursing-home-infected-people-barscale';
import { NursingHomeInfectedLocationsBarScale } from '~/components/common/nursing-home-infected-locations-barscale';
import { NursingHomeDeathsBarScale } from '~/components/common/nursing-home-deaths-barscale';

import GetestIcon from '~/assets/test.svg';
import ReproIcon from '~/assets/reproductiegetal.svg';
import Ziektegolf from '~/assets/ziektegolf.svg';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import Arts from '~/assets/arts.svg';
import RioolwaterMonitoring from '~/assets/rioolwater-monitoring.svg';
import Locatie from '~/assets/locaties.svg';
import CoronaVirus from '~/assets/coronavirus.svg';
import Arrow from '~/assets/arrow.svg';
import Notification from '~/assets/notification.svg';

import siteText from '~/locale/index';

import { WithChildren } from '~/types/index';

import { INationalData } from '~/static-props/nl-data';
import { useMenuState } from './useMenuState';

export function getNationalLayout() {
  return function (
    page: React.ReactNode,
    pageProps: INationalData
  ): React.ReactNode {
    return getSiteLayout(
      siteText.nationaal_metadata,
      pageProps.lastGenerated
    )(<NationalLayout {...pageProps}>{page}</NationalLayout>);
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
  const isMainRoute = router.route === '/';

  const { isMenuOpen, openMenu, handleMenuClick } = useMenuState(isMainRoute);

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
        className={`national-layout has-menu-${
          isMenuOpen ? 'opened' : 'closed'
        }`}
      >
        <Link href="/landelijk">
          <a className="back-button" onClick={openMenu}>
            <Arrow />
            {router.pathname === '/'
              ? siteText.nav.terug_naar_alle_cijfers_homepage
              : siteText.nav.terug_naar_alle_cijfers}
          </a>
        </Link>
        <aside className="national-aside">
          <nav aria-label="metric navigation">
            <ul className="last-developments">
              <li>
                <Link href="/">
                  <a
                    onClick={handleMenuClick}
                    className={`last-developments-link ${getClassName('/')}`}
                  >
                    <TitleWithIcon
                      Icon={Notification}
                      title={siteText.laatste_ontwikkelingen.title}
                    />
                    <span>{siteText.laatste_ontwikkelingen.menu_subtitle}</span>
                  </a>
                </Link>
              </li>
            </ul>
            <h2>{siteText.nationaal_layout.headings.medisch}</h2>
            <ul>
              <li>
                <Link href="/landelijk/positief-geteste-mensen">
                  <a
                    onClick={handleMenuClick}
                    className={getClassName(
                      '/landelijk/positief-geteste-mensen'
                    )}
                  >
                    <TitleWithIcon
                      Icon={GetestIcon}
                      title={siteText.positief_geteste_personen.titel_sidebar}
                    />
                    <span>
                      <PositiveTestedPeopleBarScale
                        data={data?.infected_people_delta_normalized}
                        showAxis={true}
                      />
                    </span>
                  </a>
                </Link>
              </li>

              <li>
                <Link href="/landelijk/besmettelijke-mensen">
                  <a
                    onClick={handleMenuClick}
                    className={getClassName('/landelijk/besmettelijke-mensen')}
                  >
                    <TitleWithIcon
                      Icon={Ziektegolf}
                      title={siteText.besmettelijke_personen.titel_sidebar}
                    />
                    <span>
                      <InfectiousPeopleBarScale
                        data={data?.infectious_people_count_normalized}
                        showAxis={true}
                      />
                    </span>
                  </a>
                </Link>
              </li>

              <li>
                <Link href="/landelijk/reproductiegetal">
                  <a
                    onClick={handleMenuClick}
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
                        showAxis={true}
                      />
                    </span>
                  </a>
                </Link>
              </li>

              <li>
                <Link href="/landelijk/ziekenhuis-opnames">
                  <a
                    onClick={handleMenuClick}
                    className={getClassName('/landelijk/ziekenhuis-opnames')}
                  >
                    <TitleWithIcon
                      Icon={Ziekenhuis}
                      title={siteText.ziekenhuisopnames_per_dag.titel}
                    />
                    <span>
                      <IntakeHospitalBarScale
                        data={data?.intake_hospital_ma}
                        showAxis={true}
                      />
                    </span>
                  </a>
                </Link>
              </li>

              <li>
                <Link href="/landelijk/intensive-care-opnames">
                  <a
                    onClick={handleMenuClick}
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
                        showAxis={true}
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
                    onClick={handleMenuClick}
                    className={getClassName(
                      '/landelijk/verdenkingen-huisartsen'
                    )}
                  >
                    <TitleWithIcon
                      Icon={Arts}
                      title={siteText.verdenkingen_huisartsen.titel_sidebar}
                    />
                    <span>
                      <SuspectedPatientsBarScale
                        data={data?.verdenkingen_huisartsen}
                        showAxis={true}
                      />
                    </span>
                  </a>
                </Link>
              </li>

              <li>
                <Link href="/landelijk/rioolwater">
                  <a
                    onClick={handleMenuClick}
                    className={getClassName('/landelijk/rioolwater')}
                  >
                    <TitleWithIcon
                      Icon={RioolwaterMonitoring}
                      title={siteText.rioolwater_metingen.titel}
                    />
                    <span>
                      <SewerWaterBarScale
                        data={data?.rioolwater_metingen}
                        showAxis={true}
                      />
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
                    onClick={handleMenuClick}
                    className={getClassName(
                      '/landelijk/verpleeghuis-positief-geteste-personen'
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
                      <NursingHomeInfectedPeopleBarScale
                        value={
                          data?.infected_people_nursery_count_daily.last_value
                            .infected_nursery_daily
                        }
                        showAxis={true}
                      />
                    </span>
                  </a>
                </Link>
              </li>

              <li>
                <Link href="/landelijk/verpleeghuis-besmette-locaties">
                  <a
                    onClick={handleMenuClick}
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
                        value={
                          data?.total_reported_locations.last_value
                            .total_reported_locations
                        }
                        showAxis={true}
                      />
                    </span>
                  </a>
                </Link>
              </li>

              <li>
                <Link href="/landelijk/verpleeghuis-sterfte">
                  <a
                    onClick={handleMenuClick}
                    className={getClassName('/landelijk/verpleeghuis-sterfte')}
                  >
                    <TitleWithIcon
                      Icon={CoronaVirus}
                      title={siteText.verpleeghuis_oversterfte.titel_sidebar}
                    />
                    <span>
                      <NursingHomeDeathsBarScale
                        value={
                          data?.deceased_people_nursery_count_daily.last_value
                            .deceased_nursery_daily
                        }
                        showAxis={true}
                      />
                    </span>
                  </a>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        <section className="national-content">{children}</section>

        <Link href="/landelijk">
          <a className="back-button back-button-footer" onClick={openMenu}>
            <Arrow />
            {router.pathname === '/'
              ? siteText.nav.terug_naar_alle_cijfers_homepage
              : siteText.nav.terug_naar_alle_cijfers}
          </a>
        </Link>
      </div>
    </>
  );
}
