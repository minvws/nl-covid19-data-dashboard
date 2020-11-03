import RioolwaterMonitoring from '~/assets/rioolwater-monitoring.svg';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { ContentHeader_weekRangeHack } from '~/components/contentHeader_weekRangeHack';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import getNlData, { INationalData } from '~/static-props/nl-data';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';

const text = siteText.rioolwater_metingen;

const SewerWater: FCWithLayout<INationalData> = ({ data }) => {
  const sewerAverages = data.sewer;

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
          weekStartUnix: sewerAverages.last_value.week_start_unix,
          weekEndUnix: sewerAverages.last_value.week_end_unix,
          dateOfInsertionUnix: sewerAverages.last_value.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      <TwoKpiSection>
        <KpiTile title={text.barscale_titel} description={text.extra_uitleg}>
          <KpiValue
            absolute={sewerAverages.last_value.average}
            data-cy="infected_daily_total"
          />
        </KpiTile>
        <KpiTile
          title={text.total_installation_count_titel}
          description={
            text.total_installation_count_description +
            `<p style="color:#595959">${text.rwzi_abbrev}</p>`
          }
        >
          <KpiValue
            absolute={sewerAverages.last_value.total_installation_count}
          />
        </KpiTile>
      </TwoKpiSection>

      <LineChartTile
        title={text.linechart_titel}
        timeframeOptions={['all', '5weeks']}
        values={sewerAverages.values.map((value) => ({
          value: Number(value.average),
          date: value.week_unix,
          week: { start: value.week_start_unix, end: value.week_end_unix },
        }))}
        formatTooltip={(x) => {
          return `<strong>${formatDateFromSeconds(
            x.week.start,
            'short'
          )} - ${formatDateFromSeconds(
            x.week.end,
            'short'
          )}:</strong> ${formatNumber(x.value)}`;
        }}
      />
    </>
  );
};

SewerWater.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default SewerWater;
