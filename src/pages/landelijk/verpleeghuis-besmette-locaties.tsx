import useSWR from 'swr';

import BarScale from 'components/barScale';
import Metadata from 'components/metadata';
import TitleWithIcon from 'components/titleWithIcon';
import DateReported from 'components/dateReported';
import { FCWithLayout } from 'components/layout';
import { getNationalLayout } from 'components/layout/NationalLayout';
import { LineChart } from 'components/tiles/index';

import Locatie from 'assets/locaties.svg';

import formatNumber from 'utils/formatNumber';

import siteText from 'locale';

import {
  National,
  TotalNewlyReportedLocations,
  TotalReportedLocations,
} from 'types/data';

const text: typeof siteText.verpleeghuis_besmette_locaties =
  siteText.verpleeghuis_besmette_locaties;

export function NursingHomeInfectedLocationsBarScale(props: {
  data: TotalNewlyReportedLocations | undefined;
}) {
  const { data } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={30}
      screenReaderText={text.screen_reader_graph_content}
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

const NursingHomeInfectedLocations: FCWithLayout = () => {
  const { data: state } = useSWR<National>(`/json/NL.json`);

  const newLocations: TotalNewlyReportedLocations | undefined =
    state?.total_newly_reported_locations;
  const totalLocations: TotalReportedLocations | undefined =
    state?.total_reported_locations;

  return (
    <>
      <TitleWithIcon Icon={Locatie} title={text.title} as="h2" />
      <article className="metric-article">
        <p>{text.text}</p>

        <NursingHomeInfectedLocationsBarScale data={newLocations} />

        {newLocations?.last_value?.total_new_reported_locations !== null && (
          <DateReported
            datumsText={text.datums}
            dateInsertedUnix={newLocations?.last_value?.date_of_insertion_unix}
            dateUnix={newLocations?.last_value?.date_of_report_unix}
          />
        )}

        <h3>{text.fold_title}</h3>
        <p>{text.fold}</p>
      </article>

      <article className="metric-article">
        <h3>{text.graph_title}</h3>

        {newLocations && (
          <LineChart
            values={newLocations.values.map((value) => ({
              value: value.total_new_reported_locations,
              date: value.date_of_report_unix,
            }))}
          />
        )}

        {totalLocations && (
          <h4>
            {text.metric_title}{' '}
            <span className="text-blue">
              {formatNumber(totalLocations.last_value.total_reported_locations)}
            </span>
          </h4>
        )}
        <p>{text.metric_text}</p>

        {newLocations && <Metadata dataSource={text.bron} />}
      </article>
    </>
  );
};

NursingHomeInfectedLocations.getLayout = getNationalLayout();

export default NursingHomeInfectedLocations;
