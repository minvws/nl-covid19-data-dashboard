import { getLastFilledValue } from '@corona-dashboard/common';
import { isEmpty } from 'lodash';
import Ziektegolf from '~/assets/ziektegolf.svg';
import { ArticleStrip } from '~/components/article-strip';
import { ArticleSummary } from '~/components/article-teaser';
import { ChartTile } from '~/components/chart-tile';
import { ContentHeader } from '~/components/content-header';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { WarningTile } from '~/components/warning-tile';
import { Layout } from '~/domain/layout/layout';
import { NationalLayout } from '~/domain/layout/national-layout';
import { useIntl } from '~/intl';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  selectNlPageMetricData,
} from '~/static-props/get-data';
import { colors } from '~/style/theme';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectNlPageMetricData(),
  createGetContent<{
    articles?: ArticleSummary[];
  }>(() => {
    const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
    return createPageArticlesQuery('infectiousPeoplePage', locale);
  })
);

const InfectiousPeople = (props: StaticProps<typeof getStaticProps>) => {
  const { selectedNlData: data, lastGenerated, content } = props;
  const { siteText } = useIntl();

  const lastFullValue = getLastFilledValue(data.infectious_people);

  const text = siteText.besmettelijke_personen;

  const metadata = {
    ...siteText.nationaal_metadata,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NationalLayout data={data} lastGenerated={lastGenerated}>
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

          {content.articles && <ArticleStrip articles={content.articles} />}

          {text.belangrijk_bericht && !isEmpty(text.belangrijk_bericht) && (
            <WarningTile
              isFullWidth
              message={text.belangrijk_bericht}
              variant="emphasis"
            />
          )}

          <ChartTile
            metadata={{ source: text.bronnen.rivm }}
            title={text.linechart_titel}
            description={text.linechart_description}
          >
            <TimeSeriesChart
              accessibility={{
                key: 'infectious_people_over_time_chart',
              }}
              tooltipTitle={text.linechart_titel}
              values={data.infectious_people.values}
              seriesConfig={[
                {
                  type: 'line',
                  metricProperty: 'estimate',
                  label: text.legenda_line,
                  shortLabel: text.lineLegendLabel,
                  color: colors.data.primary,
                },
                {
                  type: 'range',
                  metricPropertyLow: 'margin_low',
                  metricPropertyHigh: 'margin_high',
                  label: text.legenda_marge,
                  shortLabel: text.rangeLegendLabel,
                  color: colors.data.margin,
                },
              ]}
            />
          </ChartTile>
        </TileList>
      </NationalLayout>
    </Layout>
  );
};

export default InfectiousPeople;
