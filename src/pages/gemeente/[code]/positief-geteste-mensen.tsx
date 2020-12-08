import Getest from '~/assets/test.svg';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Text } from '~/components-styled/typography';
import { municipalThresholds } from '~/components/choropleth/municipal-thresholds';
import { MunicipalityChoropleth } from '~/components/choropleth/municipality-choropleth';
import { createPositiveTestedPeopleMunicipalTooltip } from '~/components/choropleth/tooltips/municipal/create-positive-tested-people-municipal-tooltip';
import { FCWithLayout } from '~/components/layout';
import { getMunicipalityLayout } from '~/components/layout/MunicipalityLayout';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import {
  getMunicipalityData,
  getMunicipalityPaths,
  IMunicipalityData,
} from '~/static-props/municipality-data';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text = siteText.gemeente_positief_geteste_personen;

const PositivelyTestedPeople: FCWithLayout<IMunicipalityData> = (props) => {
  const { data, municipalityName } = props;
  const lastValue = data.positive_tested_people.last_value;

  return (
    <>
      <SEOHead
        title={replaceVariablesInText(text.metadata.title, {
          municipalityName,
        })}
        description={replaceVariablesInText(text.metadata.description, {
          municipalityName,
        })}
      />
      <ContentHeader
        category={siteText.gemeente_layout.headings.besmettingen}
        title={replaceVariablesInText(text.titel, {
          municipality: municipalityName,
        })}
        icon={<Getest />}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateInfo: lastValue.date_of_report_unix,
          dateOfInsertionUnix: lastValue.date_of_insertion_unix,
          dataSources: [text.bronnen.rivm],
        }}
        reference={text.reference}
      />

      <TwoKpiSection>
        <KpiTile
          title={text.barscale_titel}
          metadata={{
            date: lastValue.date_of_report_unix,
            source: text.bronnen.rivm,
          }}
        >
          <KpiValue
            data-cy="infected_daily_increase"
            absolute={lastValue.infected_daily_increase}
            difference={
              data.difference.positive_tested_people__infected_daily_increase
            }
          />
          <Text>{text.barscale_toelichting}</Text>
        </KpiTile>

        <KpiTile
          title={text.kpi_titel}
          metadata={{
            date: lastValue.date_of_report_unix,
            source: text.bronnen.rivm,
          }}
        >
          <KpiValue
            data-cy="infected_daily_total"
            absolute={lastValue.infected_daily_total}
            difference={
              data.difference.positive_tested_people__infected_daily_total
            }
          />
          <Text>{text.kpi_toelichting}</Text>
        </KpiTile>
      </TwoKpiSection>

      {data.positive_tested_people && (
        <LineChartTile
          title={text.linechart_titel}
          description={text.linechart_toelichting}
          values={data.positive_tested_people.values.map((value) => ({
            value: value.infected_daily_increase,
            date: value.date_of_report_unix,
          }))}
          metadata={{
            source: text.bronnen.rivm,
          }}
        />
      )}

      <ChoroplethTile
        title={replaceVariablesInText(text.map_titel, {
          municipality: municipalityName,
        })}
        description={text.map_toelichting}
        legend={{
          thresholds:
            municipalThresholds.positive_tested_people.positive_tested_people,
          title: siteText.positief_geteste_personen.chloropleth_legenda.titel,
        }}
        metadata={{
          date: lastValue.date_of_report_unix,
          source: text.bronnen.rivm,
        }}
      >
        <MunicipalityChoropleth
          selected={data.code}
          metricName="positive_tested_people"
          metricProperty="positive_tested_people"
          tooltipContent={createPositiveTestedPeopleMunicipalTooltip()}
        />
      </ChoroplethTile>
    </>
  );
};

PositivelyTestedPeople.getLayout = getMunicipalityLayout();

export const getStaticProps = getMunicipalityData();
export const getStaticPaths = getMunicipalityPaths();

export default PositivelyTestedPeople;
