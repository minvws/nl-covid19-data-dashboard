import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { TileList } from '~/components-styled/tile-list';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createVaccineCoverageRegionalTooltip } from '~/components/choropleth/tooltips/region/create-vaccine-coverage-regional-tooltip';
import { FCWithLayout } from '~/domain/layout/layout';
import { getNationalLayout } from '~/domain/layout/national-layout';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  getLastGeneratedDate,
  getNlData,
  getText,
} from '~/static-props/get-data';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getText,
  createGetChoroplethData({
    vr: ({ vaccine_coverage }) => ({ vaccine_coverage }),
  }),
  () => {
    const data = getNlData();

    for (const metric of Object.values(data)) {
      if (typeof metric === 'object' && metric !== null) {
        for (const [metricProperty, metricValue] of Object.entries(metric)) {
          if (metricProperty === 'values') {
            (metricValue as {
              values: Array<unknown>;
            }).values = [];
          }
        }
      }
    }

    return data;
  }
);
/**
 * @TODO Remove this page
 */
const TempVaccinePage: FCWithLayout<typeof getStaticProps> = (props) => {
  const { data, text, choropleth } = props;
  return (
    <TileList>
      <ChoroplethTile
        title={text.vaccine_coverage.choropleth.title}
        metadata={{
          date: data.tested_overall.last_value.date_unix,
          source: text.vaccine_coverage.choropleth.bronnen.rivm,
        }}
        description={text.vaccine_coverage.choropleth.description}
        legend={{
          thresholds: regionThresholds.vaccine_coverage.percentage,
          title: text.vaccine_coverage.choropleth.legend_title,
        }}
      >
        <SafetyRegionChoropleth
          data={choropleth.vr}
          metricName="vaccine_coverage"
          metricProperty="percentage"
          tooltipContent={createVaccineCoverageRegionalTooltip()}
        />
      </ChoroplethTile>
    </TileList>
  );
};

TempVaccinePage.getLayout = getNationalLayout;

export default TempVaccinePage;
