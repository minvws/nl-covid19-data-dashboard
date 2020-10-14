import { Legenda } from '~/components/legenda';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { AreaChart } from '~/components/charts/index';

import Ziektegolf from '~/assets/ziektegolf.svg';
import { formatNumber } from '~/utils/formatNumber';

import siteText from '~/locale/index';

import { ContentHeader } from '~/components/layout/Content';
import getNlData, { INationalData } from '~/static-props/nl-data';
import { SEOHead } from '~/components/seoHead';

const text = siteText.besmettelijke_personen;

const InfectiousPeople: FCWithLayout<INationalData> = (props) => {
  const { data } = props;

  const count = data.infectious_people_count;
  const infectiousPeopleLastKnownEverage =
    data.infectious_people_last_known_average;

  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <ContentHeader
        category={siteText.nationaal_layout.headings.medisch}
        title={text.title}
        Icon={Ziektegolf}
        subtitle={text.toelichting_pagina}
        metadata={{
          datumsText: text.datums,
          dateUnix: count?.last_value?.date_of_report_unix,
          dateInsertedUnix: count?.last_value?.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      <article className="metric-article layout-two-column">
        <div className="column-item">
          <h3>
            {text.cijfer_titel}

            {count && (
              <span className="text-blue kpi">
                {formatNumber(
                  infectiousPeopleLastKnownEverage?.last_value.infectious_avg
                )}
              </span>
            )}
          </h3>
        </div>
        <div className="column-item">
          <p>{text.cijfer_toelichting}</p>
        </div>
      </article>

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
