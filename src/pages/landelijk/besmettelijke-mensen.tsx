import Ziektegolf from '~/assets/ziektegolf.svg';
import { ChartTileWithTimeframe } from '~/components-styled/chart-tile';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { AreaChart } from '~/components/charts/index';
import { ContentHeader } from '~/components/contentHeader';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { Legenda } from '~/components-styled/legenda';
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

      <TwoKpiSection>
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
      </TwoKpiSection>

      {count?.values && (
        <ChartTileWithTimeframe
          metadata={{ source: text.bron }}
          title={text.linechart_titel}
          timeframeOptions={['all', '5weeks']}
          timeframeInitialValue="5weeks"
        >
          {(timeframe) => (
            <>
              <AreaChart
                timeframe={timeframe}
                data={count.values.map((value) => ({
                  avg: value.infectious_avg,
                  min: value.infectious_low,
                  max: value.infectious_high,
                  date: value.date_of_report_unix,
                }))}
                rangeLegendLabel={text.rangeLegendLabel}
                lineLegendLabel={text.lineLegendLabel}
              />
              <Legenda
                items={[
                  {
                    label: text.legenda_line,
                    color: 'data.primary',
                    shape: 'line',
                  },
                  {
                    label: text.legenda_marge,
                    color: 'data.fill',
                    shape: 'square',
                  },
                ]}
              />
            </>
          )}
        </ChartTileWithTimeframe>
      )}
    </>
  );
};

InfectiousPeople.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default InfectiousPeople;
