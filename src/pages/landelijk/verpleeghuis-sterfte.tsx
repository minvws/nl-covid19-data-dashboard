import useSWR from 'swr';

import BarScale from 'components/barScale';
import { ContentHeader } from 'components/layout/Content';
import { FCWithLayout } from 'components/layout';
import { getNationalLayout } from 'components/layout/NationalLayout';
import { LineChart } from 'components/tiles/index';

import CoronaVirus from 'assets/coronavirus.svg';

import siteText from 'locale';

import { DeceasedPeopleNurseryCountDaily } from 'types/data';

const text: typeof siteText.verpleeghuis_oversterfte =
  siteText.verpleeghuis_oversterfte;

export function NursingHomeDeathsBarScale(props: {
  data: DeceasedPeopleNurseryCountDaily | undefined;
}) {
  const { data } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={50}
      screenReaderText={text.barscale_screenreader_text}
      value={data.last_value.deceased_nursery_daily}
      id="over"
      rangeKey="deceased_nursery_daily"
      gradient={[
        {
          color: '#3391CC',
          value: 0,
        },
      ]}
    />
  );
}

const NursingHomeDeaths: FCWithLayout = () => {
  const { data: state } = useSWR(`/json/NL.json`);

  const data: DeceasedPeopleNurseryCountDaily | undefined =
    state?.deceased_people_nursery_count_daily;

  return (
    <>
      <ContentHeader
        category="Verpleeghuiszorg"
        title={text.titel}
        Icon={CoronaVirus}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: data?.last_value?.date_of_report_unix,
          dateInsertedUnix: data?.last_value?.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      <article className="metric-article layout-two-column">
        <div className="column-item column-item-extra-margin">
          <h3>{text.barscale_titel}</h3>

          <NursingHomeDeathsBarScale data={data} />
        </div>

        <div className="column-item column-item-extra-margin">
          <p>{text.extra_uitleg}</p>
        </div>
      </article>

      <article className="metric-article">
        <h3>{text.linechart_titel}</h3>

        {data && (
          <LineChart
            values={data.values.map((value) => ({
              value: value.deceased_nursery_daily,
              date: value.date_of_report_unix,
            }))}
          />
        )}
      </article>
    </>
  );
};

NursingHomeDeaths.getLayout = getNationalLayout();

export default NursingHomeDeaths;
