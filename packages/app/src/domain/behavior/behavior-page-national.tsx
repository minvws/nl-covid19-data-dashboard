import Gedrag from '~/assets/gedrag.svg';
import { ArticleStrip } from '~/components/article-strip';
import { ContentHeader } from '~/components/content-header';
import { Tile } from '~/components/tile';
import { TileList } from '~/components/tile-list';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Heading, InlineText, Text } from '~/components/typography';
import { useFormatAndSortBehavior } from '~/domain/behavior/behavior-logic';
import { useIntl } from '~/intl';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { BehaviorLineChartTile } from './redesigned-behavior-line-chart-tile';
interface BehaviourPageNationalProps {
  data: any;
  content: any;
}

export function BehaviorPageNational({
  data,
  content,
}: BehaviourPageNationalProps) {
  const { siteText, formatDateFromSeconds, formatNumber } = useIntl();

  const { nl_gedrag } = siteText;
  const behaviorLastValue = data.behavior.last_value;

  const { sortedCompliance, sortedSupport } = useFormatAndSortBehavior(
    behaviorLastValue
  );

  return (
    <TileList>
      <ContentHeader
        category={siteText.nationaal_layout.headings.gedrag}
        title={nl_gedrag.pagina.titel}
        icon={<Gedrag />}
        subtitle={nl_gedrag.pagina.toelichting}
        metadata={{
          datumsText: nl_gedrag.datums,
          dateOrRange: {
            start: behaviorLastValue.date_start_unix,
            end: behaviorLastValue.date_end_unix,
          },
          dateOfInsertionUnix: behaviorLastValue.date_of_insertion_unix,
          dataSources: [nl_gedrag.bronnen.rivm],
        }}
        reference={nl_gedrag.reference}
      />

      <TwoKpiSection>
        <Tile>
          <Heading level={3}>{nl_gedrag.onderzoek_uitleg.titel}</Heading>
          <Text>{nl_gedrag.onderzoek_uitleg.toelichting}</Text>
        </Tile>
        <Tile>
          <Heading level={3}>{nl_gedrag.kpi.titel}</Heading>
          <Text>
            {replaceComponentsInText(nl_gedrag.kpi.deelgenomen_mensen, {
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
          <Text>
            {replaceComponentsInText(nl_gedrag.kpi.hoogste_gevolgde_regel, {
              highest_compliance_description: (
                <span>{sortedCompliance[0].description}</span>
              ),
              highest_complience_percentage: (
                <span>{sortedCompliance[0].percentage}</span>
              ),
              highest_complience_percentage_support: (
                <span>
                  {
                    sortedSupport.find((x) => sortedCompliance[0].id === x.id)
                      ?.percentage
                  }
                </span>
              ),
            })}
          </Text>
          <Text>
            {replaceComponentsInText(nl_gedrag.kpi.hoogste_draagvlak, {
              highest_support_description: (
                <span>{sortedSupport[0].description}</span>
              ),
              highest_complience_support: (
                <span>{sortedSupport[0].percentage}</span>
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
          source: nl_gedrag.bronnen.rivm,
        }}
      />
    </TileList>
  );
}
