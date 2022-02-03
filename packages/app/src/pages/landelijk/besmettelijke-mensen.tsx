import { colors, getLastFilledValue } from '@corona-dashboard/common';
import { Ziektegolf } from '@corona-dashboard/icons';
import { isEmpty } from 'lodash';
import { GetStaticPropsContext } from 'next';
import { ChartTile } from '~/components/chart-tile';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { WarningTile } from '~/components/warning-tile';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { useIntl } from '~/intl';
import { Languages } from '~/locale';
import {
  getArticleParts,
  getPagePartsQuery,
} from '~/queries/get-page-parts-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  getLokalizeTexts,
  selectNlData,
} from '~/static-props/get-data';
import { ArticleParts, PagePartQueryResult } from '~/types/cms';

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) =>
    getLokalizeTexts(
      (siteText) => ({
        textNl: siteText.pages.infectiousPeoplePage.nl,
      }),
      locale
    ),
  getLastGeneratedDate,
  selectNlData('infectious_people'),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<
      PagePartQueryResult<ArticleParts>
    >(() => getPagePartsQuery('infectiousPeoplePage'))(context);

    return {
      content: {
        articles: getArticleParts(
          content.pageParts,
          'infectiousPeoplePageArticles'
        ),
      },
    };
  }
);

const InfectiousPeople = (props: StaticProps<typeof getStaticProps>) => {
  const { pageText, selectedNlData: data, lastGenerated, content } = props;
  const { siteText } = useIntl();
  const { textNl } = pageText;

  const lastFullValue = getLastFilledValue(data.infectious_people);

  const metadata = {
    ...siteText.nationaal_metadata,
    title: textNl.metadata.title,
    description: textNl.metadata.description,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList>
          <PageInformationBlock
            category={siteText.nationaal_layout.headings.archief}
            screenReaderCategory={
              siteText.sidebar.metrics.infectious_people.title
            }
            title={textNl.title}
            icon={<Ziektegolf />}
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

          {textNl.belangrijk_bericht && !isEmpty(textNl.belangrijk_bericht) && (
            <WarningTile
              isFullWidth
              message={textNl.belangrijk_bericht}
              variant="emphasis"
            />
          )}

          <ChartTile
            metadata={{ source: textNl.bronnen.rivm }}
            title={textNl.linechart_titel}
            description={textNl.linechart_description}
          >
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
                  shortLabel: textNl.lineLegendLabel,
                  color: colors.data.primary,
                },
                {
                  type: 'range',
                  metricPropertyLow: 'margin_low',
                  metricPropertyHigh: 'margin_high',
                  label: textNl.legenda_marge,
                  shortLabel: textNl.rangeLegendLabel,
                  color: colors.data.margin,
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
