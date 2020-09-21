import Link from 'next/link';

import BarScale from 'components/barScale';
import Legenda from 'components/legenda';
import { FCWithLayout } from 'components/layout';
import { getNationalLayout } from 'components/layout/NationalLayout';
import { AreaChart } from 'components/charts/index';

import Ziektegolf from 'assets/ziektegolf.svg';

import formatNumber from 'utils/formatNumber';

import siteText from 'locale';

import {
  InfectiousPeopleCount,
  InfectiousPeopleCountNormalized,
} from 'types/data.d';
import { ContentHeader } from 'components/layout/Content';
import getNlData, { INationalData } from 'static-props/nl-data';

const text: typeof siteText.besmettelijke_personen =
  siteText.besmettelijke_personen;

export function InfectiousPeopleBarScale(props: {
  data: InfectiousPeopleCountNormalized | undefined;
  showAxis: boolean;
}) {
  const { data, showAxis } = props;

  if (!data) return null;

  return (
    <BarScale
      min={0}
      max={80}
      screenReaderText={text.barscale_screenreader_text}
      value={data.last_value.infectious_avg_normalized}
      id="besmettelijk"
      rangeKey="infectious_normalized_high"
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

const InfectiousPeople: FCWithLayout<INationalData> = (props) => {
  const { data } = props;

  const count: InfectiousPeopleCount | undefined =
    data?.infectious_people_count;
  const countNormalized: InfectiousPeopleCountNormalized | undefined =
    data?.infectious_people_count_normalized;

  return (
    <>
      <ContentHeader
        category={siteText.nationaal_layout.headings.medisch}
        title={text.title}
        Icon={Ziektegolf}
        subtitle={text.toelichting_pagina}
        metadata={{
          datumsText: text.datums,
          dateUnix: count?.last_value?.date_of_report_unix,
          dataSource: text.bron,
        }}
      />

      <div className="layout-two-column">
        <article className="metric-article column-item">
          <h3>{text.barscale_titel}</h3>
          <InfectiousPeopleBarScale data={countNormalized} showAxis={true} />

          <p>
            {text.geen_signaalwaarde_beschikbaar}{' '}
            <Link href="/verantwoording">
              <a>{text.geen_signaalwaarde_beschikbaar_lees_waarom}</a>
            </Link>
          </p>
        </article>

        <article className="metric-article column-item">
          <h3>
            {text.cijfer_titel}

            {count && (
              <span className="text-blue kpi">
                {formatNumber(count.last_value.infectious_avg)}
              </span>
            )}
          </h3>

          <p>{text.cijfer_toelichting}</p>
        </article>
      </div>

      <article className="metric-article">
        <h3>{text.linechart_titel}</h3>

        {count?.values && (
          <AreaChart
            data={count.values.map((value) => ({
              avg: value.infectious_avg,
              min: value.infectious_low,
              max: value.infectious_high,
              date: value.date_of_report_unix,
            }))}
            rangeLegendLabel={text.rangeLegendLabel}
            lineLegendLabel={text.lineLegendLabel}
            timeframeOptions={['all', '5weeks']}
          />
        )}

        <Legenda>
          <li className="blue">{text.legenda_line}</li>
          <li className="gray square">{text.legenda_marge}</li>
        </Legenda>
      </article>
    </>
  );
};

InfectiousPeople.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default InfectiousPeople;
