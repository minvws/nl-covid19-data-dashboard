import useSWR from 'swr';

import BarScale from 'components/barScale';
import Metadata from 'components/metadata';
import TitleWithIcon from 'components/titleWithIcon';
import DateReported from 'components/dateReported';
import { FCWithLayout } from 'components/layout';
import { getNationalLayout } from 'components/layout/NationalLayout';
import { LineChart, BarChart } from 'components/tiles/index';

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
      screenReaderText={text.screen_reader_graph_content}
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
      <TitleWithIcon Icon={Getest} title={text.title} as="h2" />
      <article className="metric-article">
        <p>{text.text}</p>

        {delta && <PostivelyTestedPeopleBarScale data={delta} />}

        {total && (
          <h3>
            {text.metric_title}{' '}
            <span style={{ color: '#01689b' }}>
              {formatDecimal(total.last_value.infected_daily_total)}
            </span>
          </h3>
        )}

        {delta?.last_value?.infected_daily_increase !== null && (
          <DateReported
            datumsText={text.datums}
            dateUnix={delta?.last_value?.date_of_report_unix}
            dateInsertedUnix={delta?.last_value?.date_of_insertion_unix}
          />
        )}
        <h3>{text.fold_title}</h3>
        <p>{text.fold}</p>
      </article>

      <article className="metric-article">
        <h3>{text.linechart_title}</h3>
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
        <h3>{text.graph_title}</h3>
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
              axisTitle={text.graph_axis_title}
            />
            <Metadata dataSource={text.bron} />
          </>
        )}
      </article>
    </>
  );
};

PostivelyTestedPeople.getLayout = getNationalLayout();

export default PostivelyTestedPeople;
