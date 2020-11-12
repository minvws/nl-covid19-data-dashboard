import Ziektegolf from '~/assets/ziektegolf.svg';
import { AreaChart } from '~/components/charts/index';
import { ContentHeader } from '~/components/contentHeader';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { Legenda } from '~/components/legenda';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import getNlData, { INationalData } from '~/static-props/nl-data';
import { Metadata } from '~/components-styled/metadata';
import { formatNumber } from '~/utils/formatNumber';

const text = siteText.besmettelijke_personen;

const InfectiousPeople: FCWithLayout<INationalData> = (props) => {
  const { data } = props;

  const count = data.infectious_people_count;
  const infectiousPeopleLastKnownAverage =
    data.infectious_people_last_known_average;

  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <ContentHeader
        category={siteText.nationaal_layout.headings.besmettingen}
        title={text.title}
        Icon={Ziektegolf}
        subtitle={text.toelichting_pagina}
        metadata={{
          datumsText: text.datums,
          dateUnix:
            infectiousPeopleLastKnownAverage.last_value.date_of_report_unix,
          dateInsertedUnix:
            infectiousPeopleLastKnownAverage.last_value.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      {/*
        @TODO make this replace the code below. Maybe extend TwoKpiSection so that
        it renders the KPI full-width if there is only one child.

        Discuss with design. https://trello.com/c/gnDOKkZ2/780-regressie-gemiddeld-aantal-besmettelijke-mensen-per-100k

      <TwoKpiSection>
        {infectiousPeopleLastKnownAverage && (
          <KpiTile
            title={text.cijfer_titel}
            description={text.cijfer_toelichting}
            metadata={{
              date:
                infectiousPeopleLastKnownAverage.last_value.date_of_report_unix,
              source: text.bron,
            }}
          >
            <KpiValue
              absolute={
                infectiousPeopleLastKnownAverage.last_value.infectious_avg
              }
            />
          </KpiTile>
        )}
      </TwoKpiSection>

      */}

      <article className="metric-article layout-two-column">
        <div className="column-item column-item-extra-margin">
          <h3>{text.cijfer_titel}</h3>
          <p className="text-blue kpi" data-cy="infected_daily_total">
            {formatNumber(
              infectiousPeopleLastKnownAverage.last_value.infectious_avg
            )}
          </p>
          <Metadata
            date={
              infectiousPeopleLastKnownAverage.last_value.date_of_report_unix
            }
            source={text.bron}
          />
        </div>

        <div className="column-item column-item-extra-margin">
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
          <Metadata source={text.bron} />
        </article>
      )}
    </>
  );
};

InfectiousPeople.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default InfectiousPeople;
