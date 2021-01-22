import css from '@styled-system/css';
import { useRouter } from 'next/router';
import ArtsIcon from '~/assets/arts.svg';
import GetestIcon from '~/assets/test.svg';
import ZiekenhuisIcon from '~/assets/ziekenhuis.svg';
import { ArticleSummary } from '~/components-styled/article-teaser';
import { Box } from '~/components-styled/base';
import { DataDrivenText } from '~/components-styled/data-driven-text';
import { EscalationMapLegenda } from '~/components-styled/escalation-map-legenda';
import { MaxWidth } from '~/components-styled/max-width';
import { NewsMessage } from '~/components-styled/news-message';
import { QuickLinks } from '~/components-styled/quick-links';
import { TileList } from '~/components-styled/tile-list';
import { Heading } from '~/components-styled/typography';
import { WarningTile } from '~/components-styled/warning-tile';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { escalationTooltip } from '~/components/choropleth/tooltips/region/escalation-tooltip';
import { SEOHead } from '~/components/seoHead';
import { FCWithLayout, getDefaultLayout } from '~/domain/layout/layout';
import { ArticleList } from '~/domain/topical/article-list';
import { Search } from '~/domain/topical/components/search';
import { DataSitemap } from '~/domain/topical/data-sitemap';
import { EscalationLevelExplanations } from '~/domain/topical/escalation-level-explanations';
import { MiniTrendTile } from '~/domain/topical/mini-trend-tile';
import { MiniTrendTileLayout } from '~/domain/topical/mini-trend-tile-layout';
import { TopicalChoroplethContainer } from '~/domain/topical/topical-choropleth-container';
import { TopicalTile } from '~/domain/topical/topical-tile';
import { targetLanguage } from '~/locale';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  createGetContent,
  getLastGeneratedDate,
  getNlData,
  getText,
} from '~/static-props/get-data';
import { colors } from '~/style/theme';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getText,
  createGetChoroplethData({
    vr: ({ escalation_levels, tested_overall }) => ({
      escalation_levels,
      tested_overall,
    }),
    gm: ({ tested_overall }) => ({ tested_overall }),
  }),
  createGetContent<{
    articles: ArticleSummary[];
    highlightedArticle: ArticleSummary;
  }>(
    `{
    'articles': *[_type == 'article'] | order(publicationDate) {"title":title.${targetLanguage}, "slug":slug.${targetLanguage}, "summary":summary.${targetLanguage}, cover}[0..2],
    'highlightedArticle': *[_type == 'topicalPage']{highlightedArticle->{"title":title.${targetLanguage}, "slug":slug.${targetLanguage}, "summary":summary.${targetLanguage}, cover}}[0],
    }`
  ),
  () => {
    const data = getNlData();

    for (const metric of Object.values(data)) {
      if (typeof metric === 'object' && metric !== null) {
        for (const [metricProperty, metricValue] of Object.entries(metric)) {
          if (metricProperty === 'values') {
            (metricValue as {
              values: Array<unknown>;
            }).values = [];
          }
        }
      }
    }

    return data;
  }
);

