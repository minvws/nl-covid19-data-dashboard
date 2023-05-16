import { colors, getLastFilledValue } from '@corona-dashboard/common';
import { Ziektegolf } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { ChartTile } from '~/components/chart-tile';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { WarningTile } from '~/components/warning-tile';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { useIntl } from '~/intl';
import { Languages, SiteText } from '~/locale';
import { getArticleParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { createGetContent, getLastGeneratedDate, getLokalizeTexts, selectNlData } from '~/static-props/get-data';
import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';

const selectLokalizeTexts = (siteText: SiteText) => ({
  metadataTexts: siteText.pages.topical_page.nl.nationaal_metadata,
  textNl: siteText.pages.infectious_people_page.nl,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectNlData('infectious_people'),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<PagePartQueryResult<ArticleParts>>(() => getPagePartsQuery('infectious_people_page'))(context);

    return {
      content: {
        articles: getArticleParts(content.pageParts, 'infectiousPeoplePageArticles'),
      },
    };
  }
);

const InfectiousPeople = (props: StaticProps<typeof getStaticProps>) => {
  const { pageText, selectedNlData: data, lastGenerated, content } = props;
  const { commonTexts } = useIntl();
  const { metadataTexts, textNl } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);

  const lastFullValue = getLastFilledValue(data.infectious_people);

  const metadata = {
    ...metadataTexts,
    title: textNl.metadata.title,
    description: textNl.metadata.description,
  };

  const hasActiveWarningTile = !!textNl.belangrijk_bericht;

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList>
          <PageInformationBlock
            category={commonTexts.sidebar.categories.archived_metrics.title}
            screenReaderCategory={commonTexts.sidebar.metrics.infectious_people.title}
            title={textNl.title}
            icon={<Ziektegolf aria-hidden="true" />}
            description={textNl.toelichting_pagina}
            metadata={{
              datumsText: textNl.datums,
              dateOrRange: lastFullValue.date_unix,
              dateOfInsertionUnix: lastFullValue.date_of_insertion_unix,
              dataSources: [textNl.bronnen.rivm],
            }}
            referenceLink={textNl.reference.href}
            articles={content.articles}
          />

          {hasActiveWarningTile && <WarningTile isFullWidth message={textNl.belangrijk_bericht} variant="informational" />}

          <ChartTile metadata={{ source: textNl.bronnen.rivm }} title={textNl.linechart_titel} description={textNl.linechart_description}>
            <TimeSeriesChart
              accessibility={{
                key: 'infectious_people_over_time_chart',
              }}
              tooltipTitle={textNl.linechart_titel}
              values={data.infectious_people.values}
              seriesConfig={[
                {
                  type: 'line',
                  metricProperty: 'estimate',
                  label: textNl.legenda_line,
                  shortLabel: textNl.line_legend_label,
                  color: colors.primary,
                },
                {
                  type: 'range',
                  metricPropertyLow: 'margin_low',
                  metricPropertyHigh: 'margin_high',
                  label: textNl.legenda_marge,
                  shortLabel: textNl.range_legend_label,
                  color: colors.blue2,
                },
              ]}
            />
          </ChartTile>
        </TileList>
      </NlLayout>
    </Layout>
  );
};

export default InfectiousPeople;
