import useSWR from 'swr';

import BarScale from 'components/barScale';
import Metadata from 'components/metadata';
import TitleWithIcon from 'components/titleWithIcon';
import DateReported from 'components/dateReported';
import { FCWithLayout } from 'components/layout';
import { getNationalLayout } from 'components/layout/NationalLayout';
import { LineChart } from 'components/tiles/index';

import Getest from 'assets/test.svg';

import siteText from 'locale';

import { DeceasedPeopleNurseryCountDaily } from 'types/data';

const text: typeof siteText.verpleeghuis_positief_geteste_personen =
  siteText.verpleeghuis_positief_geteste_personen;

export function NursingHomeInfectedPeopleBarScale(props: {
  data: DeceasedPeopleNurseryCountDaily | undefined;
}) {
  const { data } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={100}
      screenReaderText={text.screen_reader_graph_content}
      value={data.last_value.infected_nursery_daily}
      id="positief_verpleeghuis"
      rangeKey="infected_nursery_daily"
      gradient={[
        {
          color: '#3391CC',
          value: 0,
        },
      ]}
    />
  );
}

const NursingHomeInfectedPeople: FCWithLayout = () => {
  const { data: state } = useSWR(`/json/NL.json`);

  const data: DeceasedPeopleNurseryCountDaily | undefined =
    state?.infected_people_nursery_count_daily;

  return (
    <>
      <TitleWithIcon Icon={Getest} title={text.title} as="h2" />

      <article className="metric-article">
        <p>{text.text}</p>

        <NursingHomeInfectedPeopleBarScale data={data} />

        {data?.last_value?.infected_nursery_daily !== null && (
          <DateReported
            datumsText={text.datums}
            dateInsertedUnix={data?.last_value?.date_of_insertion_unix}
            dateUnix={data?.last_value?.date_of_report_unix}
          />
        )}

        <h3>{text.fold_title}</h3>
        <p>{text.fold}</p>
      </article>

      <article className="metric-article">
        <h3>{text.graph_title}</h3>

        {data && (
          <>
            <LineChart
              values={data.values.map((value) => ({
                value: value.infected_nursery_daily,
                date: value.date_of_report_unix,
              }))}
            />
            <Metadata dataSource={text.bron} />
          </>
        )}
      </article>
    </>
  );
};

NursingHomeInfectedPeople.getLayout = getNationalLayout();

export default NursingHomeInfectedPeople;
