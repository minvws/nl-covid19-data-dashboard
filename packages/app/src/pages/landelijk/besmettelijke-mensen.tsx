import Ziektegolf from '~/assets/ziektegolf.svg';
import { ChartTileWithTimeframe } from '~/components-styled/chart-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { Legenda } from '~/components-styled/legenda';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { AreaChart } from '~/components/charts/index';
import { SEOHead } from '~/components/seoHead';
import { FCWithLayout } from '~/domain/layout/layout';
import { getNationalLayout } from '~/domain/layout/national-layout';
import siteText from '~/locale/index';
import { getNlData, getLastGeneratedDate } from '~/static-props/get-data';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import { getLastFilledValue } from '~/utils/get-last-filled-value';

const text = siteText.besmettelijke_personen;

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getNlData
);

const InfectiousPeople: FCWithLayout<typeof getStaticProps> = (props) => {
  const { data } = props;

  const lastFullValue = getLastFilledValue(data.infectious_people);
  const values = data.infectious_people.values;

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
          timeframeInitialValue="5weeks"
        >
          {(timeframe) => (
            <>
              <AreaChart
                timeframe={timeframe}
                data={values.map((value) => ({
                  avg: value.estimate,
                  min: value.margin_low,
                  max: value.margin_high,
                  date: value.date_unix,
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
      </TileList>
    </>
  );
};

InfectiousPeople.getLayout = getNationalLayout;

export default InfectiousPeople;
