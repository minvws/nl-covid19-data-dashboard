import { GetStaticProps } from 'next';

import BarScale from 'components/barScale';
import { ContentHeader } from 'components/layout/Content';
import { FCWithLayout } from 'components/layout';
import {
  getNationalLayout,
  NationalLayoutProps,
} from 'components/layout/NationalLayout';
import { LineChart } from 'components/tiles/index';

import Locatie from 'assets/locaties.svg';

import formatNumber from 'utils/formatNumber';

import getNlData from 'static-props/nl-data';

import siteText from 'locale';

import {
  TotalNewlyReportedLocations,
  TotalReportedLocations,
} from 'types/data';

const text: typeof siteText.verpleeghuis_besmette_locaties =
  siteText.verpleeghuis_besmette_locaties;

export function NursingHomeInfectedLocationsBarScale(props: {
  data: TotalNewlyReportedLocations;
}) {
  const { data } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={30}
      screenReaderText={text.barscale_screenreader_text}
      value={data.last_value.total_new_reported_locations}
      id="besmette_locaties_verpleeghuis"
      rangeKey="total_new_reported_locations"
      gradient={[
        {
          color: '#3391CC',
          value: 0,
        },
      ]}
    />
  );
}

const NursingHomeInfectedLocations: FCWithLayout<NationalLayoutProps> = ({
  data: state,
}) => {
  const newLocations: TotalNewlyReportedLocations =
    state.total_newly_reported_locations;
  const totalLocations: TotalReportedLocations = state.total_reported_locations;

  return (
    <>
      <ContentHeader
        category="Verpleeghuiszorg"
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

          <NursingHomeInfectedLocationsBarScale data={newLocations} />
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

      <article className="metric-article">
        <h3>{text.linechart_titel}</h3>

        {newLocations && (
          <LineChart
            values={newLocations.values.map((value) => ({
              value: value.total_new_reported_locations,
              date: value.date_of_report_unix,
            }))}
          />
        )}
      </article>
    </>
  );
};

NursingHomeInfectedLocations.getLayout = getNationalLayout();

// This function gets called at build time on server-side.
// It won't be called on client-side.
export const getStaticProps: GetStaticProps<NationalLayoutProps> = async () => {
  return getNlData();
};

export default NursingHomeInfectedLocations;
