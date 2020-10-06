import siteText from '~/locale/index';
import {
  NationalHuisartsVerdenkingen,
  NationalHuisartsVerdenkingenValue,
} from '~/types/data.d';
import getNlData, { INationalData } from '~/static-props/nl-data';

import { ContentHeader } from '~/components/layout/Content';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { LineChart } from '~/components/lineChart/lineChartWithWeekTooltip';
import { SuspectedPatientsBarScale } from '~/components/landelijk/suspected-patients-barscale';

import Arts from '~/assets/arts.svg';
import { formatNumber } from '~/utils/formatNumber';

const text = siteText.verdenkingen_huisartsen;

const SuspectedPatients: FCWithLayout<INationalData> = (props) => {
  const { data: state } = props;

  const data: NationalHuisartsVerdenkingen | undefined =
    state?.verdenkingen_huisartsen;

  const total = state?.verdenkingen_huisartsen?.last_value?.geschat_aantal;

  return (
    <>
      <ContentHeader
        category={siteText.gemeente_layout.headings.overig}
        title={text.titel}
        Icon={Arts}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: data?.last_value?.week_unix,
          dateInsertedUnix: data?.last_value?.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      <div className="layout-two-column">
        <article className="metric-article column-item">
          <h3>{text.barscale_titel}</h3>

          <SuspectedPatientsBarScale data={data} showAxis={true} />
          <p>{text.barscale_toelichting}</p>
        </article>

        <article className="metric-article column-item">
          {total && (
            <h3>
              {text.kpi_titel}{' '}
              <span className="text-blue kpi">{formatNumber(total)}</span>
            </h3>
          )}
          <p>{text.kpi_toelichting}</p>
        </article>
      </div>

      {data && (
        <article className="metric-article">
          <LineChart
            title={text.linechart_titel}
            timeframeOptions={['all', '5weeks']}
            values={data.values.map(
              (value: NationalHuisartsVerdenkingenValue) => ({
                value: value.incidentie,
                date: value.week_unix,
                week: {
                  start: value.week_start_unix,
                  end: value.week_end_unix,
                },
              })
            )}
          />
        </article>
      )}
    </>
  );
};

SuspectedPatients.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default SuspectedPatients;
