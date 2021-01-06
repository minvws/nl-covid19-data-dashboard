import { useRouter } from 'next/router';
import Getest from '~/assets/test.svg';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Text } from '~/components-styled/typography';
import { municipalThresholds } from '~/components/choropleth/municipal-thresholds';
import { MunicipalityChoropleth } from '~/components/choropleth/municipality-choropleth';
import { createSelectMunicipalHandler } from '~/components/choropleth/select-handlers/create-select-municipal-handler';
import { createPositiveTestedPeopleMunicipalTooltip } from '~/components/choropleth/tooltips/municipal/create-positive-tested-people-municipal-tooltip';
import { SEOHead } from '~/components/seoHead';
import { FCWithLayout } from '~/domain/layout/layout';
import { getMunicipalityLayout } from '~/domain/layout/municipality-layout';
import {
  getMunicipalityData,
  getMunicipalityPaths,
  IMunicipalityData,
} from '~/static-props/municipality-data';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const PositivelyTestedPeople: FCWithLayout<IMunicipalityData> = (props) => {
  const { data, municipalityName, text: siteText } = props;

  const text = siteText.gemeente_positief_geteste_personen;
  const lastValue = data.tested_overall.last_value;

  const router = useRouter();

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
      <TileList>
        <ContentHeader
          category={siteText.gemeente_layout.headings.besmettingen}
          title={replaceVariablesInText(text.titel, {
            municipality: municipalityName,
          })}
          icon={<Getest />}
          subtitle={text.pagina_toelichting}
          metadata={{
            datumsText: text.datums,
            dateOrRange: lastValue.date_unix,
            dateOfInsertionUnix: lastValue.date_of_insertion_unix,
            dataSources: [text.bronnen.rivm],
          }}
          reference={text.reference}
        />

        <TwoKpiSection>
          <KpiTile
            title={text.kpi_titel}
            metadata={{
              date: lastValue.date_unix,
              source: text.bronnen.rivm,
            }}
          >
            <KpiValue
              data-cy="infected"
              absolute={lastValue.infected}
              difference={data.difference.tested_overall__infected}
            />
            <Text
              as="div"
              dangerouslySetInnerHTML={{ __html: text.kpi_toelichting }}
            />
          </KpiTile>

          <KpiTile
            title={text.barscale_titel}
            metadata={{
              date: lastValue.date_unix,
              source: text.bronnen.rivm,
            }}
          >
            <KpiValue
              data-cy="infected_per_100k"
              absolute={lastValue.infected_per_100k}
              difference={data.difference.tested_overall__infected_per_100k}
            />
            <Text>{text.barscale_toelichting}</Text>
          </KpiTile>
        </TwoKpiSection>

        <LineChartTile
          title={text.linechart_titel}
          description={text.linechart_toelichting}
          values={data.tested_overall.values}
          linesConfig={[
            {
              metricProperty: 'infected_per_100k',
            },
          ]}
          metadata={{
            source: text.bronnen.rivm,
          }}
        />

        <ChoroplethTile
          title={replaceVariablesInText(text.map_titel, {
            municipality: municipalityName,
          })}
          description={text.map_toelichting}
          legend={{
            thresholds: municipalThresholds.tested_overall.infected_per_100k,
            title: siteText.positief_geteste_personen.chloropleth_legenda.titel,
          }}
          metadata={{
            date: lastValue.date_unix,
            source: text.bronnen.rivm,
          }}
        >
          <MunicipalityChoropleth
            selected={data.code}
            metricName="tested_overall"
            metricProperty="infected_per_100k"
            tooltipContent={createPositiveTestedPeopleMunicipalTooltip(
              createSelectMunicipalHandler(router)
            )}
            onSelect={createSelectMunicipalHandler(router)}
          />
        </ChoroplethTile>
      </TileList>
    </>
  );
};

PositivelyTestedPeople.getLayout = getMunicipalityLayout();

export const getStaticProps = getMunicipalityData();
export const getStaticPaths = getMunicipalityPaths();

export default PositivelyTestedPeople;
