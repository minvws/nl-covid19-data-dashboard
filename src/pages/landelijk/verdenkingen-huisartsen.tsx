import Arts from '~/assets/arts.svg';
import { ChartTileWithTimeframe } from '~/components-styled/chart-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Text } from '~/components-styled/typography';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { LineChartWithWeekTooltip } from '~/components/lineChart/lineChartWithWeekTooltip';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import {
  getNationalStaticProps,
  NationalPageProps,
} from '~/static-props/nl-data';

const text = siteText.verdenkingen_huisartsen;

const SuspectedPatients: FCWithLayout<NationalPageProps> = (props) => {
  const { data } = props;
  const lastValue = data.verdenkingen_huisartsen.last_value;

  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <TileList>
        <ContentHeader
          category={siteText.nationaal_layout.headings.vroege_signalen}
          screenReaderCategory={siteText.verdenkingen_huisartsen.titel_sidebar}
          title={text.titel}
          icon={<Arts />}
          subtitle={text.pagina_toelichting}
          metadata={{
            datumsText: text.datums,
            dateInfo: lastValue.week_unix,
            dateOfInsertionUnix: lastValue.date_of_insertion_unix,
            dataSources: [text.bronnen.nivel],
          }}
          reference={text.reference}
        />

        <TwoKpiSection>
          <KpiTile
            title={text.kpi_titel}
            metadata={{
              date: lastValue.week_unix,
              source: text.bronnen.nivel,
            }}
          >
            <KpiValue
              absolute={lastValue.geschat_aantal}
              data-cy="geschat_aantal"
              difference={data.difference.huisarts_verdenkingen__geschat_aantal}
            />
            <Text>{text.barscale_toelichting}</Text>
          </KpiTile>
          <KpiTile
            title={text.normalized_kpi_titel}
            metadata={{
              date: lastValue.week_unix,
              source: text.bronnen.nivel,
            }}
          >
            <KpiValue
              absolute={lastValue.incidentie}
              data-cy="incidentie"
              difference={data.difference.huisarts_verdenkingen__incidentie}
            />
            <Text>{text.normalized_kpi_toelichting}</Text>
          </KpiTile>
        </TwoKpiSection>

        <ChartTileWithTimeframe
          title={text.linechart_titel}
          metadata={{ source: text.bronnen.nivel }}
          timeframeOptions={['all', '5weeks']}
        >
          {(timeframe) => (
            <LineChartWithWeekTooltip
              timeframe={timeframe}
              values={data.verdenkingen_huisartsen.values.map((value) => ({
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
      </TileList>
    </>
  );
};

SuspectedPatients.getLayout = getNationalLayout;

export const getStaticProps = getNationalStaticProps;

export default SuspectedPatients;
