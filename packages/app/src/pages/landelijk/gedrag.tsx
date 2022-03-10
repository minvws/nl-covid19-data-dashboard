import { Gedrag } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { useMemo, useRef, useState } from 'react';
import { Box } from '~/components/base';
import { Markdown } from '~/components/markdown';
import { PageInformationBlock } from '~/components/page-information-block';
import { Tile } from '~/components/tile';
import { TileList } from '~/components/tile-list';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Heading } from '~/components/typography';
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
import { Languages } from '~/locale';
import {
  getArticleParts,
  getPagePartsQuery,
} from '~/queries/get-page-parts-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  createGetContent,
  getLastGeneratedDate,
  selectNlData,
  getLokalizeTexts,
} from '~/static-props/get-data';
import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) =>
    getLokalizeTexts(
      (siteText) => ({
        textNl: siteText.pages.behaviorPage.nl,
      }),
      locale
    ),
  getLastGeneratedDate,
  selectNlData('behavior', 'behavior_per_age_group'),
  createGetChoroplethData({
    vr: ({ behavior }) => ({ behavior }),
  }),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<
      PagePartQueryResult<ArticleParts>
    >(() => getPagePartsQuery('behaviorPage'))(context);

    return {
      content: {
        articles: getArticleParts(content.pageParts, 'behaviorPageArticles'),
      },
    };
  }
);

export default function BehaviorPage(
  props: StaticProps<typeof getStaticProps>
) {
  const {
    pageText,
    selectedNlData: data,
    choropleth,
    content,
    lastGenerated,
  } = props;
  const behaviorLastValue = data.behavior.last_value;

  const { siteText, formatNumber, formatDateFromSeconds, formatPercentage } =
    useIntl();
  const { textNl } = pageText;

  const metadata = {
    ...siteText.pages.topicalPage.nl.nationaal_metadata,
    title: textNl.metadata.title,
    description: textNl.metadata.description,
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
      <NlLayout>
        <TileList>
          <PageInformationBlock
            category={siteText.nationaal_layout.headings.gedrag}
            title={textNl.pagina.titel}
            icon={<Gedrag />}
            description={textNl.pagina.toelichting}
            metadata={{
              datumsText: textNl.datums,
              dateOrRange: {
                start: behaviorLastValue.date_start_unix,
                end: behaviorLastValue.date_end_unix,
              },
              dateOfInsertionUnix: behaviorLastValue.date_of_insertion_unix,
              dataSources: [textNl.bronnen.rivm],
            }}
            referenceLink={textNl.reference.href}
            articles={content.articles}
          />

          <TwoKpiSection>
            <Tile>
              <Box spacing={3}>
                <Heading level={3}>{textNl.onderzoek_uitleg.titel}</Heading>
                <Markdown content={textNl.onderzoek_uitleg.toelichting} />
              </Box>
            </Tile>

            <Tile>
              <Box spacing={3}>
                <Heading level={3}>
                  {textNl.kpi_recente_inzichten.titel}
                </Heading>

                <Markdown
                  content={replaceVariablesInText(
                    textNl.kpi_recente_inzichten.tekst,
                    {
                      number_of_participants: formatNumber(
                        behaviorLastValue.number_of_participants
                      ),
                      date_start: formatDateFromSeconds(
                        behaviorLastValue.date_start_unix
                      ),
                      date_end: formatDateFromSeconds(
                        behaviorLastValue.date_end_unix
                      ),

                      highest_compliance_description:
                        highestCompliance.description,
                      highest_compliance_compliance_percentage:
                        formatPercentage(
                          highestCompliance.compliancePercentage
                        ),
                      highest_compliance_support_percentage: formatPercentage(
                        highestCompliance.supportPercentage
                      ),

                      highest_support_description: highestSupport.description,
                      highest_support_compliance_percentage: formatPercentage(
                        highestSupport.compliancePercentage
                      ),
                      highest_support_support_percentage: formatPercentage(
                        highestSupport.supportPercentage
                      ),
                    }
                  )}
                />
              </Box>
            </Tile>
          </TwoKpiSection>

          <BehaviorTableTile
            title={textNl.basisregels.title}
            description={textNl.basisregels.description}
            complianceExplanation={textNl.basisregels.volgen_beschrijving}
            supportExplanation={textNl.basisregels.steunen_beschrijving}
            value={behaviorLastValue}
            annotation={textNl.basisregels.annotatie}
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
              source: textNl.bronnen.rivm,
            }}
            currentId={currentId}
            setCurrentId={setCurrentId}
          />

          <BehaviorChoroplethsTile
            title={textNl.verdeling_in_nederland.titel}
            description={textNl.verdeling_in_nederland.description}
            data={choropleth.vr}
            currentId={currentId}
            setCurrentId={setCurrentId}
          />

          {data.behavior_per_age_group && (
            <BehaviorPerAgeGroup
              title={textNl.tabel_per_leeftijdsgroep.title}
              description={textNl.tabel_per_leeftijdsgroep.description}
              complianceExplanation={
                textNl.tabel_per_leeftijdsgroep.explanation.compliance
              }
              supportExplanation={
                textNl.tabel_per_leeftijdsgroep.explanation.support
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
