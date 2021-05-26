import Gedrag from '~/assets/gedrag.svg';
import { RegionsBehavior } from '@corona-dashboard/common';
import { ArticleStrip } from '~/components/article-strip';
import { ArticleSummary } from '~/components/article-teaser';
import { ContentHeader } from '~/components/content-header';
import { Tile } from '~/components/tile';
import { TileList } from '~/components/tile-list';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Heading, InlineText, Text } from '~/components/typography';
import { BehaviorPerAgeGroup } from '~/domain/behavior/behavior-per-age-group-tile';
import { useFormatAndSortBehavior } from '~/domain/behavior/hooks/useFormatAndSortBehavior';
import { BehaviorTable } from '~/domain/behavior/behavior-table';
import { useIntl } from '~/intl';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { MoreInformation } from '~/domain/behavior/components/more-information';
import { NationalPageMetricData } from '~/domain/layout/national-layout';
import { BehaviorChoroplethsTile } from '~/domain/behavior/behavior-choropleths-tile';

interface BehaviourPageNationalProps {
  data: NationalPageMetricData;
  content: { articles?: ArticleSummary[] | undefined };
  behaviorData: RegionsBehavior[];
}

export function BehaviorPageNational({
  data,
  content,
  behaviorData,
}: BehaviourPageNationalProps) {
  const { siteText, formatDateFromSeconds, formatNumber } = useIntl();

  const { nl_gedrag } = siteText;
  const behaviorLastValue = data.behavior.last_value;

  const { sortedCompliance, sortedSupport } =
    useFormatAndSortBehavior(behaviorLastValue);

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
          <Text>
            {replaceComponentsInText(nl_gedrag.kpi.hoogste_gevolgde_regel, {
              highest_compliance_description: (
                <InlineText>{sortedCompliance[0].description}</InlineText>
              ),
              highest_compliance_percentage: (
                <InlineText>{sortedCompliance[0].percentage}</InlineText>
              ),
              highest_support_percentage: (
                <InlineText>
                  {
                    sortedSupport.find((x) => sortedCompliance[0].id === x.id)
                      ?.percentage
                  }
                </InlineText>
              ),
            })}
          </Text>
          <Text>
            {replaceComponentsInText(nl_gedrag.kpi.hoogste_draagvlak, {
              highest_support_description: (
                <InlineText>{sortedSupport[0].description}</InlineText>
              ),
              highest_compliance_support: (
                <InlineText>{sortedSupport[0].percentage}</InlineText>
              ),
            })}
          </Text>
        </Tile>
      </TwoKpiSection>

      <ArticleStrip articles={content.articles} />

      <BehaviorTable
        title={nl_gedrag.basisregels.title}
        description={nl_gedrag.basisregels.description}
        complianceExplanation={nl_gedrag.basisregels.volgen_beschrijving}
        supportExplanation={nl_gedrag.basisregels.steunen_beschrijving}
        sortedCompliance={sortedCompliance}
        sortedSupport={sortedSupport}
        annotation={nl_gedrag.basisregels.annotatie}
      />

      <BehaviorChoroplethsTile
        title={nl_gedrag.verdeling_in_nederland.titel}
        description={nl_gedrag.verdeling_in_nederland.description}
        data={behaviorData}
      />

      <BehaviorPerAgeGroup
        title={siteText.nl_gedrag.tabel_per_leeftijdsgroep.title}
        description={nl_gedrag.tabel_per_leeftijdsgroep.description}
        complianceExplanation={
          nl_gedrag.tabel_per_leeftijdsgroep.explanation.compliance
        }
        supportExplanation={
          nl_gedrag.tabel_per_leeftijdsgroep.explanation.support
        }
        data={data.behavior_per_age_group}
      />

      <MoreInformation />
    </TileList>
  );
}
