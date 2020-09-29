import Link from 'next/link';

import { Legenda } from '~/components/legenda';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { AreaChart } from '~/components/charts/index';

import { InfectiousPeopleBarScale } from '~/components/landelijk/infectious-people-barscale';

import Ziektegolf from '~/assets/ziektegolf.svg';
import { formatNumber } from '~/utils/formatNumber';

import siteText from '~/locale/index';

import {
  InfectiousPeopleCount,
  InfectiousPeopleCountNormalized,
} from '~/types/data.d';
import { ContentHeader } from '~/components/layout/Content';
import getNlData, { INationalData } from '~/static-props/nl-data';

const text: typeof siteText.besmettelijke_personen =
  siteText.besmettelijke_personen;

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

      {count?.values && (
        <article className="metric-article">
          <AreaChart
            title={text.linechart_titel}
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
          <Legenda>
            <li className="blue">{text.legenda_line}</li>
            <li className="gray square">{text.legenda_marge}</li>
          </Legenda>
        </article>
      )}
    </>
  );
};

InfectiousPeople.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default InfectiousPeople;
