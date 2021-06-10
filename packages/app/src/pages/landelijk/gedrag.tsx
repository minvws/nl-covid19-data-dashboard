import { assert, NationalBehaviorValue } from '@corona-dashboard/common';
import { maxBy } from 'lodash';
import { useMemo, useRef, useState } from 'react';
import { isDefined, isPresent } from 'ts-is-present';
import Gedrag from '~/assets/gedrag.svg';
import { ArticleStrip } from '~/components/article-strip';
import { ArticleSummary } from '~/components/article-teaser';
import { ContentHeader } from '~/components/content-header';
import { Markdown } from '~/components/markdown';
import { Tile } from '~/components/tile';
import { TileList } from '~/components/tile-list';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Heading, Text } from '~/components/typography';
import {
  BehaviorIdentifier,
  behaviorIdentifiers,
} from '~/domain/behavior/logic/behavior-types';
import { MoreInformation } from '~/domain/behavior/components/more-information';
import { useFormatAndSortBehavior } from '~/domain/behavior/logic/use-format-and-sort-behavior';
import { BehaviorChoroplethsTile } from '~/domain/behavior/behavior-choropleths-tile';
import { BehaviorLineChartTile } from '~/domain/behavior/behavior-line-chart-tile';
import { BehaviorPerAgeGroup } from '~/domain/behavior/behavior-per-age-group-tile';
import { BehaviorTableTile } from '~/domain/behavior/behavior-table-tile';
import { Layout } from '~/domain/layout/layout';
import { NationalLayout } from '~/domain/layout/national-layout';
import { useIntl } from '~/intl';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  createGetContent,
  getLastGeneratedDate,
  selectNlPageMetricData,
} from '~/static-props/get-data';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectNlPageMetricData('behavior_per_age_group'),
  createGetChoroplethData({
    vr: ({ behavior }) => ({ behavior }),
  }),
  createGetContent<{
    articles?: ArticleSummary[];
  }>((_context) => {
    const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
    return createPageArticlesQuery('behaviorPage', locale);
  })
);

export default function BehaviorPage(
  props: StaticProps<typeof getStaticProps>
) {
  const { siteText } = useIntl();

  const { selectedNlData: data, choropleth, content, lastGenerated } = props;
  const behaviorLastValue = data.behavior.last_value;
  const { nl_gedrag } = siteText;

  const metadata = {
    ...siteText.nationaal_metadata,
    title: nl_gedrag.metadata.title,
    description: nl_gedrag.metadata.description,
  };

  const [currentId, setCurrentId] = useState<BehaviorIdentifier>('wash_hands');
  const scrollToRef = useRef<HTMLDivElement>(null);

  const { sortedCompliance, sortedSupport } =
    useFormatAndSortBehavior(behaviorLastValue);

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NationalLayout data={data} lastGenerated={lastGenerated}>
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
            <RecentInsightsTile behaviorLastValue={behaviorLastValue} />
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
            data={choropleth.vr.behavior}
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
      </NationalLayout>
    </Layout>
  );
}

interface Behavior {
  id: BehaviorIdentifier;
  complianceId: `${BehaviorIdentifier}_compliance`;
  supportId: `${BehaviorIdentifier}_support`;

  description: string;

  compliancePercentage: number;
  supportPercentage: number;
}

function RecentInsightsTile({
  behaviorLastValue,
}: {
  behaviorLastValue: NationalBehaviorValue;
}) {
  const intl = useIntl();

  const behaviorsSortedByCompliance = useMemo(() => {
    return behaviorIdentifiers
      .map((id) => {
        const complianceId =
          `${id}_compliance` as `${BehaviorIdentifier}_compliance`;
        const supportId = `${id}_support` as `${BehaviorIdentifier}_support`;
        const compliancePercentage = behaviorLastValue[complianceId];
        const supportPercentage = behaviorLastValue[supportId];
        const description = intl.siteText.gedrag_onderwerpen[id];

        if (isPresent(compliancePercentage) && isPresent(supportPercentage)) {
          const value: Behavior = {
            id,
            description,
            complianceId,
            supportId,
            compliancePercentage,
            supportPercentage,
          };
          return value;
        }
      })
      .filter(isDefined)
      .sort(
        (a, b) => (b.compliancePercentage ?? 0) - (a.compliancePercentage ?? 0)
      );
  }, [behaviorLastValue, intl]);

  const highestCompliance = behaviorsSortedByCompliance[0];
  const highestSupport = maxBy(
    behaviorsSortedByCompliance,
    (x) => x.supportPercentage
  );

  assert(highestSupport, 'highestSupport cannot be undefined');

  return (
    <Tile>
      <Heading level={3}>
        {intl.siteText.nl_gedrag.kpi_recente_inzichten.titel}
      </Heading>

      <Markdown
        content={replaceVariablesInText(
          intl.siteText.nl_gedrag.kpi_recente_inzichten.tekst,
          {
            number_of_participants: intl.formatNumber(
              behaviorLastValue.number_of_participants
            ),
            date_start: intl.formatDateFromSeconds(
              behaviorLastValue.date_start_unix
            ),
            date_end: intl.formatDateFromSeconds(
              behaviorLastValue.date_end_unix
            ),

            highest_compliance_description: highestCompliance.description,
            highest_compliance_compliance_percentage: intl.formatPercentage(
              highestCompliance.compliancePercentage
            ),
            highest_compliance_support_percentage: intl.formatPercentage(
              highestCompliance.supportPercentage
            ),

            highest_support_description: highestSupport.description,
            highest_support_compliance_percentage: intl.formatPercentage(
              highestSupport.compliancePercentage
            ),
            highest_support_support_percentage: intl.formatPercentage(
              highestSupport.supportPercentage
            ),
          }
        )}
      />
    </Tile>
  );
}
