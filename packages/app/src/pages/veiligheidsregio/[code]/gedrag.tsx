import { VrBehaviorValue } from '@corona-dashboard/common';
import { Gedrag } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { useRef, useState } from 'react';
import { Markdown } from '~/components/markdown';
import { PageInformationBlock } from '~/components/page-information-block';
import { Tile } from '~/components/tile';
import { TileList } from '~/components/tile-list';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Heading, InlineText, Text } from '~/components/typography';
import {
  BehaviorLineChartTile,
  getBehaviorChartOptions,
} from '~/domain/behavior/behavior-line-chart-tile';
import { BehaviorTableTile } from '~/domain/behavior/behavior-table-tile';
import { MoreInformation } from '~/domain/behavior/components/more-information';
import { BehaviorIdentifier } from '~/domain/behavior/logic/behavior-types';
import { Layout } from '~/domain/layout/layout';
import { VrLayout } from '~/domain/layout/vr-layout';
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
  createGetContent,
  getLastGeneratedDate,
  selectVrData,
  getLokalizeTexts,
} from '~/static-props/get-data';
import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) =>
    getLokalizeTexts(
      (siteText) => ({
        textVr: siteText.pages.behaviorPage.vr,
      }),
      locale
    ),
  getLastGeneratedDate,
  (context) => {
    const data = selectVrData('behavior')(context);
    const chartBehaviorOptions = getBehaviorChartOptions<VrBehaviorValue>(
      data.selectedVrData.behavior.values[0]
    );

    return { ...data, chartBehaviorOptions };
  },
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

export default function BehaviorPageVr(
  props: StaticProps<typeof getStaticProps>
) {
  const {
    pageText,
    lastGenerated,
    content,
    selectedVrData: data,
    vrName,
    chartBehaviorOptions,
  } = props;

  const { siteText, formatDateFromSeconds, formatNumber } = useIntl();
  const { textVr } = pageText;

  const metadata = {
    ...siteText.veiligheidsregio_index.metadata,
    title: textVr.metadata.title,
    description: textVr.metadata.description,
  };

  const behaviorLastValue = data.behavior.last_value;

  const [currentId, setCurrentId] = useState<BehaviorIdentifier>(
    chartBehaviorOptions[0]
  );
  const scrollToRef = useRef<HTMLDivElement>(null);

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <VrLayout vrName={vrName}>
        <TileList>
          <PageInformationBlock
            category={siteText.nationaal_layout.headings.gedrag}
            title={textVr.pagina.titel}
            icon={<Gedrag />}
            description={textVr.pagina.toelichting}
            metadata={{
              datumsText: textVr.datums,
              dateOrRange: {
                start: behaviorLastValue.date_start_unix,
                end: behaviorLastValue.date_end_unix,
              },
              dateOfInsertionUnix: behaviorLastValue.date_of_insertion_unix,
              dataSources: [textVr.bronnen.rivm],
            }}
            referenceLink={textVr.reference.href}
            articles={content.articles}
            vrNameOrGmName={vrName}
            warning={textVr.warning}
          />

          <TwoKpiSection>
            <Tile>
              <Heading level={3}>{textVr.onderzoek_uitleg.titel}</Heading>
              <Markdown content={textVr.onderzoek_uitleg.toelichting} />
            </Tile>
            <Tile height="100%">
              <Heading level={3}>{textVr.kpi.titel}</Heading>
              <Text>
                {replaceComponentsInText(textVr.kpi.deelgenomen_mensen, {
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

          <BehaviorTableTile
            title={textVr.basisregels.title}
            description={textVr.basisregels.description}
            complianceExplanation={textVr.basisregels.volgen_beschrijving}
            supportExplanation={textVr.basisregels.steunen_beschrijving}
            value={behaviorLastValue}
            annotation={textVr.basisregels.annotatie}
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
              source: textVr.bronnen.rivm,
            }}
            currentId={currentId}
            setCurrentId={setCurrentId}
            behaviorOptions={chartBehaviorOptions}
          />

          <MoreInformation />
        </TileList>
      </VrLayout>
    </Layout>
  );
}
