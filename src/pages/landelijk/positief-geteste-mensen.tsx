import { useState, Fragment, ReactNode } from 'react';

import BarScale from 'components/barScale';
import { FCWithLayout } from 'components/layout';
import { getNationalLayout } from 'components/layout/NationalLayout';
import { LineChart, BarChart } from 'components/charts/index';
import { ContentHeader } from 'components/layout/Content';
import ChartRegionControls from 'components/chartRegionControls';

import MunicipalityMap from 'components/vx/MunicipalityMap';
import SafetyRegionMap from 'components/vx/SafetyRegionMap';

import Getest from 'assets/test.svg';
import formatDecimal from 'utils/formatNumber';

import siteText from 'locale';
import styles from 'components/vx/chloropleth.module.scss';

import {
  InfectedPeopleDeltaNormalized,
  InfectedPeopleTotal,
  IntakeShareAgeGroups,
  InfectedPeopleClusters,
} from 'types/data';

import getNlData, { INationalData } from 'static-props/nl-data';

const text: typeof siteText.positief_geteste_personen =
  siteText.positief_geteste_personen;

const tooltipMunicipalContent = (context: any): ReactNode => {
  return (
    context && (
      <div className={styles.defaultTooltip}>
        <strong>{context.gemnaam}</strong>
        <br />
        {context.value} / 100.000
      </div>
    )
  );
};

const tooltipRegionContent = (context: any): ReactNode => {
  return (
    context && (
      <div className={styles.defaultTooltip}>
        <strong>{context.vrname}</strong>
        <br />
        {context.value} / 100.000
      </div>
    )
  );
};

export function PostivelyTestedPeopleBarScale(props: {
  data: InfectedPeopleDeltaNormalized | undefined;
}) {
  const { data } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={10}
      screenReaderText={text.barscale_screenreader_text}
      value={data.last_value.infected_daily_increase}
      id="positief"
      rangeKey="infected_daily_increase"
      gradient={[
        {
          color: '#69c253',
          value: 0,
        },
        {
          color: '#D3A500',
          value: 7,
        },
        {
          color: '#f35065',
          value: 10,
        },
      ]}
      signaalwaarde={7}
    />
  );
}

const PostivelyTestedPeople: FCWithLayout<INationalData> = (props) => {
  const { data } = props;
  const [selectedMap, setSelectedMap] = useState<'municipal' | 'region'>(
    'municipal'
  );

  const delta: InfectedPeopleDeltaNormalized | undefined =
    data?.infected_people_delta_normalized;
  const age: IntakeShareAgeGroups | undefined = data?.intake_share_age_groups;
  const total: InfectedPeopleTotal | undefined = data?.infected_people_total;

  const barChartTotal: number = age?.values
    ? age.values.reduce((mem: number, part): number => {
        const amount = part.infected_per_agegroup_increase || 0;
        return mem + ((amount as number) || 0);
      }, 0)
    : 0;

  const cluster: InfectedPeopleClusters | undefined =
    data?.infected_people_clusters;

  return (
    <>
      <ContentHeader
        category="Medische indicatoren"
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
        <article className="metric-article column-item">
          <h3>{text.barscale_titel}</h3>

          {delta && <PostivelyTestedPeopleBarScale data={delta} />}
          <p>{text.barscale_toelichting}</p>
        </article>

        <article className="metric-article column-item">
          {total && (
            <h3>
              {text.kpi_titel}{' '}
              <span className="text-blue kpi">
                {formatDecimal(total.last_value.infected_daily_total)}
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
        </div>

        <div className="column-item column-item-extra-margin">
          {selectedMap === 'municipal' && (
            <MunicipalityMap
              metric="positive_tested_people"
              gradient={['#D2F3FF', '#005684']}
              tooltipContent={tooltipMunicipalContent}
            />
          )}
          {selectedMap === 'region' && (
            <SafetyRegionMap
              metric="positive_tested_people"
              gradient={['#D2F3FF', '#005684']}
              tooltipContent={tooltipRegionContent}
            />
          )}
        </div>
      </article>

      <article className="metric-article">
        <div className="article-text">
          <h3>{text.linechart_titel}</h3>
          <p>{text.linechart_toelichting}</p>
        </div>

        {delta && (
          <LineChart
            values={delta.values.map((value) => ({
              value: value.infected_daily_increase,
              date: value.date_of_report_unix,
            }))}
            signaalwaarde={7}
          />
        )}
      </article>

      <article className="metric-article layout-two-column">
        <div className="column-item column-item-extra-margin">
          <h3>{text.barscale_titel}</h3>
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

      {cluster && (
        <>
          <ContentHeader
            category={'\u00A0'}
            title={text.cluster_titel}
            Icon={Fragment}
            subtitle={text.cluster_toelichting}
            metadata={{
              datumsText: text.cluster_datums,
              dateUnix: cluster?.last_value?.date_of_report_unix,
              dateInsertedUnix: cluster?.last_value?.date_of_insertion_unix,
              dataSource: text.cluster_bron,
            }}
          />

          <div className="layout-two-column">
            <article className="metric-article column-item">
              <h3>{text.cluster_barscale_titel}</h3>

              <BarScale
                min={0}
                max={10}
                screenReaderText={text.barscale_screenreader_text}
                value={cluster.last_value.active_clusters}
                id="positief"
                rangeKey="infected_daily_increase"
                gradient={[
                  {
                    color: '#3391CC',
                    value: 0,
                  },
                ]}
              />
              <p>{text.cluster_barscale_toelichting}</p>
            </article>

            <article className="metric-article column-item">
              <h3>
                {text.cluster_gemiddelde_titel}{' '}
                <span className="text-blue kpi">
                  {formatDecimal(cluster.last_value.cluster_average)}
                </span>
              </h3>
              <p>{text.cluster_gemiddelde_toelichting}</p>
            </article>
          </div>

          <article className="metric-article">
            <h3>{text.cluster_linechart_titel}</h3>
            <p>{text.cluster_linechart_toelichting}</p>
            <LineChart
              values={cluster.values.map((value) => ({
                value: value.active_clusters,
                date: value.date_of_report_unix,
              }))}
            />
          </article>
        </>
      )}
    </>
  );
};

PostivelyTestedPeople.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default PostivelyTestedPeople;
