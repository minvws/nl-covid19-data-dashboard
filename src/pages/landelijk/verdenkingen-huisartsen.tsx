import Arts from '~/assets/arts.svg';
import { FCWithLayout } from '~/components/layout';
import { ContentHeader } from '~/components/contentHeader';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { LineChartWithWeekTooltip } from '~/components/lineChart/lineChartWithWeekTooltip';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import getNlData, { INationalData } from '~/static-props/nl-data';
import { NationalHuisartsVerdenkingen } from '~/types/data.d';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { KpiValue } from '~/components-styled/kpi-value';
import { KpiTile } from '~/components-styled/kpi-tile';
import { Text } from '~/components-styled/typography';
import { ChartTileWithTimeframe } from '~/components-styled/chart-tile';

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
        category={siteText.nationaal_layout.headings.vroege_signalen}
        title={text.titel}
        Icon={Arts}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: data.last_value.week_unix,
          dateInsertedUnix: data.last_value.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      <TwoKpiSection>
        <KpiTile
          title={text.kpi_titel}
          metadata={{
            date: data.last_value.week_unix,
            source: text.bron,
          }}
        >
          <KpiValue absolute={total} />
          <Text>{text.barscale_toelichting}</Text>
        </KpiTile>
        <KpiTile
          title={text.normalized_kpi_titel}
          metadata={{
            date: data.last_value.week_unix,
            source: text.bron,
          }}
        >
          <KpiValue absolute={normalized} />
          <Text>{text.normalized_kpi_toelichting}</Text>
        </KpiTile>
      </TwoKpiSection>

      {data && (
        <ChartTileWithTimeframe
          title={text.linechart_titel}
          metadata={{ source: text.bron }}
          timeframeOptions={['all', '5weeks']}
        >
          {(timeframe) => (
            <LineChartWithWeekTooltip
              title={text.linechart_titel}
              timeframe={timeframe}
              values={data.values.map((value) => ({
                value: value.incidentie,
                date: value.week_unix,
                week: {
                  start: value.week_start_unix,
                  end: value.week_end_unix,
                },
              }))}
            />
          )}
        </ChartTileWithTimeframe>
      )}
    </>
  );
};

SuspectedPatients.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default SuspectedPatients;
