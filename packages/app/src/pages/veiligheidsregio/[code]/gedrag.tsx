import { useRef, useState } from 'react';
import Gedrag from '~/assets/gedrag.svg';
import { ArticleStrip } from '~/components/article-strip';
import { ArticleSummary } from '~/components/article-teaser';
import { ContentHeader } from '~/components/content-header';
import { Tile } from '~/components/tile';
import { TileList } from '~/components/tile-list';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Heading, InlineText, Text } from '~/components/typography';
import { BehaviorLineChartTile } from '~/domain/behavior/behavior-line-chart-tile';
import { BehaviorTableTile } from '~/domain/behavior/behavior-table-tile';
import { MoreInformation } from '~/domain/behavior/components/more-information';
import { BehaviorIdentifier } from '~/domain/behavior/logic/behavior-types';
import { Layout } from '~/domain/layout/layout';
import { SafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import { useIntl } from '~/intl';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  selectVrPageMetricData,
} from '~/static-props/get-data';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectVrPageMetricData(),
  createGetContent<{
    articles?: ArticleSummary[];
  }>(() => {
    const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
    return createPageArticlesQuery('behaviorPage', locale);
  })
);

export default function BehaviorPageSafetyRegion(
  props: StaticProps<typeof getStaticProps>
) {
  const {
    lastGenerated,
    content,
    selectedVrData: data,
    safetyRegionName,
  } = props;

  const { siteText, formatDateFromSeconds, formatNumber } = useIntl();

  const text = siteText.regionaal_gedrag;

  const metadata = {
    ...siteText.veiligheidsregio_index.metadata,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  const { regionaal_gedrag } = siteText;
  const behaviorLastValue = data.behavior.last_value;

  const [currentId, setCurrentId] = useState<BehaviorIdentifier>('wash_hands');
  const scrollToRef = useRef<HTMLDivElement>(null);

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <SafetyRegionLayout
        data={data}
        safetyRegionName={safetyRegionName}
        lastGenerated={lastGenerated}
      >
        <TileList>
          <ContentHeader
            category={siteText.nationaal_layout.headings.gedrag}
            title={regionaal_gedrag.pagina.titel}
            icon={<Gedrag />}
            subtitle={regionaal_gedrag.pagina.toelichting}
            metadata={{
              datumsText: regionaal_gedrag.datums,
              dateOrRange: {
                start: behaviorLastValue.date_start_unix,
                end: behaviorLastValue.date_end_unix,
              },
              dateOfInsertionUnix: behaviorLastValue.date_of_insertion_unix,
              dataSources: [regionaal_gedrag.bronnen.rivm],
            }}
            reference={regionaal_gedrag.reference}
          />

          <TwoKpiSection>
            <Tile>
              <Heading level={3}>
                {regionaal_gedrag.onderzoek_uitleg.titel}
              </Heading>
              <Text>{regionaal_gedrag.onderzoek_uitleg.toelichting}</Text>
            </Tile>
            <Tile height="100%">
              <Heading level={3}>{regionaal_gedrag.kpi.titel}</Heading>
              <Text>
                {replaceComponentsInText(
                  regionaal_gedrag.kpi.deelgenomen_mensen,
                  {
                    number_of_participants: (
                      <InlineText fontWeight="bold">
                        {formatNumber(behaviorLastValue.number_of_participants)}
                      </InlineText>
                    ),
                    date_start: (
                      <InlineText>
                        {formatDateFromSeconds(
                          behaviorLastValue.date_start_unix
                        )}
                      </InlineText>
                    ),
                    date_end: (
                      <InlineText>
                        {formatDateFromSeconds(behaviorLastValue.date_end_unix)}
                      </InlineText>
                    ),
                  }
                )}
              </Text>
            </Tile>
          </TwoKpiSection>

          <ArticleStrip articles={content.articles} />

          <BehaviorTableTile
            title={regionaal_gedrag.basisregels.title}
            description={regionaal_gedrag.basisregels.description}
            complianceExplanation={
              regionaal_gedrag.basisregels.volgen_beschrijving
            }
            supportExplanation={
              regionaal_gedrag.basisregels.steunen_beschrijving
            }
            value={behaviorLastValue}
            annotation={regionaal_gedrag.basisregels.annotatie}
            setCurrentId={setCurrentId}
            scrollRef={scrollToRef}
          />

          <span ref={scrollToRef} />
          <BehaviorLineChartTile
            values={data.behavior.values}
            metadata={{
              date: [
                behaviorLastValue.date_start_unix,
                behaviorLastValue.date_end_unix,
              ],
              source: regionaal_gedrag.bronnen.rivm,
            }}
            currentId={currentId}
            setCurrentId={setCurrentId}
          />

          <MoreInformation />
        </TileList>
      </SafetyRegionLayout>
    </Layout>
  );
}
