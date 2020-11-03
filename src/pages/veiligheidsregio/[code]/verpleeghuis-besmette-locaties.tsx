import Locatie from '~/assets/locaties.svg';
import { LineChart } from '~/components/charts/index';
import { FCWithLayout } from '~/components/layout';
import { ContentHeader } from '~/components/contentHeader';
import { getSafetyRegionLayout } from '~/components/layout/SafetyRegionLayout';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import {
  getSafetyRegionData,
  getSafetyRegionPaths,
  ISafetyRegionData,
} from '~/static-props/safetyregion-data';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';

const text = siteText.veiligheidsregio_verpleeghuis_besmette_locaties;

const NursingHomeInfectedLocations: FCWithLayout<ISafetyRegionData> = (
  props
) => {
  const { data: state, safetyRegionName } = props;

  const newlyInfectedLocations =
    state?.nursing_home.last_value.newly_infected_locations;
  const infectedLocationsTotal =
    state?.nursing_home.last_value.infected_locations_total;

  const infectedLocationsPercentage =
    state?.nursing_home.last_value.infected_locations_percentage;

  return (
    <>
      <SEOHead
        title={replaceVariablesInText(text.metadata.title, {
          safetyRegionName,
        })}
        description={replaceVariablesInText(text.metadata.description, {
          safetyRegionName,
        })}
      />
      <ContentHeader
        category={siteText.veiligheidsregio_layout.headings.verpleeghuis}
        title={replaceVariablesInText(text.titel, {
          safetyRegion: safetyRegionName,
        })}
        Icon={Locatie}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: state?.nursing_home.last_value?.date_of_report_unix,
          dateInsertedUnix:
            state?.nursing_home.last_value?.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      <TwoKpiSection>
        <KpiTile title={text.kpi_titel} description={text.kpi_toelichting}>
          <KpiValue
            absolute={infectedLocationsTotal}
            percentage={infectedLocationsPercentage}
          />
        </KpiTile>

        <KpiTile
          title={text.barscale_titel}
          description={text.barscale_toelichting}
        >
          <KpiValue absolute={newlyInfectedLocations} />
        </KpiTile>
      </TwoKpiSection>

      {infectedLocationsTotal !== undefined && (
        <article className="metric-article">
          <LineChart
            title={text.linechart_titel}
            values={state?.nursing_home.values.map((value) => ({
              value: value.infected_locations_total,
              date: value.date_of_report_unix,
            }))}
          />
        </article>
      )}
    </>
  );
};

NursingHomeInfectedLocations.getLayout = getSafetyRegionLayout();

export const getStaticProps = getSafetyRegionData();
export const getStaticPaths = getSafetyRegionPaths();

export default NursingHomeInfectedLocations;
