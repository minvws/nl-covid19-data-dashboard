import RioolwaterMonitoring from '~/assets/rioolwater-monitoring.svg';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { FCWithLayout } from '~/components/layout';
import { ContentHeader } from '~/components/layout/Content';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import getNlData, { INationalData } from '~/static-props/nl-data';
import { RioolwaterMetingen } from '~/types/data.d';

const text = siteText.rioolwater_metingen;

const SewerWater: FCWithLayout<INationalData> = (props) => {
  const { data: state } = props;

  const data: RioolwaterMetingen = state?.rioolwater_metingen;

  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <ContentHeader
        category={siteText.gemeente_layout.headings.overig}
        title={text.titel}
        Icon={RioolwaterMonitoring}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: data?.last_value?.week_unix,
          dateInsertedUnix: data.last_value.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      <TwoKpiSection>
        <KpiTile title={text.barscale_titel} description={text.extra_uitleg}>
          <KpiValue
            absolute={data.last_value.average}
            data-cy="infected_daily_total"
          />
        </KpiTile>
        <KpiTile
          title={text.total_installation_count_titel}
          description={text.total_installation_count_description}
        >
          <KpiValue absolute={data.last_value.total_installation_count} />
        </KpiTile>
      </TwoKpiSection>

      <LineChartTile
        title={text.linechart_titel}
        timeframeOptions={['all', '5weeks']}
        values={data.values.map((value) => ({
          value: Number(value.average),
          date: value.week_unix,
          week: { start: value.week_start_unix, end: value.week_end_unix },
        }))}
      />
    </>
  );
};

SewerWater.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default SewerWater;
