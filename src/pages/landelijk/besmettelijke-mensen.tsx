import Ziektegolf from '~/assets/ziektegolf.svg';
import { AreaChart } from '~/components/charts/index';
import { FCWithLayout } from '~/components/layout';
import { ContentHeader } from '~/components/contentHeader';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { Legenda } from '~/components/legenda';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import getNlData, { INationalData } from '~/static-props/nl-data';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { Text } from '~/components-styled/typography';
import { Metadata } from '~/components-styled/metadata';

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

      <TwoKpiSection>
        <KpiTile
          title={text.cijfer_titel}
          data-cy="infected_daily_increase"
          metadata={{
            date: count?.last_value?.date_of_report_unix,
            source: text.bron,
          }}
        >
          <KpiValue
            absolute={
              infectiousPeopleLastKnownAverage?.last_value.infectious_avg
            }
          />
          <Text>{text.cijfer_toelichting}</Text>
        </KpiTile>

        <KpiTile
          title={text.barscale_titel}
          metadata={{
            date: count?.last_value?.date_of_report_unix,
            source: text.bron,
          }}
        >
          <KpiValue
            absolute={
              infectiousPeopleLastKnownNormalizedAverage?.last_value
                .infectious_avg_normalized ?? undefined
            }
          />
          <Text>{text.barscale_toelichting}</Text>
        </KpiTile>
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
          <Metadata
            date={count?.last_value?.date_of_report_unix}
            source={text.bron}
          />
        </article>
      )}
    </>
  );
};

InfectiousPeople.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default InfectiousPeople;
