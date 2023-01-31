import { Bevolking } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { middleOfDayInSeconds } from '@corona-dashboard/common';
import { useMemo, useRef, useState } from 'react';
import { Box } from '~/components/base';
import { Divider } from '~/components/divider';
import { Heading } from '~/components/typography';
import { Markdown } from '~/components/markdown';
import { PageInformationBlock } from '~/components/page-information-block';
import { Tile } from '~/components/tile';
import { TileList } from '~/components/tile-list';
import { TwoKpiSection } from '~/components/two-kpi-section';
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
import { Languages, SiteText } from '~/locale';
import { getArticleParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { createGetChoroplethData, createGetContent, getLastGeneratedDate, selectNlData, getLokalizeTexts } from '~/static-props/get-data';
import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';

const pageMetrics = ['behavior', 'behavior_annotations', 'behavior_per_age_group'];

const selectLokalizeTexts = (siteText: SiteText) => ({
  caterogyTexts: siteText.common.sidebar.categories.actions_to_take.title,
  metadataTexts: siteText.pages.topical_page.nl.nationaal_metadata,
  text: siteText.pages.behavior_page,
  textNl: siteText.pages.behavior_page.nl,
  textShared: siteText.pages.behavior_page.shared,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectNlData('behavior', 'behavior_annotations', 'behavior_per_age_group'),
  createGetChoroplethData({
    vr: ({ behavior_archived_20221019 }) => ({ behavior_archived_20221019 }),
  }),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<PagePartQueryResult<ArticleParts>>(() => getPagePartsQuery('behavior_page'))(context);

    return {
      content: {
        articles: getArticleParts(content.pageParts, 'behaviorPageArticles'),
      },
    };
  }
);

export default function BehaviorPage(props: StaticProps<typeof getStaticProps>) {
  const { pageText, selectedNlData: data, choropleth, content, lastGenerated } = props;
  const behaviorLastValue = data.behavior.last_value;

  const { formatNumber, formatDateFromSeconds, formatPercentage, locale } = useIntl();
  const { caterogyTexts, metadataTexts, text, textNl, textShared } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);

  const metadata = {
    ...metadataTexts,
    title: textNl.metadata.title,
    description: textNl.metadata.description,
  };

  const [currentId, setCurrentId] = useState<BehaviorIdentifier>('wash_hands');
  const scrollToRef = useRef<HTMLDivElement>(null);

  const behaviorLookupKeys = useBehaviorLookupKeys();

  const [hasHideArchivedCharts, setHideArchivedCharts] = useState<boolean>(false);

  const { highestCompliance, highestSupport } = useMemo(() => {
    const list = behaviorLookupKeys.map((x) => ({
      description: x.description,
      compliancePercentage: behaviorLastValue[x.complianceKey] as number,
      supportPercentage: behaviorLastValue[x.supportKey] as number,
    }));

    const highestCompliance = list.sort((a, b) => (b.compliancePercentage ?? 0) - (a.compliancePercentage ?? 0))[0];

    const highestSupport = list.sort((a, b) => (b.supportPercentage ?? 0) - (a.supportPercentage ?? 0))[0];

    return { highestCompliance, highestSupport };
  }, [behaviorLastValue, behaviorLookupKeys]);

  const { currentTimelineEvents } = useMemo(() => {
    // Timeline event from the current selected behaviour
    const currentTimelineEvents = data.behavior_annotations.values
      .filter((a) => a.behavior_indicator === currentId)
      .map((event) => ({
        title: event[`message_title_${locale}`],
        description: event[`message_desc_${locale}`],
        start: middleOfDayInSeconds(event.date_start_unix),
        end: middleOfDayInSeconds(event.date_end_unix),
      }));

    return { currentTimelineEvents };
  }, [currentId, data.behavior_annotations.values, locale]);

  const timelineProp = { timelineEvents: currentTimelineEvents };

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList>
          <PageInformationBlock
            category={caterogyTexts}
            title={text.nl.pagina.titel}
            icon={<Bevolking aria-hidden="true" />}
            description={text.nl.pagina.toelichting}
            metadata={{
              datumsText: textNl.datums,
              dateOrRange: {
                start: behaviorLastValue.date_start_unix,
                end: behaviorLastValue.date_end_unix,
              },
              dateOfInsertionUnix: lastInsertionDateOfPage,
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
                <Heading level={3}>{textNl.kpi_recente_inzichten.titel}</Heading>

                <Markdown
                  content={replaceVariablesInText(textNl.kpi_recente_inzichten.tekst, {
                    number_of_participants: formatNumber(behaviorLastValue.number_of_participants),
                    date_start: formatDateFromSeconds(behaviorLastValue.date_start_unix),
                    date_end: formatDateFromSeconds(behaviorLastValue.date_end_unix),

                    highest_compliance_description: highestCompliance.description,
                    highest_compliance_compliance_percentage: formatPercentage(highestCompliance.compliancePercentage),
                    highest_compliance_support_percentage: formatPercentage(highestCompliance.supportPercentage),

                    highest_support_description: highestSupport.description,
                    highest_support_compliance_percentage: formatPercentage(highestSupport.compliancePercentage),
                    highest_support_support_percentage: formatPercentage(highestSupport.supportPercentage),
                  })}
                />
              </Box>
            </Tile>
          </TwoKpiSection>

          <BehaviorTableTile
            title={text.shared.basisregels.title}
            description={textNl.basisregels.description}
            value={behaviorLastValue}
            annotation={text.shared.basisregels.annotation}
            setCurrentId={setCurrentId}
            scrollRef={scrollToRef}
            text={textShared}
            metadata={{
              datumsText: textNl.datums,
              date: data.behavior.last_value.date_start_unix,
              source: textNl.bronnen.rivm,
            }}
          />

          <span ref={scrollToRef} />

          <BehaviorLineChartTile
            values={data.behavior.values}
            metadata={{
              date: [behaviorLastValue.date_start_unix, behaviorLastValue.date_end_unix],
              source: textNl.bronnen.rivm,
            }}
            {...timelineProp}
            currentId={currentId}
            setCurrentId={setCurrentId}
            text={text}
          />

          {data.behavior_per_age_group && (
            <BehaviorPerAgeGroup
              title={textNl.tabel_per_leeftijdsgroep.title}
              description={textNl.tabel_per_leeftijdsgroep.description}
              data={data.behavior_per_age_group}
              currentId={currentId}
              setCurrentId={setCurrentId}
              text={text}
              metadata={{
                datumsText: textNl.datums,
                date: data.behavior_per_age_group.date_start_unix,
                source: textNl.bronnen.rivm,
              }}
            />
          )}

          <Divider />

          <PageInformationBlock
            title={textNl.section_archived.title}
            description={textNl.section_archived.description}
            isArchivedHidden={hasHideArchivedCharts}
            onToggleArchived={() => setHideArchivedCharts(!hasHideArchivedCharts)}
          />

          {hasHideArchivedCharts && (
            <BehaviorChoroplethsTile
              title={textNl.verdeling_in_nederland.titel}
              description={textNl.verdeling_in_nederland.description}
              data={choropleth.vr}
              currentId={currentId}
              setCurrentId={setCurrentId}
              text={text}
            />
          )}
          <MoreInformation text={textShared.meer_onderzoeksresultaten} />
        </TileList>
      </NlLayout>
    </Layout>
  );
}
