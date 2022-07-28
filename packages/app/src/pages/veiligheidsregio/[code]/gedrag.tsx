import { VrBehaviorValue } from '@corona-dashboard/common';
import { Gedrag } from '@corona-dashboard/icons';
import { GetStaticPropsContext } from 'next';
import { useRef, useState } from 'react';
import { Markdown } from '~/components/markdown';
import { PageInformationBlock } from '~/components/page-information-block';
import { Tile } from '~/components/tile';
import { TileList } from '~/components/tile-list';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Heading, InlineText, Text, BoldText } from '~/components/typography';
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

import { getLastInsertionDateOfPage } from '~/utils/get-last-insertion-date-of-page';

const pageMetrics = ['behavior'];

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) =>
    getLokalizeTexts(
      (siteText) => ({
        text: siteText.pages.behavior_page,
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
    >(() => getPagePartsQuery('behavior_page'))(context);

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

  const { commonTexts, formatDateFromSeconds, formatNumber } = useIntl();
  const { text } = pageText;

  const metadata = {
    ...commonTexts.veiligheidsregio_index.metadata,
    title: text.vr.metadata.title,
    description: text.vr.metadata.description,
  };

  const behaviorLastValue = data.behavior.last_value;

  const [currentId, setCurrentId] = useState<BehaviorIdentifier>(
    chartBehaviorOptions[0]
  );
  const scrollToRef = useRef<HTMLDivElement>(null);

  const lastInsertionDateOfPage = getLastInsertionDateOfPage(data, pageMetrics);

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <VrLayout vrName={vrName}>
        <TileList>
          <PageInformationBlock
            category={commonTexts.nationaal_layout.headings.gedrag}
            title={text.vr.pagina.titel}
            icon={<Gedrag />}
            description={text.vr.pagina.toelichting}
            metadata={{
              datumsText: text.vr.datums,
              dateOrRange: {
                start: behaviorLastValue.date_start_unix,
                end: behaviorLastValue.date_end_unix,
              },
              dateOfInsertionUnix: lastInsertionDateOfPage,
              dataSources: [text.vr.bronnen.rivm],
            }}
            referenceLink={text.vr.reference.href}
            articles={content.articles}
            vrNameOrGmName={vrName}
            warning={text.vr.warning}
          />

          <TwoKpiSection>
            <Tile>
              <Heading level={3}>{text.vr.onderzoek_uitleg.titel}</Heading>
              <Markdown content={text.vr.onderzoek_uitleg.toelichting} />
            </Tile>
            <Tile height="100%">
              <Heading level={3}>{text.vr.kpi.titel}</Heading>
              <Text>
                {replaceComponentsInText(text.vr.kpi.deelgenomen_mensen, {
                  number_of_participants: (
                    <BoldText>
                      {formatNumber(behaviorLastValue.number_of_participants)}
                    </BoldText>
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
            title={text.vr.basisregels.title}
            description={text.vr.basisregels.description}
            complianceExplanation={text.vr.basisregels.volgen_beschrijving}
            supportExplanation={text.vr.basisregels.steunen_beschrijving}
            value={behaviorLastValue}
            annotation={text.vr.basisregels.annotatie}
            setCurrentId={setCurrentId}
            scrollRef={scrollToRef}
            text={text.shared}
          />

          <span ref={scrollToRef} />
          <BehaviorLineChartTile
            values={data.behavior.values}
            metadata={{
              date: [
                behaviorLastValue.date_start_unix,
                behaviorLastValue.date_end_unix,
              ],
              source: text.vr.bronnen.rivm,
            }}
            currentId={currentId}
            setCurrentId={setCurrentId}
            behaviorOptions={chartBehaviorOptions}
            text={text}
          />

          <MoreInformation text={text.shared.meer_onderzoeksresultaten} />
        </TileList>
      </VrLayout>
    </Layout>
  );
}
