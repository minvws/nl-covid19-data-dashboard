import Ziektegolf from '~/assets/ziektegolf.svg';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { AreaChart } from '~/components/charts/index';
import { ContentHeader } from '~/components/contentHeader';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { Legenda } from '~/components/legenda';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import getNlData, { INationalData } from '~/static-props/nl-data';

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
        category={siteText.nationaal_layout.headings.medisch}
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

      <TwoKpiSection>
        {infectiousPeopleLastKnownAverage && (
          <KpiTile
            title={text.cijfer_titel}
            description={text.cijfer_toelichting}
          >
            <KpiValue
              absolute={
                infectiousPeopleLastKnownAverage.last_value.infectious_avg
              }
            />
          </KpiTile>
        )}
      </TwoKpiSection>

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
