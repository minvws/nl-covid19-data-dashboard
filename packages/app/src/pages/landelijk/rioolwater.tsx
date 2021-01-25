import { useRouter } from 'next/router';
import RioolwaterMonitoring from '~/assets/rioolwater-monitoring.svg';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { createSewerRegionalTooltip } from '~/components/choropleth/tooltips/region/create-sewer-regional-tooltip';
import { SEOHead } from '~/components-styled/seo-head';
import { FCWithLayout } from '~/domain/layout/layout';
import { getNationalLayout } from '~/domain/layout/national-layout';
import siteText from '~/locale/index';
import {
  createGetChoroplethData,
  getNlData,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { createGetStaticProps } from '~/static-props/create-get-static-props';

const text = siteText.rioolwater_metingen;
const graphDescriptions = siteText.accessibility.grafieken;

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getNlData,
  createGetChoroplethData({
    vr: ({ sewer }) => ({ sewer }),
  })
);

const SewerWater: FCWithLayout<typeof getStaticProps> = ({
  data,
  choropleth,
}) => {
  const sewerAverages = data.sewer;
  const router = useRouter();

  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <TileList>
        <ContentHeader
          category={siteText.nationaal_layout.headings.vroege_signalen}
          screenReaderCategory={siteText.rioolwater_metingen.titel_sidebar}
          title={text.titel}
          icon={<RioolwaterMonitoring />}
          subtitle={text.pagina_toelichting}
          metadata={{
            datumsText: text.datums,
            dateOrRange: {
              start: sewerAverages.last_value.date_start_unix,
              end: sewerAverages.last_value.date_end_unix,
            },
            dateOfInsertionUnix:
              sewerAverages.last_value.date_of_insertion_unix,
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
                sewerAverages.last_value.date_start_unix,
                sewerAverages.last_value.date_end_unix,
              ],
              source: text.bronnen.rivm,
            }}
          >
            <KpiValue
              data-cy="sewer_average"
              absolute={sewerAverages.last_value.average}
              valueAnnotation={siteText.waarde_annotaties.riool_normalized}
              difference={data.difference.sewer__average}
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
                sewerAverages.last_value.date_start_unix,
                sewerAverages.last_value.date_end_unix,
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
          ariaDescription={graphDescriptions.rioolwater_virusdeeltjes}
          values={sewerAverages.values}
          linesConfig={[
            {
              metricProperty: 'average',
            },
          ]}
          metadata={{
            source: text.bronnen.rivm,
          }}
          valueAnnotation={siteText.waarde_annotaties.riool_normalized}
        />

        <ChoroplethTile
          title={text.map_titel}
          description={text.map_toelichting}
          metadata={{
            date: [
              sewerAverages.last_value.date_start_unix,
              sewerAverages.last_value.date_end_unix,
            ],
            source: text.bronnen.rivm,
          }}
          legend={{
            title: text.legenda_titel,
            thresholds: regionThresholds.sewer.average,
          }}
        >
          <SafetyRegionChoropleth
            data={choropleth.vr}
            metricName="sewer"
            metricProperty="average"
            tooltipContent={createSewerRegionalTooltip(
              createSelectRegionHandler(router, 'rioolwater')
            )}
            onSelect={createSelectRegionHandler(router, 'rioolwater')}
          />
        </ChoroplethTile>
      </TileList>
    </>
  );
};

SewerWater.getLayout = getNationalLayout;

export default SewerWater;
