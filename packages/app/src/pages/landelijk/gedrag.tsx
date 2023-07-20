import { Bevolking } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { middleOfDayInSeconds } from '@corona-dashboard/common';
import { useMemo, useRef, useState } from 'react';
import { Heading } from '~/components/typography';
import { Markdown } from '~/components/markdown';
import { PageInformationBlock } from '~/components/page-information-block';
import { Tile } from '~/components/tile';
import { TileList } from '~/components/tile-list';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { BehaviorLineChartTile } from '~/domain/behavior/behavior-line-chart-tile';
import { BehaviorPerAgeGroup } from '~/domain/behavior/behavior-per-age-group-tile';
import { BehaviorTableTile } from '~/domain/behavior/behavior-table-tile';
import { BehaviorIdentifier } from '~/domain/behavior/logic/behavior-types';
import { useBehaviorLookupKeys } from '~/domain/behavior/logic/use-behavior-lookup-keys';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { useIntl } from '~/intl';
import { Languages, SiteText } from '~/locale';
import { getArticleParts, getDataExplainedParts, getFaqParts, getPagePartsQuery } from '~/queries/get-page-parts-query';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { createGetContent, getLastGeneratedDate, getLokalizeTexts, selectArchivedNlData } from '~/static-props/get-data';
import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { PageArticlesTile } from '~/components/articles/page-articles-tile';
import { PageFaqTile } from '~/components/page-faq-tile';
import { getPageInformationHeaderContent } from '~/utils/get-page-information-header-content';
import { WarningTile } from '~/components/warning-tile';
import { Box } from '~/components/base/box';
import { InView } from '~/components/in-view';

const pageMetrics = ['behavior_archived_20230411', 'behavior_annotations_archived_20230412', 'behavior_per_age_group_archived_20230411'];

const selectLokalizeTexts = (siteText: SiteText) => ({
  metadataTexts: siteText.pages.topical_page.nl.nationaal_metadata,
  text: siteText.pages.behavior_page,
  textNl: siteText.pages.behavior_page.nl,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  selectArchivedNlData('behavior_archived_20230411', 'behavior_annotations_archived_20230412', 'behavior_per_age_group_archived_20230411'),

  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<PagePartQueryResult<ArticleParts>>(() => getPagePartsQuery('behavior_page'))(context);

    return {
      content: {
        articles: getArticleParts(content.pageParts, 'behaviorPageArticles'),
        faqs: getFaqParts(content.pageParts, 'behaviorPageFAQs'),
        dataExplained: getDataExplainedParts(content.pageParts, 'behaviorPageDataExplained'),
      },
    };
  }
);

export default function BehaviorPage(props: StaticProps<typeof getStaticProps>) {
  const { pageText, selectedArchivedNlData: data, content, lastGenerated } = props;
  const behaviorLastValue = data.behavior_archived_20230411.last_value;
  const behaviorValues = data.behavior_archived_20230411.values;
  const behaviorAnnotations = data.behavior_annotations_archived_20230412;
  const behaviorPerAgeGroup = data.behavior_per_age_group_archived_20230411;

  const { commonTexts, formatNumber, formatDateFromSeconds, formatPercentage, locale } = useIntl();
  const { metadataTexts, text, textNl } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);

  const metadata = {
    ...metadataTexts,
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

    const highestCompliance = list.sort((a, b) => (b.compliancePercentage ?? 0) - (a.compliancePercentage ?? 0))[0];

    const highestSupport = list.sort((a, b) => (b.supportPercentage ?? 0) - (a.supportPercentage ?? 0))[0];

    return { highestCompliance, highestSupport };
  }, [behaviorLastValue, behaviorLookupKeys]);

  const { currentTimelineEvents } = useMemo(() => {
    // Timeline event from the current selected behaviour
    const currentTimelineEvents = behaviorAnnotations.values
      .filter((a) => a.behavior_indicator === currentId)
      .map((event) => ({
        title: event[`message_title_${locale}`],
        description: event[`message_desc_${locale}`],
        start: middleOfDayInSeconds(event.date_start_unix),
        end: middleOfDayInSeconds(event.date_end_unix),
      }));

    return { currentTimelineEvents };
  }, [currentId, behaviorAnnotations.values, locale]);

  const timelineProp = { timelineEvents: currentTimelineEvents };

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);

  const hasActiveWarningTile = !!textNl.belangrijk_bericht;

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList>
          <PageInformationBlock
            category={commonTexts.sidebar.categories.archived_metrics.title}
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
            pageInformationHeader={getPageInformationHeaderContent({
              dataExplained: content.dataExplained,
              faq: content.faqs,
            })}
          />

          {hasActiveWarningTile && <WarningTile isFullWidth message={textNl.belangrijk_bericht} variant="informational" />}

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
                    date_start: formatDateFromSeconds(behaviorLastValue.date_start_unix, 'weekday-long'),
                    date_end: formatDateFromSeconds(behaviorLastValue.date_end_unix, 'weekday-long'),

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
            title={textNl.basisregels.title}
            description={textNl.basisregels.description}
            value={behaviorLastValue}
            annotation={textNl.basisregels.annotation}
            setCurrentId={setCurrentId}
            scrollRef={scrollToRef}
            text={textNl}
            metadata={{
              datumsText: textNl.datums,
              date: behaviorLastValue.date_start_unix,
              source: textNl.bronnen.rivm,
            }}
          />

          <span ref={scrollToRef} />

          <BehaviorLineChartTile
            values={behaviorValues}
            metadata={{
              date: [behaviorLastValue.date_start_unix, behaviorLastValue.date_end_unix],
              source: textNl.bronnen.rivm,
            }}
            {...timelineProp}
            currentId={currentId}
            setCurrentId={setCurrentId}
            text={textNl}
          />

          <BehaviorPerAgeGroup
            title={textNl.tabel_per_leeftijdsgroep.title}
            description={textNl.tabel_per_leeftijdsgroep.description}
            data={behaviorPerAgeGroup}
            currentId={currentId}
            setCurrentId={setCurrentId}
            text={textNl}
            metadata={{
              datumsText: textNl.datums,
              date: behaviorPerAgeGroup.date_start_unix,
              source: textNl.bronnen.rivm,
            }}
          />

          {content.faqs && content.faqs.questions?.length > 0 && <PageFaqTile questions={content.faqs.questions} title={content.faqs.sectionTitle} />}

          {content.articles && content.articles.articles?.length > 0 && (
            <InView rootMargin="400px">
              <PageArticlesTile articles={content.articles.articles} title={content.articles.sectionTitle} />
            </InView>
          )}
        </TileList>
      </NlLayout>
    </Layout>
  );
}
