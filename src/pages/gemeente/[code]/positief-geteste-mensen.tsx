import { useRouter } from 'next/router';
import Getest from '~/assets/test.svg';
import { LineChart } from '~/components/charts/index';
import { ChoroplethLegenda } from '~/components/choropleth/legenda/ChoroplethLegenda';
import { useMunicipalLegendaData } from '~/components/choropleth/legenda/hooks/useMunicipalLegendaData';
import { MunicipalityChoropleth } from '~/components/choropleth/MunicipalityChoropleth';
import { createSelectMunicipalHandler } from '~/components/choropleth/selectHandlers/createSelectMunicipalHandler';
import { createPositiveTestedPeopleMunicipalTooltip } from '~/components/choropleth/tooltips/municipal/createPositiveTestedPeopleMunicipalTooltip';
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
import { PositiveTestedPeople } from '~/types/data.d';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text = siteText.gemeente_positief_geteste_personen;

const PositivelyTestedPeople: FCWithLayout<IMunicipalityData> = (props) => {
  const { data, municipalityName } = props;
  const router = useRouter();

  const legendItems = useMunicipalLegendaData('positive_tested_people');
  const positivelyTestedPeople: PositiveTestedPeople | undefined =
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
        category={siteText.gemeente_layout.headings.medisch}
        title={replaceVariablesInText(text.titel, {
          municipality: municipalityName,
        })}
        Icon={Getest}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: positivelyTestedPeople?.last_value?.date_of_report_unix,
          dateInsertedUnix:
            positivelyTestedPeople?.last_value?.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      <div className="layout-two-column">
        <article className="metric-article column-item">
          <h3>{text.barscale_titel}</h3>
          <p className="text-blue kpi" data-cy="infected_daily_total">
            {formatNumber(
              positivelyTestedPeople.last_value.infected_daily_increase
            )}
          </p>
          <p>{text.barscale_toelichting}</p>
        </article>

        <article className="metric-article column-item">
          <h3>{text.kpi_titel}</h3>
          <p className="text-blue kpi">
            {formatNumber(
              positivelyTestedPeople.last_value.infected_daily_total
            )}
          </p>
          <p>{text.kpi_toelichting}</p>
        </article>
      </div>

      {positivelyTestedPeople && (
        <article className="metric-article">
          <LineChart
            title={text.linechart_titel}
            description={text.linechart_toelichting}
            values={positivelyTestedPeople.values.map((value) => ({
              value: value.infected_daily_increase,
              date: value.date_of_report_unix,
            }))}
          />
        </article>
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
      </article>
    </>
  );
};

PositivelyTestedPeople.getLayout = getMunicipalityLayout();

export const getStaticProps = getMunicipalityData();
export const getStaticPaths = getMunicipalityPaths();

export default PositivelyTestedPeople;
