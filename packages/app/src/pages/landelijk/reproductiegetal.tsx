import { getLastFilledValue } from '@corona-dashboard/common';
import Repro from '~/assets/reproductiegetal.svg';
import { ArticleStrip } from '~/components-styled/article-strip';
import { ArticleSummary } from '~/components-styled/article-teaser';
import { Box } from '~/components-styled/base';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiWithIllustrationTile } from '~/components-styled/kpi-with-illustration-tile';
import { Legend } from '~/components-styled/legend';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { PageBarScale } from '~/components-styled/page-barscale';
import { SEOHead } from '~/components-styled/seo-head';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Text } from '~/components-styled/typography';
import { FCWithLayout } from '~/domain/layout/layout';
import { getNationalLayout } from '~/domain/layout/national-layout';
import siteText from '~/locale/index';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  getNlData,
} from '~/static-props/get-data';

const text = siteText.reproductiegetal;
const graphDescriptions = siteText.accessibility.grafieken;

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getNlData,
  createGetContent<{
    articles?: ArticleSummary[];
  }>(createPageArticlesQuery('reproductionPage'))
);

const ReproductionIndex: FCWithLayout<typeof getStaticProps> = (props) => {
  const { data, content } = props;

  const lastFilledValue = getLastFilledValue(data.reproduction);

  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <TileList>
        <ContentHeader
          category={siteText.nationaal_layout.headings.besmettingen}
          screenReaderCategory={siteText.reproductiegetal.titel_sidebar}
          title={text.titel}
          icon={<Repro />}
          subtitle={text.pagina_toelichting}
          metadata={{
            datumsText: text.datums,
            dateOrRange: lastFilledValue.date_unix,
            dateOfInsertionUnix: lastFilledValue.date_of_insertion_unix,
            dataSources: [text.bronnen.rivm],
          }}
          reference={text.reference}
        />

        <ArticleStrip articles={content.articles} />

        <TwoKpiSection>
          <KpiWithIllustrationTile
            title={text.barscale_titel}
            metadata={{
              date: lastFilledValue.date_unix,
              source: text.bronnen.rivm,
              obtained: lastFilledValue.date_of_insertion_unix,
            }}
            illustration={{
              image: '/images/reproductie-explainer.svg',
              alt: text.reproductie_explainer_alt,
              description: text.extra_uitleg,
            }}
          >
            <PageBarScale
              data={data}
              scope="nl"
              metricName="reproduction"
              metricProperty="index_average"
              localeTextKey="reproductiegetal"
              differenceKey="reproduction__index_average"
              differenceFractionDigits={2}
            />
            <Text>{text.barscale_toelichting}</Text>
          </KpiWithIllustrationTile>
        </TwoKpiSection>

        {data.reproduction.values && (
          <LineChartTile
            metadata={{ source: text.bronnen.rivm }}
            title={text.linechart_titel}
            values={data.reproduction.values}
            ariaDescription={graphDescriptions.reproductiegetal_verloop}
            linesConfig={[
              {
                metricProperty: 'index_average',
              },
            ]}
            signaalwaarde={1}
            timeframeOptions={['all', '5weeks']}
            hideFill={true}
            footer={
              <Box pl="30px">
                <Legend
                  items={[
                    {
                      label: text.legenda_r,
                      color: 'data.primary',
                      shape: 'line',
                    },
                  ]}
                />
              </Box>
            }
          />
        )}
      </TileList>
    </>
  );
};

ReproductionIndex.getLayout = getNationalLayout;

export default ReproductionIndex;
