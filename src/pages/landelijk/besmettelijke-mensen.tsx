import { GetStaticProps } from 'next';
import Link from 'next/link';

import BarScale from 'components/barScale';
import Legenda from 'components/legenda';
import { FCWithLayout } from 'components/layout';
import {
  getNationalLayout,
  NationalLayoutProps,
} from 'components/layout/NationalLayout';
import { AreaChart } from 'components/tiles/index';

import Ziektegolf from 'assets/ziektegolf.svg';

import formatNumber from 'utils/formatNumber';

import getNlData from 'static-props/nl-data';

import siteText from 'locale';

import {
  InfectiousPeopleCount,
  InfectiousPeopleCountNormalized,
} from 'types/data';
import { ContentHeader } from 'components/layout/Content';

const text: typeof siteText.besmettelijke_personen =
  siteText.besmettelijke_personen;

export function InfectiousPeopleBarScale(props: {
  data: InfectiousPeopleCountNormalized;
}) {
  const { data } = props;

  return (
    <BarScale
      min={0}
      max={80}
      screenReaderText={text.barscale_screenreader_text}
      value={data?.last_value?.infectious_avg_normalized}
      id="besmettelijk"
      rangeKey="infectious_normalized_high"
      gradient={[
        {
          color: '#3391CC',
          value: 0,
        },
      ]}
    />
  );
}

const InfectiousPeople: FCWithLayout<NationalLayoutProps> = ({ data }) => {
  const count: InfectiousPeopleCount = data.infectious_people_count;
  const countNormalized: InfectiousPeopleCountNormalized =
    data.infectious_people_count_normalized;

  return (
    <>
      <ContentHeader
        category="Medische indicatoren"
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
          <InfectiousPeopleBarScale data={countNormalized} />

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

// This function gets called at build time on server-side.
// It won't be called on client-side.
export const getStaticProps: GetStaticProps<NationalLayoutProps> = async () => {
  return getNlData();
};

export default InfectiousPeople;
