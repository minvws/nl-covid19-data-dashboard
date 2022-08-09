import { Gedrag } from '@corona-dashboard/icons';
import { isEmpty } from 'lodash';
import { GetStaticPropsContext } from 'next';
import { PageInformationBlock, TileList, WarningTile } from '~/components';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { SituationsDataCoverageChoroplethTile } from '~/domain/situations/situations-data-coverage-choropleth-tile';
import { SituationsOverviewChoroplethTile } from '~/domain/situations/situations-overview-choropleth-tile';
import { useIntl } from '~/intl';
import { Languages, SiteText } from '~/locale';
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
  getLokalizeTexts,
} from '~/static-props/get-data';
import { ArticleParts, PagePartQueryResult } from '~/types/cms';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';

const selectLokalizeTexts = (siteText: SiteText) => ({
  caterogyTexts: {
    category: siteText.common.nationaal_layout.headings.besmettingen,
    screenReaderCategory:
      siteText.common.sidebar.metrics.source_investigation.title,
  },
  metadataTexts: siteText.pages.topical_page.nl.nationaal_metadata,
  textShared: siteText.pages.situations_page.shared,
  textChoroplethTooltips: siteText.common.choropleth_tooltip.patients,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) =>
    getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  createGetChoroplethData({
    vr: ({ situations }) => ({
      situations,
    }),
  }),
  async (context: GetStaticPropsContext) => {
    const { content } = await createGetContent<
      PagePartQueryResult<ArticleParts>
    >(() => getPagePartsQuery('situations_page'))(context);

    return {
      content: {
        articles: getArticleParts(content.pageParts, 'situationsPageArticles'),
      },
    };
  }
);

export default function BrononderzoekPage(
  props: StaticProps<typeof getStaticProps>
) {
  const { pageText, choropleth, lastGenerated, content } = props;
  const { caterogyTexts, metadataTexts, textShared, textChoroplethTooltips } =
    useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);
  const { commonTexts } = useIntl();

  const metadata = {
    ...metadataTexts,
    title: textShared.metadata.title,
    description: textShared.metadata.description,
  };

  const singleValue = choropleth.vr.situations[0];

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout>
        <TileList>
          <PageInformationBlock
            category={commonTexts.nationaal_layout.headings.archief}
            screenReaderCategory={caterogyTexts.screenReaderCategory}
            title={textShared.titel}
            icon={<Gedrag />}
            description={textShared.pagina_toelichting}
            metadata={{
              datumsText: textShared.datums,
              dateOrRange: {
                start: singleValue.date_start_unix,
                end: singleValue.date_end_unix,
              },
              dateOfInsertionUnix: singleValue.date_of_insertion_unix,
              dataSources: [textShared.bronnen.rivm],
            }}
            referenceLink={textShared.reference.href}
            articles={content.articles}
          />

          {textShared.belangrijk_bericht &&
            !isEmpty(textShared.belangrijk_bericht) && (
              <WarningTile
                isFullWidth
                message={textShared.belangrijk_bericht}
                variant="emphasis"
              />
            )}

          <SituationsDataCoverageChoroplethTile
            data={choropleth.vr}
            text={textShared}
            tooltipText={textChoroplethTooltips}
          />

          <SituationsOverviewChoroplethTile
            data={choropleth.vr.situations}
            text={textShared}
          />
        </TileList>
      </NlLayout>
    </Layout>
  );
}
