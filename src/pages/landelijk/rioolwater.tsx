import { useRouter } from 'next/router';
import RioolwaterMonitoring from '~/assets/rioolwater-monitoring.svg';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { createSewerRegionalTooltip } from '~/components/choropleth/tooltips/region/create-sewer-regional-tooltip';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import {
  getNationalStaticProps,
  NationalPageProps,
} from '~/static-props/nl-data';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';

const text = siteText.rioolwater_metingen;

const SewerWater: FCWithLayout<NationalPageProps> = ({ data }) => {
  const sewerAverages = data.sewer;
  const router = useRouter();

  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <ContentHeader
        category={siteText.nationaal_layout.headings.vroege_signalen}
        screenreaderCategory={siteText.rioolwater_metingen.titel_sidebar}
        title={text.titel}
        icon={<RioolwaterMonitoring />}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateInfo: {
            weekStartUnix: sewerAverages.last_value.week_start_unix,
            weekEndUnix: sewerAverages.last_value.week_end_unix,
          },
          dateOfInsertionUnix: sewerAverages.last_value.date_of_insertion_unix,
          dataSources: [text.bronnen.rivm],
        }}
        reference={text.reference}
      />

      <TwoKpiSection>
        <KpiTile
          title={text.barscale_titel}
          description={text.extra_uitleg}
          metadata={{
            date: [
              sewerAverages.last_value.week_start_unix,
              sewerAverages.last_value.week_end_unix,
            ],
            source: text.bronnen.rivm,
          }}
        >
          <KpiValue
            data-cy="sewer_average"
            absolute={sewerAverages.last_value.average}
            valueAnnotation={siteText.waarde_annotaties.riool_normalized}
          />
        </KpiTile>
        <KpiTile
          title={text.total_installation_count_titel}
          description={
            text.total_installation_count_description +
            `<p style="color:#595959">${text.rwzi_abbrev}</p>`
          }
          metadata={{
            date: [
              sewerAverages.last_value.week_start_unix,
              sewerAverages.last_value.week_end_unix,
            ],
            source: text.bronnen.rivm,
          }}
        >
          <KpiValue
            data-cy="total_installation_count"
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
        metadata={{
          source: text.bronnen.rivm,
        }}
        formatTooltip={(x) => {
          return `<strong>${formatDateFromSeconds(
            x.week.start,
            'short'
          )} - ${formatDateFromSeconds(
            x.week.end,
            'short'
          )}:</strong> ${formatNumber(x.value)}`;
        }}
        valueAnnotation={siteText.waarde_annotaties.riool_normalized}
      />

      <ChoroplethTile
        title={text.map_titel}
        description={text.map_toelichting}
        metadata={{
          date: [
            sewerAverages.last_value.week_start_unix,
            sewerAverages.last_value.week_end_unix,
          ],
          source: text.bronnen.rivm,
        }}
        legend={{
          title: text.legenda_titel,
          thresholds: regionThresholds.sewer,
        }}
      >
        <SafetyRegionChoropleth
          metricName="sewer"
          metricValueName="average"
          tooltipContent={createSewerRegionalTooltip(router)}
          onSelect={createSelectRegionHandler(router, 'rioolwater')}
        />
      </ChoroplethTile>
    </>
  );
};

SewerWater.getLayout = getNationalLayout;

export const getStaticProps = getNationalStaticProps;

export default SewerWater;
