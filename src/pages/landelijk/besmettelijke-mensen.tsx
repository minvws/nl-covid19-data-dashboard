import Ziektegolf from '~/assets/ziektegolf.svg';
import { AreaChart } from '~/components/charts/index';
import { FCWithLayout } from '~/components/layout';
import { ContentHeader } from '~/components/layout/Content';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { Legenda } from '~/components/legenda';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import getNlData, { INationalData } from '~/static-props/nl-data';
import { formatNumber } from '~/utils/formatNumber';

const text = siteText.besmettelijke_personen;

const InfectiousPeople: FCWithLayout<INationalData> = (props) => {
  const { data } = props;

  const count = data.infectious_people_count;
  const infectiousPeopleLastKnownAverage =
    data.infectious_people_last_known_average;
  const infectiousPeopleLastKnownNormalizedAverage =
    data.infectious_people_count_normalized;

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

      <div className="layout-two-column">
        <article
          className="metric-article column-item"
          data-cy="infected_daily_increase"
        >
          <h3>
            {text.cijfer_titel}

            {count && (
              <span className="text-blue kpi">
                {formatNumber(
                  infectiousPeopleLastKnownAverage?.last_value.infectious_avg
                )}
              </span>
            )}
          </h3>
          <div className="column-item">
            <p>{text.cijfer_toelichting}</p>
          </div>
        </article>

        <article className="metric-article column-item">
          <h3>
            {text.barscale_titel}

            {count && (
              <span className="text-blue kpi">
                {formatNumber(
                  infectiousPeopleLastKnownNormalizedAverage?.last_value
                    .infectious_avg_normalized
                )}
              </span>
            )}
          </h3>
          <div className="column-item">
            <p>{text.barscale_toelichting}</p>
          </div>
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
