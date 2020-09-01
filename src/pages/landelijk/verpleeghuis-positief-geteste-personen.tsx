import fs from 'fs';
import path from 'path';

import { GetStaticProps } from 'next';

import BarScale from 'components/barScale';
import { FCWithLayout } from 'components/layout';
import { getNationalLayout } from 'components/layout/NationalLayout';
import { ContentHeader } from 'components/layout/Content';
import { LineChart } from 'components/tiles/index';

import Getest from 'assets/test.svg';

import siteText from 'locale';

import { National, InfectedPeopleNurseryCountDaily } from 'types/data';

const text: typeof siteText.verpleeghuis_positief_geteste_personen =
  siteText.verpleeghuis_positief_geteste_personen;

export function NursingHomeInfectedPeopleBarScale(props: {
  data: InfectedPeopleNurseryCountDaily;
}) {
  const { data } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={100}
      screenReaderText={text.barscale_screenreader_text}
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

interface IProps {
  data: National;
}

const NursingHomeInfectedPeople: FCWithLayout<IProps> = ({ data: state }) => {
  const data: InfectedPeopleNurseryCountDaily =
    state.infected_people_nursery_count_daily;

  return (
    <>
      <ContentHeader
        category="Verpleeghuiszorg"
        title={text.titel}
        Icon={Getest}
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

          <NursingHomeInfectedPeopleBarScale data={data} />
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
              value: value.infected_nursery_daily,
              date: value.date_of_report_unix,
            }))}
          />
        )}
      </article>
    </>
  );
};

NursingHomeInfectedPeople.getLayout = getNationalLayout();

// This function gets called at build time on server-side.
// It won't be called on client-side.
export const getStaticProps: GetStaticProps<IProps> = async () => {
  const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');

  return {
    props: {
      data: JSON.parse(fileContents),
    },
  };
};

export default NursingHomeInfectedPeople;
