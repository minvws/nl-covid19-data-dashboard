import { useState } from 'react';
import { useRouter } from 'next/router';

import getNlData, { INationalData } from '~/static-props/nl-data';
import siteText from '~/locale/index';
import {
  InfectedPeopleDeltaNormalized,
  NationalInfectedPeopleTotal,
  IntakeShareAgeGroups,
} from '~/types/data.d';

import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { LineChart, BarChart } from '~/components/charts/index';
import { ContentHeader } from '~/components/layout/Content';
import { ChartRegionControls } from '~/components/chartRegionControls';
import { createPositiveTestedPeopleMunicipalTooltip } from '~/components/chloropleth/tooltips/municipal/createPositiveTestedPeopleMunicipalTooltip';
import { createPositiveTestedPeopleRegionalTooltip } from '~/components/chloropleth/tooltips/region/createPositiveTestedPeopleRegionalTooltip';
import { MunicipalityChloropleth } from '~/components/chloropleth/MunicipalityChloropleth';
import { SafetyRegionChloropleth } from '~/components/chloropleth/SafetyRegionChloropleth';
import { createSelectMunicipalHandler } from '~/components/chloropleth/selectHandlers/createSelectMunicipalHandler';
import { createSelectRegionHandler } from '~/components/chloropleth/selectHandlers/createSelectRegionHandler';
import { ChloroplethLegenda } from '~/components/chloropleth/legenda/ChloroplethLegenda';
import { PositiveTestedPeopleBarScale } from '~/components/landelijk/positive-tested-people-barscale';
import { useSafetyRegionLegendaData } from '~/components/chloropleth/legenda/hooks/useSafetyRegionLegendaData';

import Getest from '~/assets/test.svg';
import Afname from '~/assets/afname.svg';

import { replaceKpisInText } from '~/utils/replaceKpisInText';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';

const text = siteText.positief_geteste_personen;
const ggdText = siteText.positief_geteste_personen_ggd;

const PositivelyTestedPeople: FCWithLayout<INationalData> = (props) => {
  const { data } = props;
  const [selectedMap, setSelectedMap] = useState<'municipal' | 'region'>(
    'municipal'
  );
  const router = useRouter();

  const legendItems = useSafetyRegionLegendaData('positive_tested_people');
  const delta: InfectedPeopleDeltaNormalized | undefined =
    data?.infected_people_delta_normalized;
  const age: IntakeShareAgeGroups | undefined = data?.intake_share_age_groups;
  const total: NationalInfectedPeopleTotal | undefined =
    data?.infected_people_total;

  const ggdData = data?.infected_people_percentage?.last_value;

  const barChartTotal: number = age?.values
    ? age.values.reduce((mem: number, part): number => {
        const amount = part.infected_per_agegroup_increase || 0;
        return mem + ((amount as number) || 0);
      }, 0)
    : 0;

  return (
    <>
      <ContentHeader
        category={siteText.nationaal_layout.headings.medisch}
        title={text.titel}
        Icon={Getest}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: delta?.last_value?.date_of_report_unix,
          dateInsertedUnix: delta?.last_value?.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      <div className="layout-two-column">
        <article
          className="metric-article column-item"
          data-cy="infected_daily_increase"
        >
          <h3>{text.barscale_titel}</h3>

          {delta && (
            <PositiveTestedPeopleBarScale data={delta} showAxis={true} />
          )}
          <p>{text.barscale_toelichting}</p>
        </article>

        <article className="metric-article column-item">
          {total && (
            <h3>
              {text.kpi_titel}{' '}
              <span className="text-blue kpi" data-cy="infected_daily_total">
                {formatNumber(total.last_value.infected_daily_total)}
              </span>
            </h3>
          )}
          <p>{text.kpi_toelichting}</p>
          {ggdData && ggdData.percentage_infected_ggd && (
            <div className="ggd-summary">
              <h4
                dangerouslySetInnerHTML={{
                  __html: replaceKpisInText(ggdText.summary_title, [
                    {
                      name: 'percentage',
                      value: `${formatPercentage(
                        ggdData.percentage_infected_ggd
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

      <article
        className="metric-article layout-chloropleth"
        data-cy="chloropleths"
      >
        <div className="chloropleth-header">
          <h3>{text.map_titel}</h3>
          <p>{text.map_toelichting}</p>
          <div className="chloropleth-controls">
            <ChartRegionControls
              onChange={(val: 'region' | 'municipal') => setSelectedMap(val)}
            />
          </div>
        </div>

        <div className="chloropleth-chart">
          {selectedMap === 'municipal' && (
            <MunicipalityChloropleth
              metricName="positive_tested_people"
              tooltipContent={createPositiveTestedPeopleMunicipalTooltip(
                router
              )}
              onSelect={createSelectMunicipalHandler(router)}
            />
          )}
          {selectedMap === 'region' && (
            <SafetyRegionChloropleth
              metricName="positive_tested_people"
              tooltipContent={createPositiveTestedPeopleRegionalTooltip(router)}
              onSelect={createSelectRegionHandler(router)}
            />
          )}
        </div>

        <div className="chloropleth-legend">
          {legendItems && (
            <ChloroplethLegenda
              items={legendItems}
              title={text.chloropleth_legenda.titel}
            />
          )}
        </div>
      </article>

      {delta && (
        <article className="metric-article">
          <LineChart
            title={text.linechart_titel}
            description={text.linechart_toelichting}
            values={delta.values.map((value) => ({
              value: value.infected_daily_increase,
              date: value.date_of_report_unix,
            }))}
            signaalwaarde={7}
          />
        </article>
      )}

      <article className="metric-article layout-two-column">
        <div className="column-item column-item-extra-margin">
          <h3>{text.barchart_titel}</h3>
          <p>{text.barchart_toelichting}</p>
        </div>
        {age && (
          <BarChart
            keys={text.barscale_keys}
            data={age.values.map((value) => ({
              y: value.infected_per_agegroup_increase || 0,
              label: value?.infected_per_agegroup_increase
                ? `${(
                    ((value.infected_per_agegroup_increase as number) * 100) /
                    barChartTotal
                  ).toFixed(0)}%`
                : false,
            }))}
            axisTitle={text.barchart_axis_titel}
          />
        )}
      </article>

      {ggdData && (
        <>
          <ContentHeader
            title={ggdText.titel}
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
                  {formatNumber(ggdData?.total_tested_ggd)}
                </span>
              </h3>

              <p>{ggdText.totaal_getest_week_uitleg}</p>
            </article>

            <article className="metric-article column-item">
              <h3>
                {ggdText.positief_getest_week_titel}{' '}
                <span className="text-blue kpi">
                  {`${formatPercentage(ggdData?.percentage_infected_ggd)}%`}
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
                          value: formatNumber(ggdData?.infected_ggd),
                          className: 'text-blue',
                        },
                        {
                          name: 'denominator',
                          value: formatNumber(ggdData?.total_tested_ggd),
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

PositivelyTestedPeople.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default PositivelyTestedPeople;
