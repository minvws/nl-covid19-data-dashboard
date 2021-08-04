import { useMemo, useRef, useState } from 'react';
import Gedrag from '~/assets/gedrag.svg';
import { Box } from '~/components/base';
import { Markdown } from '~/components/markdown';
import { PageInformationBlock } from '~/components/page-information-block';
import { Tile } from '~/components/tile';
import { TileList } from '~/components/tile-list';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Heading, Text } from '~/components/typography';
import { BehaviorChoroplethsTile } from '~/domain/behavior/behavior-choropleths-tile';
import { BehaviorLineChartTile } from '~/domain/behavior/behavior-line-chart-tile';
import { BehaviorPerAgeGroup } from '~/domain/behavior/behavior-per-age-group-tile';
import { BehaviorTableTile } from '~/domain/behavior/behavior-table-tile';
import { MoreInformation } from '~/domain/behavior/components/more-information';
import { BehaviorIdentifier } from '~/domain/behavior/logic/behavior-types';
import { useBehaviorLookupKeys } from '~/domain/behavior/logic/use-behavior-lookup-keys';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { useIntl } from '~/intl';
import {
  createPageArticlesQuery,
  PageArticlesQueryResult,
} from '~/queries/create-page-articles-query';
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
  createGetContent<PageArticlesQueryResult>(() => {
    const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
    return createPageArticlesQuery('behaviorPage', locale);
  })
);

export default function BehaviorPage(
  props: StaticProps<typeof getStaticProps>
) {
  const { selectedNlData: data, choropleth, content, lastGenerated } = props;
  const behaviorLastValue = data.behavior.last_value;

  const intl = useIntl();
  const { nl_gedrag } = intl.siteText;

  const metadata = {
    ...intl.siteText.nationaal_metadata,
    title: nl_gedrag.metadata.title,
    description: nl_gedrag.metadata.description,
  };

  const [currentId, setCurrentId] = useState<BehaviorIdentifier>('wash_hands');
  const scrollToRef = useRef<HTMLDivElement>(null);

  const behaviorLookupKeys = useBehaviorLookupKeys();

  const { highestCompliance, highestSupport } = useMemo(() => {
    const list = behaviorLookupKeys.map((x) => ({
      description: x.description,
      compliancePercentage: behaviorLastValue[x.complianceKey] as number,
      supportPercentage: behaviorLastValue[x.supportKey] as number,
    }));

    const highestCompliance = list.sort(
      (a, b) => (b.compliancePercentage ?? 0) - (a.compliancePercentage ?? 0)
    )[0];

    const highestSupport = list.sort(
      (a, b) => (b.supportPercentage ?? 0) - (a.supportPercentage ?? 0)
    )[0];

    return { highestCompliance, highestSupport };
  }, [behaviorLastValue, behaviorLookupKeys]);

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout data={data} lastGenerated={lastGenerated}>
        <TileList>
          <PageInformationBlock
            category={intl.siteText.nationaal_layout.headings.gedrag}
            title={nl_gedrag.pagina.titel}
            icon={<Gedrag />}
            description={nl_gedrag.pagina.toelichting}
            metadata={{
              datumsText: nl_gedrag.datums,
              dateOrRange: {
                start: behaviorLastValue.date_start_unix,
                end: behaviorLastValue.date_end_unix,
              },
              dateOfInsertionUnix: behaviorLastValue.date_of_insertion_unix,
              dataSources: [nl_gedrag.bronnen.rivm],
            }}
            referenceLink={nl_gedrag.reference.href}
            articles={content.articles}
          />

          <TwoKpiSection>
            <Tile>
              <Box spacing={3}>
                <Heading level={3}>{nl_gedrag.onderzoek_uitleg.titel}</Heading>
                <Text>{nl_gedrag.onderzoek_uitleg.toelichting}</Text>
              </Box>
            </Tile>

            <Tile>
              <Box spacing={3}>
                <Heading level={3}>
                  {nl_gedrag.kpi_recente_inzichten.titel}
                </Heading>

                <Markdown
                  content={replaceVariablesInText(
                    nl_gedrag.kpi_recente_inzichten.tekst,
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

                      highest_compliance_description:
                        highestCompliance.description,
                      highest_compliance_compliance_percentage:
                        intl.formatPercentage(
                          highestCompliance.compliancePercentage
                        ),
                      highest_compliance_support_percentage:
                        intl.formatPercentage(
                          highestCompliance.supportPercentage
                        ),

                      highest_support_description: highestSupport.description,
                      highest_support_compliance_percentage:
                        intl.formatPercentage(
                          highestSupport.compliancePercentage
                        ),
                      highest_support_support_percentage: intl.formatPercentage(
                        highestSupport.supportPercentage
                      ),
                    }
                  )}
                />
              </Box>
            </Tile>
          </TwoKpiSection>

          <BehaviorTableTile
            title={nl_gedrag.basisregels.title}
            description={nl_gedrag.basisregels.description}
            complianceExplanation={nl_gedrag.basisregels.volgen_beschrijving}
            supportExplanation={nl_gedrag.basisregels.steunen_beschrijving}
            value={behaviorLastValue}
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
            data={choropleth.vr}
            currentId={currentId}
            setCurrentId={setCurrentId}
          />

          {data.behavior_per_age_group && (
            <BehaviorPerAgeGroup
              title={nl_gedrag.tabel_per_leeftijdsgroep.title}
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
      </NlLayout>
    </Layout>
  );
}
