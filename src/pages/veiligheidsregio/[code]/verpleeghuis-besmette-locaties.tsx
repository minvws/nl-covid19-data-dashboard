import { ContentHeader } from '~/components/layout/Content';
import { FCWithLayout } from '~/components/layout';
import { LineChart } from '~/components/charts/index';

import Locatie from '~/assets/locaties.svg';

import { formatNumber, formatPercentage } from '~/utils/formatNumber';

import siteText from '~/locale/index';

import { getSafetyRegionLayout } from '~/components/layout/SafetyRegionLayout';
import {
  getSafetyRegionData,
  getSafetyRegionPaths,
  ISafetyRegionData,
} from '~/static-props/safetyregion-data';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { SEOHead } from '~/components/seoHead';

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

      <div className="layout-two-column">
        <article className="metric-article column-item">
          <h3>{text.barscale_titel}</h3>
          <p className="text-blue kpi" data-cy="infected_daily_total">
            {formatNumber(newlyInfectedLocations)}
          </p>
          <p>{text.barscale_toelichting}</p>
        </article>

        <article className="metric-article column-item">
          <h3>{text.kpi_titel}</h3>
          <p className="text-blue kpi">
            {formatNumber(infectedLocationsTotal)} (
            {formatPercentage(infectedLocationsPercentage)}%)
          </p>
          <p>{text.kpi_toelichting}</p>
        </article>
      </div>

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
