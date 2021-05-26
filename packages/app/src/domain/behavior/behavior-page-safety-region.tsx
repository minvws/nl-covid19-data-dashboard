import Gedrag from '~/assets/gedrag.svg';
import { ArticleStrip } from '~/components/article-strip';
import { ArticleSummary } from '~/components/article-teaser';
import { ContentHeader } from '~/components/content-header';
import { Tile } from '~/components/tile';
import { TileList } from '~/components/tile-list';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Heading, InlineText, Text } from '~/components/typography';
import { useFormatAndSortBehavior } from '~/domain/behavior/hooks/useFormatAndSortBehavior';
import { BehaviorTable } from '~/domain/behavior/behavior-table';
import { useIntl } from '~/intl';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { SafetyRegionPageMetricData } from '~/domain/layout/safety-region-layout';
import { MoreInformation } from '~/domain/behavior/components/more-information';
interface BehaviorPageSafetyRegionProps {
  data: SafetyRegionPageMetricData;
  content: { articles?: ArticleSummary[] | undefined };
}

export function BehaviorPageSafetyRegion({
  data,
  content,
}: BehaviorPageSafetyRegionProps) {
  const { siteText, formatDateFromSeconds, formatNumber } = useIntl();

  const { regionaal_gedrag } = siteText;
  const behaviorLastValue = data.behavior.last_value;

  const { sortedCompliance, sortedSupport } =
    useFormatAndSortBehavior(behaviorLastValue);

  return (
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
          <Heading level={3}>{regionaal_gedrag.onderzoek_uitleg.titel}</Heading>
          <Text>{regionaal_gedrag.onderzoek_uitleg.toelichting}</Text>
        </Tile>
        <Tile height="100%">
          <Heading level={3}>{regionaal_gedrag.kpi.titel}</Heading>
          <Text>
            {replaceComponentsInText(regionaal_gedrag.kpi.deelgenomen_mensen, {
              number_of_participants: (
                <InlineText fontWeight="bold">
                  {formatNumber(behaviorLastValue.number_of_participants)}
                </InlineText>
              ),
              date_start: (
                <InlineText>
                  {formatDateFromSeconds(behaviorLastValue.date_start_unix)}
                </InlineText>
              ),
              date_end: (
                <InlineText>
                  {formatDateFromSeconds(behaviorLastValue.date_end_unix)}
                </InlineText>
              ),
            })}
          </Text>
        </Tile>
      </TwoKpiSection>

      <ArticleStrip articles={content.articles} />

      <BehaviorTable
        title={regionaal_gedrag.basisregels.title}
        description={regionaal_gedrag.basisregels.description}
        complianceExplanation={regionaal_gedrag.basisregels.volgen_beschrijving}
        supportExplanation={regionaal_gedrag.basisregels.steunen_beschrijving}
        sortedCompliance={sortedCompliance}
        sortedSupport={sortedSupport}
        annotation={regionaal_gedrag.basisregels.annotatie}
      />

      <MoreInformation />
    </TileList>
  );
}
