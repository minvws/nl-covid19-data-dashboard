import { useRouter } from 'next/router';

import Markdown from 'markdown-to-jsx';

import siteText from '~/locale/index';
import { PositiveTestedPeople } from '~/types/data.d';
import {
  getMunicipalityData,
  getMunicipalityPaths,
  IMunicipalityData,
} from '~/static-props/municipality-data';

import { MunicipalityChloropleth } from '~/components/chloropleth/MunicipalityChloropleth';
import { createPositiveTestedPeopleMunicipalTooltip } from '~/components/chloropleth/tooltips/municipal/createPositiveTestedPeopleMunicipalTooltip';
import { ChloroplethLegenda } from '~/components/chloropleth/legenda/ChloroplethLegenda';
import { useMunicipalLegendaData } from '~/components/chloropleth/legenda/hooks/useMunicipalLegendaData';
import { createSelectMunicipalHandler } from '~/components/chloropleth/selectHandlers/createSelectMunicipalHandler';
import { LineChart } from '~/components/charts/index';
import { ContentHeader } from '~/components/layout/Content';
import { PositivelyTestedPeopleBarScale } from '~/components/gemeente/positively-tested-people-barscale';
import { FCWithLayout } from '~/components/layout';
import { getMunicipalityLayout } from '~/components/layout/MunicipalityLayout';

import Getest from '~/assets/test.svg';

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

          {positivelyTestedPeople && (
            <PositivelyTestedPeopleBarScale
              data={positivelyTestedPeople}
              showAxis={true}
            />
          )}
          <p>{text.barscale_toelichting}</p>
        </article>

        <article className="metric-article column-item">
          {positivelyTestedPeople && (
            <h3>
              {text.kpi_titel}{' '}
              <span className="text-blue kpi">
                {formatNumber(
                  positivelyTestedPeople.last_value.infected_daily_total
                )}
              </span>
            </h3>
          )}
          <Markdown>{text.kpi_toelichting}</Markdown>
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

      <article className="metric-article layout-chloropleth">
        <div className="chloropleth-header">
          <h3>
            {replaceVariablesInText(text.map_titel, {
              municipality: municipalityName,
            })}
          </h3>
          <p>{text.map_toelichting}</p>
        </div>

        <div className="chloropleth-chart">
          <MunicipalityChloropleth
            selected={data.code}
            metricName="positive_tested_people"
            tooltipContent={createPositiveTestedPeopleMunicipalTooltip(router)}
            onSelect={createSelectMunicipalHandler(router)}
          />
        </div>

        <div className="chloropleth-legend">
          {legendItems && (
            <ChloroplethLegenda
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
