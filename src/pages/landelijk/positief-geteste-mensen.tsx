import useSWR from 'swr';

import BarScale from 'components/barScale';
import { FCWithLayout } from 'components/layout';
import { getNationalLayout } from 'components/layout/NationalLayout';
import { LineChart, BarChart } from 'components/tiles/index';
import MunicipalityMap from 'components/mapChart';
import { ContentHeader } from 'components/layout/Content';

import Getest from 'assets/test.svg';
import formatDecimal from 'utils/formatNumber';

import siteText from 'locale';

import {
  InfectedPeopleDeltaNormalized,
  InfectedPeopleTotal,
  IntakeShareAgeGroups,
} from 'types/data';

const text: typeof siteText.positief_geteste_personen =
  siteText.positief_geteste_personen;

export function PostivelyTestedPeopleBarScale(props: {
  data: InfectedPeopleDeltaNormalized | undefined;
}) {
  const { data } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={10}
      screenReaderText={text.barscale_screenreader_text}
      value={data.last_value.infected_daily_increase}
      id="positief"
      rangeKey="infected_daily_increase"
      gradient={[
        {
          color: '#3391CC',
          value: 0,
        },
      ]}
    />
  );
}

const PostivelyTestedPeople: FCWithLayout = () => {
  const { data } = useSWR(`/json/NL.json`);

  const delta: InfectedPeopleDeltaNormalized | undefined =
    data?.infected_people_delta_normalized;
  const age: IntakeShareAgeGroups | undefined = data?.intake_share_age_groups;
  const total: InfectedPeopleTotal | undefined = data?.infected_people_total;

  const barChartTotal: number = age?.values
    ? age.values.reduce((mem: number, part): number => {
        const amount = part.infected_per_agegroup_increase || 0;
        return mem + ((amount as number) || 0);
      }, 0)
    : 0;

  return (
    <>
      <ContentHeader
        category="Medische indicatoren"
        title={text.titel}
        Icon={Getest}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: delta?.last_value?.date_of_report_unix,
          dateInsertedUnix: delta?.last_value?.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      <div className="layout-two-column">
        <article className="metric-article column-item">
          <h3>{text.barscale_titel}</h3>

          {delta && <PostivelyTestedPeopleBarScale data={delta} />}
          <p>{text.barscale_toelichting}</p>
        </article>

        <article className="metric-article column-item">
          {total && (
            <h3>
              {text.kpi_titel}{' '}
              <span className="text-blue kpi">
                {formatDecimal(total.last_value.infected_daily_total)}
              </span>
            </h3>
          )}
          <p>{text.kpi_toelichting}</p>
        </article>
      </div>

      <article className="metric-article layout-two-column">
        <div className="column-item column-item-extra-margin">
          <h3>{text.map_titel}</h3>
          <p>{text.map_toelichting}</p>
        </div>

        <div className="column-item column-item-extra-margin">
          <MunicipalityMap
            metric="Total_reported"
            gradient={['#9DDEFE', '#0290D6']}
          />
        </div>
      </article>

      <article className="metric-article">
        <h3>{text.linechart_titel}</h3>
        <p>{text.linechart_toelichting}</p>
        {delta && (
          <LineChart
            values={delta.values.map((value) => ({
              value: value.infected_daily_increase,
              date: value.date_of_report_unix,
            }))}
          />
        )}
      </article>

      <article className="metric-article">
        <h3>{text.barscale_titel}</h3>
        <p>{text.barchart_toelichting}</p>
        {age && (
          <>
            <BarChart
              keys={['0 tot 20', '20 tot 40', '40 tot 60', '60 tot 80', '80+']}
              data={age.values.map((value) => ({
                y: value.infected_per_agegroup_increase || 0,
                label: value?.infected_per_agegroup_increase
                  ? `${(
                      ((value.infected_per_agegroup_increase as number) * 100) /
                      barChartTotal
                    ).toFixed(0)}%`
                  : false,
              }))}
              axisTitle={text.barchart_axis_titel}
            />
          </>
        )}
      </article>
    </>
  );
};

PostivelyTestedPeople.getLayout = getNationalLayout();

export default PostivelyTestedPeople;
