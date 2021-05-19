import Gedrag from '~/assets/gedrag.svg';
import { ArticleStrip } from '~/components/article-strip';
import { ContentHeader } from '~/components/content-header';
import { Tile } from '~/components/tile';
import { TileList } from '~/components/tile-list';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Heading, InlineText, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { BehaviorLineChartTile } from './redesigned-behavior-line-chart-tile';

interface BehaviorPageSafetyRegionProps {
  data: any;
  content: any;
}

export function BehaviorPageSafetyRegion({
  data,
  content,
}: BehaviorPageSafetyRegionProps) {
  const { siteText, formatDateFromSeconds, formatNumber } = useIntl();

  const { regionaal_gedrag } = siteText;
  const behaviorLastValue = data.behavior.last_value;

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
                <span>
                  {formatDateFromSeconds(behaviorLastValue.date_start_unix)}
                </span>
              ),
              date_end: (
                <span>
                  {formatDateFromSeconds(behaviorLastValue.date_end_unix)}
                </span>
              ),
            })}
          </Text>
        </Tile>
      </TwoKpiSection>

      <ArticleStrip articles={content.articles} />

      <BehaviorLineChartTile
        values={data.behavior.values}
        metadata={{
          date: [
            behaviorLastValue.date_start_unix,
            behaviorLastValue.date_end_unix,
          ],
          source: regionaal_gedrag.bronnen.rivm,
        }}
      />
    </TileList>
  );
}
