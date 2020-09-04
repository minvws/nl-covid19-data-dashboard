import BarScale from 'components/barScale';
import { FCWithLayout } from 'components/layout';
import { getMunicipalityLayout } from 'components/layout/MunicipalityLayout';

import siteText from 'locale';

import { LineChart } from 'components/charts/index';
import { ContentHeader } from 'components/layout/Content';

import Getest from 'assets/test.svg';
import formatDecimal from 'utils/formatNumber';
import { PositiveTestedPeople, Municipal } from 'types/data';
import useSWR from 'swr';
import replaceVariablesInText from 'utils/replaceVariablesInText';

const text: typeof siteText.gemeente_positief_geteste_personen =
  siteText.gemeente_positief_geteste_personen;

export function PostivelyTestedPeopleBarScale(props: {
  data: PositiveTestedPeople | undefined;
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
  const { data } = useSWR<Municipal>(`/json/GM0014.json`);

  const positivelyTestedPeople: PositiveTestedPeople | undefined =
    data?.positive_tested_people;

  return (
    <>
      <ContentHeader
        category="Medische indicatoren"
        title={replaceVariablesInText(text.titel, {
          municipality: 'Gemeentenaam',
        })}
        Icon={Getest}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: positivelyTestedPeople?.last_value?.date_of_report_unix,
          dateInsertedUnix:
            positivelyTestedPeople?.last_value?.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      <div className="layout-two-column">
        <article className="metric-article column-item">
          <h3>{text.barscale_titel}</h3>

          {positivelyTestedPeople && (
            <PostivelyTestedPeopleBarScale data={positivelyTestedPeople} />
          )}
          <p>{text.barscale_toelichting}</p>
        </article>

        <article className="metric-article column-item">
          {positivelyTestedPeople && (
            <h3>
              {text.kpi_titel}{' '}
              <span className="text-blue kpi">
                {formatDecimal(
                  positivelyTestedPeople.last_value.infected_daily_total
                )}
              </span>
            </h3>
          )}
          <p>{text.kpi_toelichting}</p>
        </article>
      </div>

      <article className="metric-article">
        <h3>{text.linechart_titel}</h3>
        <p>{text.linechart_toelichting}</p>
        {positivelyTestedPeople && (
          <LineChart
            values={positivelyTestedPeople.values.map((value) => ({
              value: value.infected_daily_total,
              date: value.date_of_report_unix,
            }))}
          />
        )}
      </article>
    </>
  );
};

PostivelyTestedPeople.getLayout = getMunicipalityLayout();

export default PostivelyTestedPeople;
