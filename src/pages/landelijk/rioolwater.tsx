import RioolwaterMonitoring from '~/assets/rioolwater-monitoring.svg';
import { ContentHeader_weekRangeHack } from '~/components/contentHeader_weekRangeHack';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { LineChart } from '~/components/lineChart/lineChartWithWeekTooltip';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import getNlData, { INationalData } from '~/static-props/nl-data';
import { formatNumber } from '~/utils/formatNumber';

const text = siteText.rioolwater_metingen;

const SewerWater: FCWithLayout<INationalData> = ({ data }) => {
  const rioolwaterMetingen = data.rioolwater_metingen;

  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <ContentHeader_weekRangeHack
        category={siteText.gemeente_layout.headings.overig}
        title={text.titel}
        Icon={RioolwaterMonitoring}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          weekStartUnix: rioolwaterMetingen.last_value.week_start_unix,
          weekEndUnix: rioolwaterMetingen.last_value.week_end_unix,
          // weekStartUnix: 234232544,
          // weekEndUnix: 231454245,
          dateOfInsertionUnix:
            rioolwaterMetingen.last_value.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      <article className="metric-article layout-two-column">
        <div className="column-item column-item-extra-margin">
          <h3>{text.barscale_titel}</h3>
          <p className="text-blue kpi" data-cy="infected_daily_total">
            {formatNumber(rioolwaterMetingen.last_value.average)}
          </p>
        </div>

        <div className="column-item column-item-extra-margin">
          <p>{text.extra_uitleg}</p>
        </div>
      </article>

      {rioolwaterMetingen.values && (
        <article className="metric-article">
          <LineChart
            title={text.linechart_titel}
            timeframeOptions={['all', '5weeks']}
            values={rioolwaterMetingen.values.map((value) => ({
              value: Number(value.average),
              date: value.week_unix,
              week: { start: value.week_start_unix, end: value.week_end_unix },
            }))}
          />
        </article>
      )}
    </>
  );
};

SewerWater.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default SewerWater;
