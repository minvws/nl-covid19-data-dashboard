import { useRouter } from 'next/router';
import ElderlyIcon from '~/assets/elderly.svg';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Text } from '~/components-styled/typography';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { createRegionElderlyAtHomeTooltip } from '~/components/choropleth/tooltips/region/create-region-elderly-at-home-tooltip';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import {
  getNationalStaticProps,
  NationalPageProps,
} from '~/static-props/nl-data';

const text = siteText.thuiswonende_ouderen;

const ElderlyAtHomeNationalPage: FCWithLayout<NationalPageProps> = (props) => {
  const router = useRouter();
  const elderlyAtHomeData = props.data.elderly_at_home;

  return (
    <TileList>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />

      <ContentHeader
        category={siteText.nationaal_layout.headings.kwetsbare_groepen}
        screenReaderCategory={siteText.thuiswonende_ouderen.titel_sidebar}
        title={text.section_positive_tested.title}
        icon={<ElderlyIcon />}
        subtitle={text.section_positive_tested.description}
        metadata={{
          datumsText: text.section_positive_tested.datums,
          dateInfo: elderlyAtHomeData.last_value.date_of_report_unix,
          dateOfInsertionUnix:
            elderlyAtHomeData.last_value.date_of_insertion_unix,
          dataSources: [text.section_positive_tested.bronnen.rivm],
        }}
        reference={text.section_positive_tested.reference}
      />

      <TwoKpiSection>
        <KpiTile
          title={text.section_positive_tested.kpi_daily_title}
          metadata={{
            date: elderlyAtHomeData.last_value.date_of_report_unix,
            source: text.section_positive_tested.bronnen.rivm,
          }}
        >
          <KpiValue
            data-cy="positive_tested_daily"
            absolute={elderlyAtHomeData.last_value.positive_tested_daily}
          />
          <Text>{text.section_positive_tested.kpi_daily_description}</Text>
        </KpiTile>
        <KpiTile
          title={text.section_positive_tested.kpi_daily_per_100k_title}
          metadata={{
            date: elderlyAtHomeData.last_value.date_of_report_unix,
            source: text.section_positive_tested.bronnen.rivm,
          }}
        >
          <KpiValue
            data-cy="positive_tested_daily_per_100k"
            absolute={
              elderlyAtHomeData.last_value.positive_tested_daily_per_100k
            }
          />
          <Text>
            {text.section_positive_tested.kpi_daily_per_100k_description}
          </Text>
        </KpiTile>
      </TwoKpiSection>

      <LineChartTile
        timeframeOptions={['all', '5weeks']}
        title={text.section_positive_tested.line_chart_daily_title}
        values={elderlyAtHomeData.values.map((value) => ({
          value: value.positive_tested_daily,
          date: value.date_of_report_unix,
        }))}
        metadata={{ source: text.section_positive_tested.bronnen.rivm }}
      />

      <ChoroplethTile
        title={text.section_positive_tested.choropleth_daily_title}
        description={text.section_positive_tested.choropleth_daily_description}
        metadata={{
          date: elderlyAtHomeData.last_value.date_of_report_unix,
          source: text.section_positive_tested.bronnen.rivm,
        }}
        legend={{
          thresholds:
            regionThresholds.elderly_at_home.positive_tested_daily_per_100k,
          title: text.section_positive_tested.choropleth_daily_legenda,
        }}
      >
        <SafetyRegionChoropleth
          metricName="elderly_at_home"
          metricProperty="positive_tested_daily_per_100k"
          tooltipContent={createRegionElderlyAtHomeTooltip(
            createSelectRegionHandler(router, 'thuiswonende-ouderen')
          )}
          onSelect={createSelectRegionHandler(router, 'thuiswonende-ouderen')}
        />
      </ChoroplethTile>

      <ContentHeader
        title={text.section_deceased.title}
        icon={<ElderlyIcon />}
        subtitle={text.section_deceased.description}
        metadata={{
          datumsText: text.section_deceased.datums,
          dateInfo: elderlyAtHomeData.last_value.date_of_report_unix,
          dateOfInsertionUnix:
            elderlyAtHomeData.last_value.date_of_insertion_unix,
          dataSources: [text.section_deceased.bronnen.rivm],
        }}
        reference={text.section_deceased.reference}
      />

      <TwoKpiSection>
        <KpiTile
          title={text.section_deceased.kpi_daily_title}
          description={text.section_deceased.kpi_daily_description}
          metadata={{
            date: elderlyAtHomeData.last_value.date_of_report_unix,
            source: text.section_deceased.bronnen.rivm,
          }}
        >
          <KpiValue
            data-cy="deceased_daily"
            absolute={elderlyAtHomeData.last_value.deceased_daily}
          />
        </KpiTile>
      </TwoKpiSection>

      <LineChartTile
        timeframeOptions={['all', '5weeks']}
        title={text.section_deceased.line_chart_daily_title}
        values={elderlyAtHomeData.values.map((value) => ({
          value: value.deceased_daily,
          date: value.date_of_report_unix,
        }))}
        metadata={{ source: text.section_positive_tested.bronnen.rivm }}
      />
    </TileList>
  );
};

ElderlyAtHomeNationalPage.getLayout = getNationalLayout;

export const getStaticProps = getNationalStaticProps;

export default ElderlyAtHomeNationalPage;
