import { getLastFilledValue } from '@corona-dashboard/common';
import Ziektegolf from '~/assets/ziektegolf.svg';
import { ChartTileWithTimeframe } from '~/components-styled/chart-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { SEOHead } from '~/components-styled/seo-head';
import { TileList } from '~/components-styled/tile-list';
import { TimeSeriesChart } from '~/components-styled/time-series-chart';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { FCWithLayout } from '~/domain/layout/layout';
import { getNationalLayout } from '~/domain/layout/national-layout';
import siteText from '~/locale/index';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import { getLastGeneratedDate, getNlData } from '~/static-props/get-data';
import { colors } from '~/style/theme';

const text = siteText.besmettelijke_personen;

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getNlData
);

const InfectiousPeople: FCWithLayout<typeof getStaticProps> = (props) => {
  const { data } = props;
  const lastFullValue = getLastFilledValue(data.infectious_people);

  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <TileList>
        <ContentHeader
          category={siteText.nationaal_layout.headings.besmettingen}
          screenReaderCategory={siteText.besmettelijke_personen.titel_sidebar}
          title={text.title}
          icon={<Ziektegolf />}
          subtitle={text.toelichting_pagina}
          metadata={{
            datumsText: text.datums,
            dateOrRange: lastFullValue.date_unix,
            dateOfInsertionUnix: lastFullValue.date_of_insertion_unix,
            dataSources: [text.bronnen.rivm],
          }}
          reference={text.reference}
        />

        <TwoKpiSection>
          <KpiTile
            title={text.cijfer_titel}
            description={text.cijfer_toelichting}
            metadata={{
              date: lastFullValue.date_unix,
              source: text.bronnen.rivm,
            }}
          >
            <KpiValue
              data-cy="estimate"
              /**
               * Somehow non-null assertion via ! was not allowed. At this point
               * we can be sure that estimate exists
               */
              absolute={lastFullValue.estimate || 0}
              difference={data.difference.infectious_people__estimate}
            />
          </KpiTile>
        </TwoKpiSection>

        <ChartTileWithTimeframe
          metadata={{ source: text.bronnen.rivm }}
          title={text.linechart_titel}
          timeframeOptions={['all', '5weeks']}
        >
          {(timeframe) => (
            <TimeSeriesChart
              timeframe={timeframe}
              title={text.linechart_titel}
              values={data.infectious_people.values}
              ariaLabelledBy=""
              seriesConfig={[
                {
                  type: 'range',
                  metricPropertyLow: 'margin_low',
                  metricPropertyHigh: 'margin_high',
                  label: text.legenda_marge,
                  shortLabel: text.rangeLegendLabel,
                  color: colors.data.margin,
                },
                {
                  type: 'line',
                  metricProperty: 'estimate',
                  label: text.legenda_line,
                  shortLabel: text.lineLegendLabel,
                  color: colors.data.primary,
                },
              ]}
            />
          )}
        </ChartTileWithTimeframe>
      </TileList>
    </>
  );
};

InfectiousPeople.getLayout = getNationalLayout;

export default InfectiousPeople;
