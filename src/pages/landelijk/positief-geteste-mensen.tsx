import { useState, Fragment } from 'react';
import { useRouter } from 'next/router';

import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { LineChart, BarChart } from '~/components/charts/index';
import { ContentHeader } from '~/components/layout/Content';
import { ChartRegionControls } from '~/components/chartRegionControls';

import Getest from '~/assets/test.svg';
import { formatNumber } from '~/utils/formatNumber';

import { PositiveTestedPeopleBarScale } from '~/components/landelijk/positive-tested-people-barscale';

import siteText from '~/locale/index';

import {
  InfectedPeopleDeltaNormalized,
  InfectedPeopleTotal,
  IntakeShareAgeGroups,
} from '~/types/data.d';

import { positiveTestedPeopleMunicipalTooltip } from '~/components/chloropleth/tooltips/municipal/positiveTestedPeopleTooltip';
import { positiveTestedPeopleRegionTooltip } from '~/components/chloropleth/tooltips/region/positiveTestedPeopleTooltip';
import getNlData, { INationalData } from '~/static-props/nl-data';
import { MunicipalityChloropleth } from '~/components/chloropleth/MunicipalityChloropleth';
import { SafetyRegionChloropleth } from '~/components/chloropleth/SafetyRegionChloropleth';
import { MunicipalityLegenda } from '~/components/chloropleth/legenda/MunicipalityLegenda';
import { SafetyRegionLegenda } from '~/components/chloropleth/legenda/SafetyRegionLegenda';
import { createSelectMunicipalHandler } from '~/components/chloropleth/selectHandlers/createSelectMunicipalHandler';
import { createSelectRegionHandler } from '~/components/chloropleth/selectHandlers/createSelectRegionHandler';
import replaceKpisInText from '~/utils/replaceKpisInText';

const text: typeof siteText.positief_geteste_personen =
  siteText.positief_geteste_personen;
const percentageGgdText: typeof siteText.positief_geteste_personen_ggd =
  siteText.positief_geteste_personen_ggd;

const PostivelyTestedPeople: FCWithLayout<INationalData> = (props) => {
  const { data } = props;
  const [selectedMap, setSelectedMap] = useState<'municipal' | 'region'>(
    'municipal'
  );
  const router = useRouter();

  const delta: InfectedPeopleDeltaNormalized | undefined =
    data?.infected_people_delta_normalized;
  const age: IntakeShareAgeGroups | undefined = data?.intake_share_age_groups;
  const total: InfectedPeopleTotal | undefined = data?.infected_people_total;

  const percentageDataGGD = data?.infected_people_percentage?.last_value;

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
        </article>
      </div>

      <article className="metric-article layout-two-column">
        <div className="column-item column-item-extra-margin">
          <h3>{text.map_titel}</h3>
          <p>{text.map_toelichting}</p>
          <ChartRegionControls
            onChange={(val: 'region' | 'municipal') => setSelectedMap(val)}
          />
          {selectedMap === 'municipal' && (
            <MunicipalityLegenda
              metricName="positive_tested_people"
              title={text.chloropleth_legenda.titel}
            />
          )}

          {selectedMap === 'region' && (
            <SafetyRegionLegenda
              metricName="positive_tested_people"
              title={text.chloropleth_legenda.titel}
            />
          )}
        </div>

        <div
          className="column-item column-item-extra-margin"
          data-cy="chloropleths"
        >
          {selectedMap === 'municipal' && (
            <MunicipalityChloropleth
              metricName="positive_tested_people"
              tooltipContent={positiveTestedPeopleMunicipalTooltip}
              onSelect={createSelectMunicipalHandler(router)}
            />
          )}
          {selectedMap === 'region' && (
            <SafetyRegionChloropleth
              metricName="positive_tested_people"
              tooltipContent={positiveTestedPeopleRegionTooltip}
              onSelect={createSelectRegionHandler(router)}
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
          <>
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
          </>
        )}
      </article>

      {percentageDataGGD && (
        <>
          <ContentHeader
            category={'\u00A0'}
            title={percentageGgdText.titel}
            Icon={Fragment}
            subtitle={percentageGgdText.toelichting}
            metadata={{
              datumsText: percentageGgdText.datums,
              dateUnix: percentageDataGGD.date_of_report_unix,
              dateInsertedUnix: percentageDataGGD.date_of_insertion_unix,
              dataSource: percentageGgdText.bron,
            }}
          />

          <div className="layout-two-column">
            <article className="metric-article column-item">
              <h3>
                {percentageGgdText.totaal_getest_week_titel}{' '}
                <span className="text-dark-blue kpi">
                  {formatDecimal(percentageDataGGD?.total_tested_ggd)}
                </span>
              </h3>

              <p>{percentageGgdText.totaal_getest_week_uitleg}</p>
            </article>

            <article className="metric-article column-item">
              <h3>
                {percentageGgdText.positief_getest_week_titel}{' '}
                <span className="text-light-blue kpi">
                  {formatDecimal(percentageDataGGD?.infected_ggd)}
                </span>
                <span
                  className="additional-kpi"
                  dangerouslySetInnerHTML={{
                    __html: replaceKpisInText(
                      percentageGgdText.positief_getest_getest_week_uitleg,
                      [
                        {
                          name: 'percentage',
                          value: `${formatDecimal(
                            percentageDataGGD?.percentage_infected_ggd
                          )}%`,
                          className: 'text-light-blue',
                        },
                        {
                          name: 'totaal',
                          value: formatDecimal(
                            percentageDataGGD?.total_tested_ggd
                          ),
                          className: 'text-dark-blue',
                        },
                      ]
                    ),
                  }}
                ></span>
              </h3>
              <p>{percentageGgdText.positief_getest_week_uitleg}</p>
            </article>
          </div>
        </>
      )}
    </>
  );
};

PostivelyTestedPeople.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default PostivelyTestedPeople;
