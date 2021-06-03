import { assert } from '@corona-dashboard/common';
import GatheringsIcon from '~/assets/situations/gatherings.svg';
import { ArticleStrip } from '~/components/article-strip';
import { ArticleSummary } from '~/components/article-teaser';
import { ContentHeader } from '~/components/content-header';
import { TileList } from '~/components/tile-list';
import { Layout } from '~/domain/layout/layout';
import { SafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import { useIntl } from '~/intl';
import { withFeatureNotFoundPage } from '~/lib/features';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { KpiTile } from '~/components/kpi-tile';
import { Tile } from '~/components/tile';
import { KpiValue } from '~/components/kpi-value';
import { Text, InlineText } from '~/components/typography';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  selectVrPageMetricData,
} from '~/static-props/get-data';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = withFeatureNotFoundPage(
  'situationsPage',
  createGetStaticProps(
    getLastGeneratedDate,
    selectVrPageMetricData('situations'),
    createGetContent<{
      articles?: ArticleSummary[];
    }>((_context) => {
      const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
      return createPageArticlesQuery('situationsPage', locale);
    })
  )
);

export default function BrononderzoekPage(
  props: StaticProps<typeof getStaticProps>
) {
  const {
    selectedVrData: data,
    lastGenerated,
    content,
    safetyRegionName,
  } = props;

  const intl = useIntl();
  const { formatNumber, formatDateFromSeconds, siteText } = intl;

  const text = intl.siteText.brononderzoek;

  const metadata = {
    ...intl.siteText.nationaal_metadata,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  const has_sufficient_data = true;

  assert(data.situations, 'no situations data found');

  const singleValue = data.situations.last_value;

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <SafetyRegionLayout
        data={data}
        safetyRegionName={safetyRegionName}
        lastGenerated={lastGenerated}
      >
        <TileList>
          <ContentHeader
            category={intl.siteText.nationaal_layout.headings.besmettingen}
            screenReaderCategory={
              intl.siteText.positief_geteste_personen.titel_sidebar
            }
            title={replaceVariablesInText(
              intl.siteText.common.subject_in_location,
              {
                subject: text.titel,
                location: safetyRegionName,
              }
            )}
            icon={<GatheringsIcon />}
            subtitle={text.pagina_toelichting}
            metadata={{
              datumsText: text.datums,
              dateOrRange: {
                start: singleValue.date_start_unix,
                end: singleValue.date_end_unix,
              },
              dateOfInsertionUnix: singleValue.date_of_insertion_unix,
              dataSources: [text.bronnen.rivm],
            }}
          />

          <ArticleStrip articles={content.articles} />

          <TwoKpiSection>
            <Tile>Tile</Tile>
            {has_sufficient_data ? (
              <KpiTile
                title={siteText.vr_brononderzoek.kpi_result.title}
                metadata={{
                  date: 1622644588, // situations_known_percentage
                  source: text.bronnen.rivm,
                }}
              >
                <KpiValue data-cy="covid_total" percentage={68.2} />
                <Text>
                  {replaceComponentsInText(
                    siteText.vr_brononderzoek.kpi_result.description,
                    {
                      date_start_unix: (
                        <InlineText>
                          {formatDateFromSeconds(1622644588)}
                        </InlineText>
                      ),
                      date_end_unix: (
                        <InlineText>
                          {formatDateFromSeconds(1622644588)}
                        </InlineText>
                      ),
                    }
                  )}
                </Text>
                <Text fontWeight="bold">
                  {replaceComponentsInText(
                    siteText.vr_brononderzoek.kpi_result.description_known,
                    {
                      situations_known_total: (
                        <InlineText color="data.primary">
                          {formatNumber(1866)}
                        </InlineText>
                      ), // situations_known_total
                      investigations_total: (
                        <InlineText color="data.primary">
                          {formatNumber(2763)}
                        </InlineText>
                      ), // investigations_total
                    }
                  )}
                </Text>
              </KpiTile>
            ) : undefined}
          </TwoKpiSection>
        </TileList>
      </SafetyRegionLayout>
    </Layout>
  );
}
