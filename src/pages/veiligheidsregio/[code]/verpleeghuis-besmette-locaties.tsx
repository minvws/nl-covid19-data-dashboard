import { BarScale } from '~/components/barScale';
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

          <BarScale
            min={0}
            max={30}
            screenReaderText={text.barscale_screenreader_text}
            value={newlyInfectedLocations}
            id="besmette_locaties_verpleeghuis"
            rangeKey="total_new_reported_locations"
            gradient={[
              {
                color: '#3391CC',
                value: 0,
              },
            ]}
            showAxis={true}
          />
          <p>{text.barscale_toelichting}</p>
        </article>

        <article className="metric-article column-item">
          {infectedLocationsTotal !== undefined && (
            <h3>
              {text.kpi_titel}{' '}
              <span className="text-blue kpi">
                {formatNumber(infectedLocationsTotal)} (
                {formatPercentage(infectedLocationsPercentage)}%)
              </span>
            </h3>
          )}
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
