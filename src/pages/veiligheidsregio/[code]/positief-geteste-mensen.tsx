import { Fragment, ReactNode } from 'react';

import BarScale from 'components/barScale';
import { FCWithLayout } from 'components/layout';
import { getSafetyRegionLayout } from 'components/layout/SafetyRegionLayout';
import { LineChart } from 'components/charts/index';
import { ContentHeader } from 'components/layout/Content';

import siteText from 'locale';

import Getest from 'assets/test.svg';
import formatDecimal from 'utils/formatNumber';
import { ResultsPerRegion } from 'types/data';

import styles from 'components/vx/chloropleth.module.scss';

import {
  getSafetyRegionData,
  getSafetyRegionPaths,
  ISafetyRegionData,
} from 'static-props/safetyregion-data';
import { getLocalTitleForRegion } from 'utils/getLocalTitleForCode';
import SafetyRegionMap from 'components/vx/SafetyRegionMap';

const text: typeof siteText.veiligheidsregio_positief_geteste_personen =
  siteText.veiligheidsregio_positief_geteste_personen;

const tooltipContent = (context: any): ReactNode => {
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
  data: ResultsPerRegion | undefined;
}) {
  const { data } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={10}
      screenReaderText={text.barscale_screenreader_text}
      value={data.last_value.infected_increase_per_region}
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

const PostivelyTestedPeople: FCWithLayout<ISafetyRegionData> = (props) => {
  const { data } = props;

  const resultsPerRegion: ResultsPerRegion | undefined =
    data?.results_per_region;

  return (
    <>
      <ContentHeader
        category="Medische indicatoren"
        title={getLocalTitleForRegion(text.titel, data.code)}
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
            <PostivelyTestedPeopleBarScale data={resultsPerRegion} />
          )}
          <p>{text.barscale_toelichting}</p>
        </article>

        <article className="metric-article column-item">
          {resultsPerRegion && (
            <h3>
              {text.kpi_titel}{' '}
              <span className="text-blue kpi">
                {formatDecimal(
                  resultsPerRegion.last_value.hospital_total_counts_per_region
                )}
              </span>
            </h3>
          )}
          <p>{text.kpi_toelichting}</p>
        </article>
      </div>
      <article className="metric-article">
        <h3>{text.linechart_titel}</h3>
        <p>{text.linechart_toelichting}</p>
        {resultsPerRegion && (
          <LineChart
            values={resultsPerRegion.values.map((value) => ({
              value: value.infected_increase_per_region,
              date: value.date_of_report_unix,
            }))}
            signaalwaarde={7}
          />
        )}
      </article>
      <article className="metric-article layout-two-column">
        <div className="column-item column-item-extra-margin">
          <h3>{getLocalTitleForRegion(text.map_titel, data.code)}</h3>
          <p>{text.map_toelichting}</p>
        </div>

        <div className="column-item column-item-extra-margin">
          <SafetyRegionMap
            selected={data.code}
            metric="positive_tested_people"
            gradient={['#D2F3FF', '#005684']}
            tooltipContent={tooltipContent}
          />
        </div>
      </article>

      {resultsPerRegion?.last_value?.active_clusters && (
        <>
          <ContentHeader
            category={'\u00A0'}
            title={text.cluster_titel}
            Icon={Fragment}
            subtitle={text.cluster_toelichting}
            metadata={{
              datumsText: text.cluster_datums,
              dateUnix: resultsPerRegion.last_value.date_of_report_unix,
              dateInsertedUnix:
                resultsPerRegion.last_value.date_of_insertion_unix,
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
                value={resultsPerRegion.last_value.active_clusters}
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
                  {formatDecimal(resultsPerRegion.last_value.cluster_average)}
                </span>
              </h3>
              <p>{text.cluster_gemiddelde_toelichting}</p>
            </article>
          </div>
          <article className="metric-article">
            <h3>{text.cluster_linechart_titel}</h3>
            <p>{text.cluster_linechart_toelichting}</p>
            <LineChart
              values={resultsPerRegion?.values?.map((value) => ({
                value: value?.active_clusters,
                date: value.date_of_report_unix,
              }))}
            />
          </article>
        </>
      )}
    </>
  );
};

PostivelyTestedPeople.getLayout = getSafetyRegionLayout();

export const getStaticProps = getSafetyRegionData();
export const getStaticPaths = getSafetyRegionPaths();

export default PostivelyTestedPeople;
