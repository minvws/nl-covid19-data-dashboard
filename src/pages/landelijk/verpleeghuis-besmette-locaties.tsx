import BarScale from '~/components/barScale';
import { ContentHeader } from '~/components/layout/Content';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { LineChart } from '~/components/charts/index';

import Locatie from '~/assets/locaties.svg';

import formatNumber from '~/utils/formatNumber';

import siteText from '~/locale/index';

import {
  TotalNewlyReportedLocations,
  TotalReportedLocations,
} from '~/types/data.d';

import getNlData, { INationalData } from '~/static-props/nl-data';

const text: typeof siteText.verpleeghuis_besmette_locaties =
  siteText.verpleeghuis_besmette_locaties;

const NursingHomeInfectedLocations: FCWithLayout<INationalData> = (props) => {
  const { data: state } = props;

  const newLocations: TotalNewlyReportedLocations | undefined =
    state?.total_newly_reported_locations;
  const totalLocations: TotalReportedLocations | undefined =
    state?.total_reported_locations;

  return (
    <>
      <ContentHeader
        category={siteText.nationaal_layout.headings.verpleeghuis}
        title={text.titel}
        Icon={Locatie}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: newLocations?.last_value?.date_of_report_unix,
          dateInsertedUnix: newLocations?.last_value?.date_of_insertion_unix,
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
            value={newLocations?.last_value.total_new_reported_locations}
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
          {totalLocations && (
            <h3>
              {text.kpi_titel}{' '}
              <span className="text-blue kpi">
                {formatNumber(
                  totalLocations.last_value.total_reported_locations
                )}
              </span>
            </h3>
          )}
          <p>{text.kpi_toelichting}</p>
        </article>
      </div>

      {totalLocations && (
        <article className="metric-article">
          <LineChart
            title={text.linechart_titel}
            values={totalLocations.values.map((value) => ({
              value: value.total_reported_locations,
              date: value.date_of_report_unix,
            }))}
          />
        </article>
      )}
    </>
  );
};

NursingHomeInfectedLocations.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default NursingHomeInfectedLocations;
