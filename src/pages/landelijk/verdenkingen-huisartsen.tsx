import Arts from '~/assets/arts.svg';
import { FCWithLayout } from '~/components/layout';
import { ContentHeader } from '~/components/contentHeader';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { LineChart } from '~/components/lineChart/lineChartWithWeekTooltip';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import getNlData, { INationalData } from '~/static-props/nl-data';
import {
  NationalHuisartsVerdenkingen,
  NationalHuisartsVerdenkingenValue,
} from '~/types/data.d';
import { formatNumber } from '~/utils/formatNumber';

const text = siteText.verdenkingen_huisartsen;

const SuspectedPatients: FCWithLayout<INationalData> = (props) => {
  const { data: state } = props;

  const data: NationalHuisartsVerdenkingen | undefined =
    state?.verdenkingen_huisartsen;

  const total = state?.verdenkingen_huisartsen?.last_value?.geschat_aantal;
  const normalized = state?.verdenkingen_huisartsen?.last_value?.incidentie;

  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
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
          <h3>{text.kpi_titel}</h3>
          <p className="text-blue kpi">{formatNumber(total)}</p>
          <p>{text.barscale_toelichting}</p>
        </article>

        <article className="metric-article column-item">
          <h3>{text.normalized_kpi_titel}</h3>
          <p className="text-blue kpi">{formatNumber(normalized)}</p>
          <p>{text.normalized_kpi_toelichting}</p>
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
