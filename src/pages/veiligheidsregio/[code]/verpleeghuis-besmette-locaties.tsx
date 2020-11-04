import Locatie from '~/assets/locaties.svg';
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
import { Text } from '~/components-styled/typography';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';

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
        <KpiTile
          title={text.kpi_titel}
          metadata={{
            date: state?.nursing_home.last_value?.date_of_report_unix,
            source: text.bron,
          }}
        >
          <KpiValue
            absolute={infectedLocationsTotal}
            percentage={infectedLocationsPercentage}
          />
          <Text>{text.kpi_toelichting}</Text>
        </KpiTile>
        <KpiTile
          title={text.barscale_titel}
          metadata={{
            date: state?.nursing_home.last_value?.date_of_report_unix,
            source: text.bron,
          }}
        >
          <KpiValue
            data-cy="infected_daily_total"
            absolute={newlyInfectedLocations}
          />
          <Text>{text.barscale_toelichting}</Text>
        </KpiTile>
      </TwoKpiSection>

      {infectedLocationsTotal !== undefined && (
        <LineChartTile
          title={text.linechart_titel}
          values={state?.nursing_home.values.map((value) => ({
            value: value.infected_locations_total,
            date: value.date_of_report_unix,
          }))}
          metadata={{
            date: state?.nursing_home.last_value?.date_of_report_unix,
            source: text.bron,
          }}
        />
      )}
    </>
  );
};

NursingHomeInfectedLocations.getLayout = getSafetyRegionLayout();

export const getStaticProps = getSafetyRegionData();
export const getStaticPaths = getSafetyRegionPaths();

export default NursingHomeInfectedLocations;
