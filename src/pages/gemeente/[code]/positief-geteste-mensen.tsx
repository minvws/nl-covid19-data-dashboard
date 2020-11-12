import { useRouter } from 'next/router';
import Getest from '~/assets/test.svg';
import { ChoroplethLegenda } from '~/components-styled/choropleth-legenda';
import { useMunicipalLegendaData } from '~/components/choropleth/legenda/hooks/use-municipal-legenda-data';
import { MunicipalityChoropleth } from '~/components/choropleth/municipality-choropleth';
import { createSelectMunicipalHandler } from '~/components/choropleth/select-handlers/create-select-municipal-handler';
import { createPositiveTestedPeopleMunicipalTooltip } from '~/components/choropleth/tooltips/municipal/create-positive-tested-people-municipal-tooltip';
import { FCWithLayout } from '~/components/layout';
import { ContentHeader } from '~/components/contentHeader';
import { getMunicipalityLayout } from '~/components/layout/MunicipalityLayout';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import {
  getMunicipalityData,
  getMunicipalityPaths,
  IMunicipalityData,
} from '~/static-props/municipality-data';
import { MunicipalPositiveTestedPeople } from '~/types/data.d';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { Text } from '~/components-styled/typography';
import { Metadata } from '~/components-styled/metadata';
import { LineChartTile } from '~/components-styled/line-chart-tile';

const text = siteText.gemeente_positief_geteste_personen;

const PositivelyTestedPeople: FCWithLayout<IMunicipalityData> = (props) => {
  const { data, municipalityName } = props;
  const router = useRouter();

  const legendItems = useMunicipalLegendaData('positive_tested_people');
  const positivelyTestedPeople: MunicipalPositiveTestedPeople | undefined =
    data?.positive_tested_people;

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
        Icon={Getest}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: positivelyTestedPeople.last_value.date_of_report_unix,
          dateInsertedUnix:
            positivelyTestedPeople.last_value.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      <TwoKpiSection>
        <KpiTile
          title={text.barscale_titel}
          data-cy="infected_daily_increase"
          metadata={{
            date: positivelyTestedPeople.last_value.date_of_report_unix,
            source: text.bron,
          }}
        >
          <KpiValue
            data-cy="infected_daily_total"
            absolute={positivelyTestedPeople.last_value.infected_daily_increase}
          />
          <Text>{text.barscale_toelichting}</Text>
        </KpiTile>

        <KpiTile
          title={text.kpi_titel}
          metadata={{
            date: positivelyTestedPeople.last_value.date_of_report_unix,
            source: text.bron,
          }}
        >
          <KpiValue
            data-cy="infected_daily_total"
            absolute={positivelyTestedPeople.last_value.infected_daily_total}
          />
          <Text>{text.kpi_toelichting}</Text>
        </KpiTile>
      </TwoKpiSection>

      {positivelyTestedPeople && (
        <LineChartTile
          title={text.linechart_titel}
          description={text.linechart_toelichting}
          values={positivelyTestedPeople.values.map((value) => ({
            value: value.infected_daily_increase,
            date: value.date_of_report_unix,
          }))}
          metadata={{
            source: text.bron,
          }}
        />
      )}

      <article className="metric-article layout-choropleth">
        <div className="choropleth-header">
          <h3>
            {replaceVariablesInText(text.map_titel, {
              municipality: municipalityName,
            })}
          </h3>
          <p>{text.map_toelichting}</p>
        </div>

        <div className="choropleth-chart">
          <MunicipalityChoropleth
            selected={data.code}
            metricName="positive_tested_people"
            tooltipContent={createPositiveTestedPeopleMunicipalTooltip(router)}
            onSelect={createSelectMunicipalHandler(router)}
          />
        </div>

        <div className="choropleth-legend">
          {legendItems && (
            <ChoroplethLegenda
              items={legendItems}
              title={
                siteText.positief_geteste_personen.chloropleth_legenda.titel
              }
            />
          )}
        </div>
        <Metadata
          date={positivelyTestedPeople.last_value.date_of_report_unix}
          source={text.bron}
        />
      </article>
    </>
  );
};

PositivelyTestedPeople.getLayout = getMunicipalityLayout();

export const getStaticProps = getMunicipalityData();
export const getStaticPaths = getMunicipalityPaths();

export default PositivelyTestedPeople;
