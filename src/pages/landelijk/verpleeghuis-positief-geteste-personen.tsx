import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { ContentHeader } from '~/components/layout/Content';
import { LineChart } from '~/components/charts/index';

import { NursingHomeInfectedPeopleBarScale } from '~/components/landelijk/nursing-home-infected-people-barscale';

import Getest from '~/assets/test.svg';

import siteText from '~/locale/index';

import { InfectedPeopleNurseryCountDaily } from '~/types/data.d';
import getNlData, { INationalData } from '~/static-props/nl-data';

const text = siteText.verpleeghuis_positief_geteste_personen;

const NursingHomeInfectedPeople: FCWithLayout<INationalData> = (props) => {
  const { data: state } = props;

  const data: InfectedPeopleNurseryCountDaily | undefined =
    state?.infected_people_nursery_count_daily;

  return (
    <>
      <ContentHeader
        category={siteText.nationaal_layout.headings.verpleeghuis}
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

          <NursingHomeInfectedPeopleBarScale data={data} showAxis={true} />
        </div>

        <div className="column-item column-item-extra-margin">
          <p>{text.extra_uitleg}</p>
        </div>
      </article>

      {data && (
        <article className="metric-article">
          <LineChart
            title={text.linechart_titel}
            values={data.values.map((value) => ({
              value: value.infected_nursery_daily,
              date: value.date_of_report_unix,
            }))}
          />
        </article>
      )}
    </>
  );
};

NursingHomeInfectedPeople.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default NursingHomeInfectedPeople;
