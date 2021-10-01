import { NlBehaviorValue } from '@corona-dashboard/common';
import { useRef, useState } from 'react';
import { Gedrag } from '@corona-dashboard/icons';
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
import {
  createPageArticlesQuery,
  PageArticlesQueryResult,
} from '~/queries/create-page-articles-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  selectVrData,
} from '~/static-props/get-data';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { Markdown } from '~/components/markdown';

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<PageArticlesQueryResult>((context) => {
    const { locale } = context;
    return createPageArticlesQuery('behaviorPage', locale);
  }),
  (context) => {
    const data = selectVrData('behavior')(context);
    const chartBehaviorOptions = getBehaviorChartOptions<NlBehaviorValue>(
      data.selectedVrData.behavior.values[0]
    );

    return { ...data, chartBehaviorOptions };
  }
);

export default function BehaviorPageVr(
  props: StaticProps<typeof getStaticProps>
) {
  const {
    lastGenerated,
    content,
    selectedVrData: data,
    vrName,
    chartBehaviorOptions,
  } = props;

  const { siteText, formatDateFromSeconds, formatNumber } = useIntl();

  const text = siteText.regionaal_gedrag;

  const metadata = {
    ...siteText.veiligheidsregio_index.metadata,
    title: text.metadata.title,
    description: text.metadata.description,
  };

  const { regionaal_gedrag } = siteText;
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
            title={regionaal_gedrag.pagina.titel}
            icon={<Gedrag />}
            description={regionaal_gedrag.pagina.toelichting}
            metadata={{
              datumsText: regionaal_gedrag.datums,
              dateOrRange: {
                start: behaviorLastValue.date_start_unix,
                end: behaviorLastValue.date_end_unix,
              },
              dateOfInsertionUnix: behaviorLastValue.date_of_insertion_unix,
              dataSources: [regionaal_gedrag.bronnen.rivm],
            }}
            referenceLink={regionaal_gedrag.reference.href}
            articles={content.articles}
          />

          <TwoKpiSection>
            <Tile>
              <Heading level={3}>
                {regionaal_gedrag.onderzoek_uitleg.titel}
              </Heading>
              <Markdown
                content={regionaal_gedrag.onderzoek_uitleg.toelichting}
              />
            </Tile>
            <Tile height="100%">
              <Heading level={3}>{regionaal_gedrag.kpi.titel}</Heading>
              <Text>
                {replaceComponentsInText(
                  regionaal_gedrag.kpi.deelgenomen_mensen,
                  {
                    number_of_participants: (
                      <InlineText fontWeight="bold">
                        {formatNumber(behaviorLastValue.number_of_participants)}
                      </InlineText>
                    ),
                    date_start: (
                      <InlineText>
                        {formatDateFromSeconds(
                          behaviorLastValue.date_start_unix
                        )}
                      </InlineText>
                    ),
                    date_end: (
                      <InlineText>
                        {formatDateFromSeconds(behaviorLastValue.date_end_unix)}
                      </InlineText>
                    ),
                  }
                )}
              </Text>
            </Tile>
          </TwoKpiSection>

          <BehaviorTableTile
            title={regionaal_gedrag.basisregels.title}
            description={regionaal_gedrag.basisregels.description}
            complianceExplanation={
              regionaal_gedrag.basisregels.volgen_beschrijving
            }
            supportExplanation={
              regionaal_gedrag.basisregels.steunen_beschrijving
            }
            value={behaviorLastValue}
            annotation={regionaal_gedrag.basisregels.annotatie}
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
              source: regionaal_gedrag.bronnen.rivm,
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
