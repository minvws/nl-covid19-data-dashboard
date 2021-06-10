import { RegionsBehavior } from '@corona-dashboard/common';
import Gedrag from '~/assets/gedrag.svg';
import { ArticleStrip } from '~/components/article-strip';
import { ArticleSummary } from '~/components/article-teaser';
import { ContentHeader } from '~/components/content-header';
import { Tile } from '~/components/tile';
import { TileList } from '~/components/tile-list';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Heading, InlineText, Text } from '~/components/typography';
import { BehaviorChoroplethsTile } from '~/domain/behavior/redesign/behavior-choropleths-tile';
import { BehaviorPerAgeGroup } from '~/domain/behavior/redesign/behavior-per-age-group-tile';
import { BehaviorTableTile } from '~/domain/behavior/redesign/behavior-table-tile';
import { MoreInformation } from '~/domain/behavior/components/more-information';
import { useFormatAndSortBehavior } from '~/domain/behavior/hooks/useFormatAndSortBehavior';
import { NationalPageMetricData } from '~/domain/layout/national-layout';
import { useIntl } from '~/intl';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { BehaviorLineChartTile } from './behavior-line-chart-tile';
import { BehaviorIdentifier } from '../behavior-types';
import { useState, useRef } from 'react';
import { Markdown } from '~/components/markdown';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

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
  const { siteText, formatDateFromSeconds, formatNumber, formatPercentage } =
    useIntl();

  const { nl_gedrag } = siteText;
  const behaviorLastValue = data.behavior.last_value;

  const [currentId, setCurrentId] = useState<BehaviorIdentifier>('wash_hands');
  const scrollToRef = useRef<HTMLDivElement>(null);

  const { sortedCompliance, sortedSupport } =
    useFormatAndSortBehavior(behaviorLastValue);

  const highestSupport = [...sortedSupport].sort(
    (a, b) => (b.percentage ?? 0) - (a.percentage ?? 0)
  );

  console.log(sortedCompliance[0].id, sortedSupport[0].id);

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
          <Markdown
            content={replaceVariablesInText(gekkeUniekestring, {
              number_of_participants: formatNumber(
                behaviorLastValue.number_of_participants
              ),
              date_start: formatDateFromSeconds(
                behaviorLastValue.date_start_unix
              ),
              date_end: formatDateFromSeconds(behaviorLastValue.date_end_unix),

              highest_compliance_description: sortedCompliance[0].description,
              highest_compliance_compliance_percentage: formatPercentage(
                sortedCompliance[0].percentage
              ),
              highest_compliance_support_percentage: formatPercentage(
                sortedSupport[0].percentage
              ),

              highest_support_description: sortedSupport[0].description,
              highest_support_compliance_percentage: formatPercentage(
                sortedSupport[0].percentage
              ),
              highest_support_support_percentage: formatPercentage(
                highestSupport[0].percentage
              ),
            })}
          ></Markdown>
          {/* <Text>
            {replaceComponentsInText(nl_gedrag.kpi.hoogste_gevolgde_regel, {
              description: (
                <InlineText>{sortedSupport[0].description}</InlineText>
              ),
              support_percentage: (
                <InlineText>{sortedSupport[0].percentage}</InlineText>
              ),
              compliance_percentage: (
                <InlineText></InlineText>
              )
            })}
          </Text>
          <Text>
            {replaceComponentsInText(nl_gedrag.kpi.hoogste_draagvlak, {
              description: (
                <InlineText>{sortedSupport[0].description}</InlineText>
              ),
              support_percentage: (
                <InlineText>{sortedSupport[0].percentage}</InlineText>
              ),
              compliance_percentage: (
                <InlineText></InlineText>
              )
            })}
          </Text> */}
        </Tile>
      </TwoKpiSection>

      <ArticleStrip articles={content.articles} />

      <BehaviorTableTile
        title={nl_gedrag.basisregels.title}
        description={nl_gedrag.basisregels.description}
        complianceExplanation={nl_gedrag.basisregels.volgen_beschrijving}
        supportExplanation={nl_gedrag.basisregels.steunen_beschrijving}
        sortedCompliance={sortedCompliance}
        sortedSupport={sortedSupport}
        annotation={nl_gedrag.basisregels.annotatie}
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
          source: nl_gedrag.bronnen.rivm,
        }}
        currentId={currentId}
        setCurrentId={setCurrentId}
      />

      <BehaviorChoroplethsTile
        title={nl_gedrag.verdeling_in_nederland.titel}
        description={nl_gedrag.verdeling_in_nederland.description}
        data={behaviorData}
        currentId={currentId}
        setCurrentId={setCurrentId}
      />

      {data.behavior_per_age_group && (
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
          currentId={currentId}
          setCurrentId={setCurrentId}
        />
      )}

      <MoreInformation />
    </TileList>
  );
}
