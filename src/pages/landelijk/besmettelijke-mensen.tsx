import Ziektegolf from '~/assets/ziektegolf.svg';
import { ChartTileWithTimeframe } from '~/components-styled/chart-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { Legenda } from '~/components-styled/legenda';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { AreaChart } from '~/components/charts/index';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import {
  getNationalStaticProps,
  NationalPageProps,
} from '~/static-props/nl-data';

const text = siteText.besmettelijke_personen;

const InfectiousPeople: FCWithLayout<NationalPageProps> = (props) => {
  const { data } = props;

  const count = data.infectious_people_count;
  const infectiousPeopleLastKnownAverage =
    data.infectious_people_last_known_average;

  return (
    <TileList>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <ContentHeader
        category={siteText.nationaal_layout.headings.besmettingen}
        screenReaderCategory={siteText.besmettelijke_personen.titel_sidebar}
        title={text.title}
        icon={<Ziektegolf />}
        subtitle={text.toelichting_pagina}
        metadata={{
          datumsText: text.datums,
          dateInfo:
            infectiousPeopleLastKnownAverage.last_value.date_of_report_unix,
          dateOfInsertionUnix:
            infectiousPeopleLastKnownAverage.last_value.date_of_insertion_unix,
          dataSources: [text.bronnen.rivm],
        }}
        reference={text.reference}
      />

      <TwoKpiSection>
        <KpiTile
          title={text.cijfer_titel}
          description={text.cijfer_toelichting}
          metadata={{
            date:
              infectiousPeopleLastKnownAverage.last_value.date_of_report_unix,
            source: text.bronnen.rivm,
          }}
        >
          <KpiValue
            data-cy="infectious_avg"
            absolute={
              infectiousPeopleLastKnownAverage.last_value.infectious_avg
            }
          />
        </KpiTile>
      </TwoKpiSection>

      {count?.values && (
        <ChartTileWithTimeframe
          metadata={{ source: text.bronnen.rivm }}
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
    </TileList>
  );
};

InfectiousPeople.getLayout = getNationalLayout;

export const getStaticProps = getNationalStaticProps;

export default InfectiousPeople;