const Home: FCWithLayout<typeof getStaticProps> = (props) => {
  const { text: siteText, data, choropleth, content } = props;
  const router = useRouter();
  const notificatie = siteText.notificatie;
  const text = siteText.nationaal_actueel;

  const dataInfectedTotal = data.tested_overall;
  const dataHospitalIntake = data.hospital_nice;
  const dataIntake = data.intensive_care_nice;

  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <Box bg="white" pb={4}>
        <MaxWidth px={{ _: 3, sm: 0 }}>
          <TileList>
            <WarningTile
              message={siteText.regionaal_index.belangrijk_bericht}
            />

            <Search />

            <Heading level={1} fontWeight="normal">
              {replaceComponentsInText(text.title, {
                the_netherlands: <strong>{text.the_netherlands}</strong>,
              })}
            </Heading>

            <MiniTrendTileLayout>
              <MiniTrendTile
                title={text.mini_trend_tiles.positief_getest.title}
                text={
                  <DataDrivenText
                    data={data}
                    metricName="tested_overall"
                    metricProperty="infected"
                    differenceKey="tested_overall__infected"
                    valueTexts={
                      text.data_driven_texts.infected_people_total.value
                    }
                    differenceTexts={
                      text.data_driven_texts.infected_people_total.difference
                    }
                  />
                }
                icon={<GetestIcon />}
                trendData={dataInfectedTotal.values}
                metricProperty="infected"
              />

              <MiniTrendTile
                title={text.mini_trend_tiles.ziekenhuis_opnames.title}
                text={
                  <DataDrivenText
                    data={data}
                    metricName="hospital_nice"
                    metricProperty="admissions_on_date_of_reporting"
                    differenceKey="hospital_nice__admissions_on_date_of_reporting"
                    valueTexts={text.data_driven_texts.intake_hospital_ma.value}
                    differenceTexts={
                      text.data_driven_texts.intake_hospital_ma.difference
                    }
                  />
                }
                icon={<ZiekenhuisIcon />}
                trendData={dataHospitalIntake.values}
                metricProperty="admissions_on_date_of_reporting"
              />

              <MiniTrendTile
                title={text.mini_trend_tiles.ic_opnames.title}
                text={
                  <DataDrivenText
                    data={data}
                    metricName="intensive_care_nice"
                    metricProperty="admissions_moving_average"
                    differenceKey="intensive_care_nice__admissions_moving_average"
                    valueTexts={
                      text.data_driven_texts.intake_intensivecare_ma.value
                    }
                    differenceTexts={
                      text.data_driven_texts.intake_intensivecare_ma.difference
                    }
                  />
                }
                icon={<ArtsIcon />}
                trendData={dataIntake.values}
                metricProperty="admissions_moving_average"
              />
            </MiniTrendTileLayout>

            <QuickLinks
              header={text.quick_links.header}
              links={[
                { href: '/landelijk', text: text.quick_links.links.nationaal },
                {
                  href: '/veiligheidsregio',
                  text: text.quick_links.links.veiligheidsregio,
                },
                { href: '/gemeente', text: text.quick_links.links.gemeente },
              ]}
            />

            <NewsMessage
              imageSrc="images/toelichting-afbeelding.png"
              linkText={notificatie.link.text}
              href={notificatie.link.href}
              message={notificatie.bericht}
              publishedAt={notificatie.datum}
              subtitle={notificatie.subtitel}
              title={notificatie.titel}
            />

            <TopicalTile>
              <>
                <TopicalChoroplethContainer
                  title={text.risiconiveaus.selecteer_titel}
                  description={
                    <div
                      dangerouslySetInnerHTML={{
                        __html: text.risiconiveaus.selecteer_toelichting,
                      }}
                    />
                  }
                  legendComponent={
                    <EscalationMapLegenda
                      data={choropleth.vr}
                      metricName="escalation_levels"
                      metricProperty="escalation_level"
                    />
                  }
                >
                  <SafetyRegionChoropleth
                    data={choropleth.vr}
                    metricName="escalation_levels"
                    metricProperty="escalation_level"
                    onSelect={createSelectRegionHandler(router, 'maatregelen')}
                    tooltipContent={escalationTooltip(
                      createSelectRegionHandler(router, 'maatregelen')
                    )}
                  />
                </TopicalChoroplethContainer>
                <Box
                  borderTopWidth="1px"
                  borderTopStyle="solid"
                  borderTopColor={colors.silver}
                  mt={3}
                  mx={-4}
                >
                  <TopicalTile css={css({ mb: 0, pb: 0 })}>
                    <EscalationLevelExplanations />
                  </TopicalTile>
                </Box>
              </>
            </TopicalTile>

            <DataSitemap />

            <ArticleList articleSummaries={content.articles} />
          </TileList>
        </MaxWidth>
      </Box>
    </>
  );
};

Home.getLayout = getDefaultLayout();

export default Home;
