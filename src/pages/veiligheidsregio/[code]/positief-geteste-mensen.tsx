import { useRouter } from 'next/router';

import siteText from '~/locale/index';
import { ResultsPerRegion } from '~/types/data.d';
import {
  getSafetyRegionData,
  getSafetyRegionPaths,
  ISafetyRegionData,
} from '~/static-props/safetyregion-data';
import regionCodeToMunicipalCodeLookup from '~/data/regionCodeToMunicipalCodeLookup';

import { FCWithLayout } from '~/components/layout';
import { getSafetyRegionLayout } from '~/components/layout/SafetyRegionLayout';
import { LineChart } from '~/components/charts/index';
import { ContentHeader } from '~/components/layout/Content';
import { PositivelyTestedPeopleBarScale } from '~/components/veiligheidsregio/positive-tested-people-barscale';
import { createPositiveTestedPeopleMunicipalTooltip } from '~/components/chloropleth/tooltips/municipal/createPositiveTestedPeopleMunicipalTooltip';
import { ChloroplethLegenda } from '~/components/chloropleth/legenda/ChloroplethLegenda';
import { MunicipalityChloropleth } from '~/components/chloropleth/MunicipalityChloropleth';
import { createSelectMunicipalHandler } from '~/components/chloropleth/selectHandlers/createSelectMunicipalHandler';
import { useSafetyRegionLegendaData } from '~/components/chloropleth/legenda/hooks/useSafetyRegionLegendaData';

import { formatNumber } from '~/utils/formatNumber';

import Getest from '~/assets/test.svg';
import Afname from '~/assets/afname.svg';
import { replaceKpisInText } from '~/utils/replaceKpisInText';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text = siteText.veiligheidsregio_positief_geteste_personen;
const ggdText = siteText.veiligheidsregio_positief_geteste_personen_ggd;

const PostivelyTestedPeople: FCWithLayout<ISafetyRegionData> = (props) => {
  const { data, safetyRegionName } = props;
  const router = useRouter();

  const resultsPerRegion: ResultsPerRegion | undefined =
    data?.results_per_region;

  const ggdData = data?.ggd?.last_value;

  const legendItems = useSafetyRegionLegendaData('positive_tested_people');
  const municipalCodes = regionCodeToMunicipalCodeLookup[data.code];
  const selectedMunicipalCode = municipalCodes ? municipalCodes[0] : undefined;

  return (
    <>
      <ContentHeader
        category={siteText.veiligheidsregio_layout.headings.medisch}
        title={replaceVariablesInText(text.titel, {
          safetyRegion: safetyRegionName,
        })}
        Icon={Getest}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: resultsPerRegion?.last_value?.date_of_report_unix,
          dateInsertedUnix:
            resultsPerRegion?.last_value?.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />
      <div className="layout-two-column">
        <article className="metric-article column-item">
          <h3>{text.barscale_titel}</h3>

          {resultsPerRegion && (
            <PositivelyTestedPeopleBarScale
              data={resultsPerRegion}
              showAxis={true}
            />
          )}
          <p>{text.barscale_toelichting}</p>
        </article>

        <article className="metric-article column-item">
          {resultsPerRegion && (
            <h3>
              {text.kpi_titel}{' '}
              <span className="text-blue kpi">
                {formatNumber(
                  Math.round(
                    resultsPerRegion.last_value
                      .total_reported_increase_per_region
                  )
                )}
              </span>
            </h3>
          )}
          <p>{text.kpi_toelichting}</p>
          {ggdData && ggdData.infected_percentage_daily && (
            <div className="ggd-summary">
              <h4
                dangerouslySetInnerHTML={{
                  __html: replaceKpisInText(ggdText.summary_title, [
                    {
                      name: 'percentage',
                      value: `${formatNumber(
                        ggdData.infected_percentage_daily
                      )}%`,
                      className: 'text-blue',
                    },
                  ]),
                }}
              ></h4>
              <p>
                <a href="#ggd">{ggdText.summary_link_cta}</a>
              </p>
            </div>
          )}
        </article>
      </div>
      {resultsPerRegion && (
        <article className="metric-article">
          <LineChart
            title={text.linechart_titel}
            description={text.linechart_toelichting}
            values={resultsPerRegion.values.map((value) => ({
              value: value.infected_increase_per_region,
              date: value.date_of_report_unix,
            }))}
            signaalwaarde={7}
          />
        </article>
      )}
      <article className="metric-article layout-chloropleth">
        <div className="chloropleth-header">
          <h3>
            {replaceVariablesInText(text.map_titel, {
              safetyRegion: safetyRegionName,
            })}
          </h3>
          <p>{text.map_toelichting}</p>
        </div>

        <div className="chloropleth-chart">
          <MunicipalityChloropleth
            selected={selectedMunicipalCode}
            highlightSelection={false}
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

      {ggdData && (
        <>
          <ContentHeader
            title={replaceVariablesInText(ggdText.titel, {
              safetyRegion: safetyRegionName,
            })}
            id="ggd"
            Icon={Afname}
            subtitle={ggdText.toelichting}
            metadata={{
              datumsText: ggdText.datums,
              dateUnix: ggdData.date_of_report_unix,
              dateInsertedUnix: ggdData.date_of_insertion_unix,
              dataSource: ggdText.bron,
            }}
          />

          <div className="layout-two-column">
            <article className="metric-article column-item">
              <h3>
                {ggdText.totaal_getest_week_titel}{' '}
                <span className="text-blue kpi">
                  {formatNumber(ggdData.infected_daily)}
                </span>
              </h3>

              <p>{ggdText.totaal_getest_week_uitleg}</p>
            </article>

            <article className="metric-article column-item">
              <h3>
                {ggdText.positief_getest_week_titel}{' '}
                <span className="text-blue kpi">
                  {`${formatNumber(ggdData.infected_percentage_daily)}%`}
                </span>
              </h3>
              <p>{ggdText.positief_getest_week_uitleg}</p>
              <p>
                <strong
                  className="additional-kpi"
                  dangerouslySetInnerHTML={{
                    __html: replaceKpisInText(
                      ggdText.positief_getest_getest_week_uitleg,
                      [
                        {
                          name: 'numerator',
                          value: formatNumber(ggdData.infected_daily),
                          className: 'text-blue',
                        },
                        {
                          name: 'denominator',
                          value: formatNumber(ggdData.tested_total_daily),
                          className: 'text-blue',
                        },
                      ]
                    ),
                  }}
                ></strong>
              </p>
            </article>
          </div>
        </>
      )}
    </>
  );
};

PostivelyTestedPeople.getLayout = getSafetyRegionLayout();

export const getStaticProps = getSafetyRegionData();
export const getStaticPaths = getSafetyRegionPaths();

export default PostivelyTestedPeople;
