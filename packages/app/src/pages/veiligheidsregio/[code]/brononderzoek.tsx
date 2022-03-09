import { TimeframeOption } from '@corona-dashboard/common';
import { Gedrag } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { ChartTile } from '~/components/chart-tile';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { InlineText, Text } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { VrLayout } from '~/domain/layout/vr-layout';
import { SituationsDataCoverageTile } from '~/domain/situations/situations-data-coverage-tile';
import { SituationsOverTimeChart } from '~/domain/situations/situations-over-time-chart';
import { SituationsTableTile } from '~/domain/situations/situations-table-tile';
import { useIntl } from '~/intl';
import { Languages } from '~/locale';
import {
  ElementsQueryResult,
  getElementsQuery,
  getTimelineEvents,
} from '~/queries/get-elements-query';
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
  selectVrData,
} from '~/static-props/get-data';
import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) =>
    getLokalizeTexts(
      (siteText) => ({
        textShared: siteText.pages.situationsPage.shared,
        textChoroplethTooltips: siteText.choropleth_tooltip.patients,
      }),
      locale
    ),
  getLastGeneratedDate,
  selectVrData('situations'),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<{
      parts: PagePartQueryResult<ArticleParts>;
      elements: ElementsQueryResult;
    }>((context) => {
      const { locale } = context;
      return `{
         "parts": ${getPagePartsQuery('situationsPage')},
         "elements": ${getElementsQuery('vr', ['situations'], locale)}
        }`;
    })(context);

    return {
      content: {
        articles: getArticleParts(
          content.parts.pageParts,
          'situationsPageArticles'
        ),
        elements: content.elements,
      },
    };
  }
);

export default function BrononderzoekPage(
  props: StaticProps<typeof getStaticProps>
) {
  const {
    pageText,
    selectedVrData: data,
    lastGenerated,
    content,
    vrName,
  } = props;

  const intl = useIntl();
  const { formatNumber, formatDateSpan } = intl;
  const { textShared } = pageText;

  const metadata = {
    ...intl.siteText.nationaal_metadata,
    title: textShared.metadata.title,
    description: textShared.metadata.description,
  };

  const lastValue = data.situations.last_value;
  const values = data.situations.values;

  const [date_from, date_to] = formatDateSpan(
    { seconds: lastValue.date_start_unix },
    { seconds: lastValue.date_end_unix }
  );

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <VrLayout vrName={vrName}>
        <TileList>
          <PageInformationBlock
            category={intl.siteText.nationaal_layout.headings.besmettingen}
            screenReaderCategory={
              intl.siteText.sidebar.metrics.source_investigation.title
            }
            title={replaceVariablesInText(
              intl.siteText.common.subject_in_location,
              {
                subject: textShared.titel,
                location: vrName,
              }
            )}
            icon={<Gedrag />}
            description={textShared.pagina_toelichting}
            metadata={{
              datumsText: textShared.datums,
              dateOrRange: {
                start: lastValue.date_start_unix,
                end: lastValue.date_end_unix,
              },
              dateOfInsertionUnix: lastValue.date_of_insertion_unix,
              dataSources: [textShared.bronnen.rivm],
            }}
            referenceLink={textShared.reference.href}
            articles={content.articles}
            vrNameOrGmName={vrName}
            warning={textShared.warning}
          />

          <TwoKpiSection>
            <SituationsDataCoverageTile
              data={lastValue}
              text={textShared.veiligheidsregio_dekking}
            />
            {lastValue.has_sufficient_data && (
              <KpiTile
                title={textShared.veiligheidsregio_kpi.titel}
                metadata={{
                  date: [lastValue.date_start_unix, lastValue.date_end_unix],
                  source: textShared.bronnen.rivm,
                }}
              >
                {lastValue.situations_known_percentage && (
                  <KpiValue
                    percentage={lastValue.situations_known_percentage}
                  />
                )}
                <Markdown
                  content={replaceVariablesInText(
                    textShared.veiligheidsregio_kpi.beschrijving,
                    {
                      date_to,
                      date_from,
                    }
                  )}
                />

                <Text fontWeight="bold">
                  {replaceComponentsInText(
                    textShared.veiligheidsregio_kpi.beschrijving_bekend,
                    {
                      situations_known_total: (
                        <InlineText color="data.primary">
                          {formatNumber(lastValue.situations_known_total)}
                        </InlineText>
                      ),
                      investigations_total: (
                        <InlineText color="data.primary">
                          {formatNumber(lastValue.investigations_total)}
                        </InlineText>
                      ),
                    }
                  )}
                </Text>
              </KpiTile>
            )}
          </TwoKpiSection>

          <SituationsTableTile
            data={lastValue}
            metadata={{
              date: [lastValue.date_start_unix, lastValue.date_end_unix],
              source: textShared.bronnen.rivm,
            }}
            text={textShared}
          />

          {values && (
            <ChartTile
              title={textShared.situaties_over_tijd_grafiek.titel}
              description={textShared.situaties_over_tijd_grafiek.omschrijving}
              metadata={{ source: textShared.bronnen.rivm }}
            >
              <SituationsOverTimeChart
                timeframe={TimeframeOption.ALL}
                values={values}
                timelineEvents={getTimelineEvents(
                  content.elements.timeSeries,
                  'situations'
                )}
                text={textShared}
              />
            </ChartTile>
          )}
        </TileList>
      </VrLayout>
    </Layout>
  );
}
