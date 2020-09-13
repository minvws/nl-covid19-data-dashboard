import BarScale from 'components/barScale';
import { FCWithLayout } from 'components/layout';
import { getMunicipalityLayout } from 'components/layout/MunicipalityLayout';

import siteText from 'locale';

import { LineChart } from 'components/charts/index';
import { ContentHeader } from 'components/layout/Content';

import Getest from 'assets/test.svg';
import formatDecimal from 'utils/formatNumber';
import { PositiveTestedPeople } from 'types/data';
import {
  getMunicipalityData,
  getMunicipalityPaths,
  IMunicipalityData,
} from 'static-props/municipality-data';
import { getLocalTitleForMuncipality } from 'utils/getLocalTitleForCode';
import { ReactNode } from 'react';

import styles from 'components/chloropleth/chloropleth.module.scss';
import MunicipalityChloropleth from 'components/chloropleth/MunicipalityChloropleth';
import { MunicipalityProperties } from 'components/chloropleth/shared';

const text: typeof siteText.gemeente_positief_geteste_personen =
  siteText.gemeente_positief_geteste_personen;

const tooltipContent = (
  context: MunicipalityProperties & { value: number }
): ReactNode => {
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

export function PostivelyTestedPeopleBarScale(props: {
  data: PositiveTestedPeople | undefined;
  showAxis: boolean;
}) {
  const { data, showAxis } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={10}
      screenReaderText={text.screen_reader_graph_content}
      value={data.last_value.infected_daily_increase}
      id="positief"
      rangeKey="infected_daily_increase"
      gradient={[
        {
          color: '#3391CC',
          value: 0,
        },
      ]}
      showAxis={showAxis}
    />
  );
}

const PostivelyTestedPeople: FCWithLayout<IMunicipalityData> = (props) => {
  const { data } = props;

  const positivelyTestedPeople: PositiveTestedPeople | undefined =
    data?.positive_tested_people;

  return (
    <>
      <ContentHeader
        category="Medische indicatoren"
        title={getLocalTitleForMuncipality(text.titel, data.code)}
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
            <PostivelyTestedPeopleBarScale
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
                {formatDecimal(
                  positivelyTestedPeople.last_value.infected_daily_total
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
        {positivelyTestedPeople && (
          <LineChart
            values={positivelyTestedPeople.values.map((value) => ({
              value: value.infected_daily_total,
              date: value.date_of_report_unix,
            }))}
          />
        )}
      </article>

      <article className="metric-article layout-two-column">
        <div className="column-item column-item-extra-margin">
          <h3>{getLocalTitleForMuncipality(text.map_titel, data.code)}</h3>
          <p>{text.map_toelichting}</p>
        </div>

        <div className="column-item column-item-extra-margin">
          <MunicipalityChloropleth
            selected={data.code}
            metricName="positive_tested_people"
            gradient={['#D2F3FF', '#005684']}
            tooltipContent={tooltipContent}
          />
        </div>
      </article>
    </>
  );
};

PostivelyTestedPeople.getLayout = getMunicipalityLayout();

export const getStaticProps = getMunicipalityData();
export const getStaticPaths = getMunicipalityPaths();

export default PostivelyTestedPeople;
