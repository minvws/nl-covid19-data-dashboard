import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Arrow from '~/assets/arrow.svg';
import Arts from '~/assets/arts.svg';
import CoronaVirus from '~/assets/coronavirus.svg';
import Locatie from '~/assets/locaties.svg';
import Notification from '~/assets/notification.svg';
import ReproIcon from '~/assets/reproductiegetal.svg';
import RioolwaterMonitoring from '~/assets/rioolwater-monitoring.svg';
import GetestIcon from '~/assets/test.svg';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import Ziektegolf from '~/assets/ziektegolf.svg';
import { NursingHomeDeathsMetric } from '~/components/common/nursing-home-deaths-metric';
import { NursingHomeInfectedLocationsMetric } from '~/components/common/nursing-home-infected-locations-metric';
import { NursingHomeInfectedPeopleMetric } from '~/components/common/nursing-home-infected-people-metric';
import { InfectiousPeopleMetric } from '~/components/landelijk/infectious-people-metric';
import { IntakeHospitalBarScale } from '~/components/landelijk/intake-hospital-barscale';
import { IntakeHospitalMetric } from '~/components/landelijk/intake-hospital-metric';
import { IntakeIntensiveCareBarscale } from '~/components/landelijk/intake-intensive-care-barscale';
import { IntakeIntensiveCareMetric } from '~/components/landelijk/intake-intensive-care-metric';
import { PositiveTestedPeopleBarScale } from '~/components/landelijk/positive-tested-people-barscale';
import { PositiveTestedPeopleMetric } from '~/components/landelijk/positive-tested-people-metric';
import { ReproductionIndexBarScale } from '~/components/landelijk/reproduction-index-barscale';
import { ReproductionIndexMetric } from '~/components/landelijk/reproduction-index-metric';
import { SewerWaterMetric } from '~/components/landelijk/sewer-water-metric';
import { SuspectedPatientsMetric } from '~/components/landelijk/suspected-patients-metric';
import { getLayout as getSiteLayout } from '~/components/layout';
import { TitleWithIcon } from '~/components/titleWithIcon';
import siteText from '~/locale/index';
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

interface NationalLayoutProps extends INationalData {
  children: React.ReactNode;
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
function NationalLayout(props: NationalLayoutProps) {
  const { children, data } = props;
  const router = useRouter();
  const isMainRoute = router.route === '/';

  const { isMenuOpen, openMenu } = useMenuState(isMainRoute);

  // remove focus after navigation
  const blur = (evt: any) => evt.currentTarget.blur();

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
            <h2>{siteText.nationaal_layout.headings.laatste}</h2>
            <ul className="last-developments">
              <li>
                <Link href="/">
                  <a
                    onClick={blur}
                    className={`last-developments-link ${getClassName('/')}`}
                  >
                    <TitleWithIcon
                      Icon={Notification}
                      title={siteText.laatste_ontwikkelingen.title}
                      subtitle={siteText.laatste_ontwikkelingen.menu_subtitle}
                    />
                  </a>
                </Link>
              </li>
            </ul>
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
                      title={siteText.positief_geteste_personen.titel_sidebar}
                    />
                    <span className="metric-wrapper">
                      <PositiveTestedPeopleMetric
                        data={data.infected_people_total.last_value}
                      />
                      <PositiveTestedPeopleBarScale
                        data={data.infected_people_delta_normalized}
                        showAxis={false}
                        showValue={false}
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
                      title={siteText.reproductiegetal.titel_sidebar}
                    />
                    <span className="metric-wrapper">
                      <ReproductionIndexMetric
                        data={
                          data.reproduction_index_last_known_average.last_value
                        }
                      />
                      <ReproductionIndexBarScale
                        data={data.reproduction_index_last_known_average}
                        showAxis={false}
                        showValue={false}
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
                      title={siteText.besmettelijke_personen.titel_sidebar}
                    />
                    <span>
                      <InfectiousPeopleMetric
                        data={
                          data.infectious_people_last_known_average?.last_value
                        }
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
                      title={siteText.ziekenhuisopnames_per_dag.titel_sidebar}
                    />
                    <span className="metric-wrapper">
                      <IntakeHospitalMetric
                        data={data.intake_hospital_ma.last_value}
                      />
                      <IntakeHospitalBarScale
                        data={data.intake_hospital_ma}
                        showAxis={false}
                        showValue={false}
                      />
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
                      title={siteText.ic_opnames_per_dag.titel_sidebar}
                    />
                    <span className="metric-wrapper">
                      <IntakeIntensiveCareMetric
                        data={data.intake_intensivecare_ma.last_value}
                      />
                      <IntakeIntensiveCareBarscale
                        data={data.intake_intensivecare_ma}
                        showAxis={false}
                        showValue={false}
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
                      title={siteText.verdenkingen_huisartsen.titel_sidebar}
                    />
                    <span>
                      <SuspectedPatientsMetric
                        data={data.verdenkingen_huisartsen.last_value}
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
                      title={siteText.rioolwater_metingen.titel_sidebar}
                    />
                    <span>
                      <SewerWaterMetric data={data.sewer} />
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
                <Link href="/landelijk/verpleeghuis-besmette-locaties">
                  <a
                    onClick={blur}
                    className={getClassName(
                      '/landelijk/verpleeghuis-besmette-locaties'
                    )}
                  >
                    <TitleWithIcon
                      Icon={Locatie}
                      title={
                        siteText.verpleeghuis_besmette_locaties.titel_sidebar
                      }
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
                <Link href="/landelijk/verpleeghuis-sterfte">
                  <a
                    onClick={blur}
                    className={getClassName('/landelijk/verpleeghuis-sterfte')}
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
