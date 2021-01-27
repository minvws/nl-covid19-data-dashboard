import { useRouter } from 'next/router';
import GetestIcon from '~/assets/test.svg';
import ZiekenhuisIcon from '~/assets/ziekenhuis.svg';
import { ArticleSummary } from '~/components-styled/article-teaser';
import { Box } from '~/components-styled/base';
import { DataDrivenText } from '~/components-styled/data-driven-text';
import { EscalationMapLegenda } from '~/components-styled/escalation-map-legenda';
import { MaxWidth } from '~/components-styled/max-width';
import { QuickLinks } from '~/components-styled/quick-links';
import { RiskLevelIndicator } from '~/components-styled/risk-level-indicator';
import { SEOHead } from '~/components-styled/seo-head';
import { TileList } from '~/components-styled/tile-list';
import { WarningTile } from '~/components-styled/warning-tile';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { escalationTooltip } from '~/components/choropleth/tooltips/region/escalation-tooltip';
import { FCWithLayout, getDefaultLayout } from '~/domain/layout/layout';
import { DataSitemap } from '~/domain/topical/data-sitemap';
import { EditorialSummary } from '~/domain/topical/editorial-teaser';
import { EditorialTile } from '~/domain/topical/editorial-tile';
import { EscalationLevelExplanations } from '~/domain/topical/escalation-level-explanations';
import { MiniTrendTile } from '~/domain/topical/mini-trend-tile';
import { MiniTrendTileLayout } from '~/domain/topical/mini-trend-tile-layout';
import { TopicalChoroplethContainer } from '~/domain/topical/topical-choropleth-container';
import { TopicalPageHeader } from '~/domain/topical/topical-page-header';
import { TopicalTile } from '~/domain/topical/topical-tile';
import { targetLanguage } from '~/locale';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  createGetContent,
  getLastGeneratedDate,
  getText,
  getVrData,
} from '~/static-props/get-data';
import { assert } from '~/utils/assert';
import { Link } from '~/utils/link';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getText,
  getVrData,
  createGetChoroplethData({
    vr: ({ escalation_levels }) => ({ escalation_levels }),
  }),
  createGetContent<{
    editorial: EditorialSummary;
    highlight: { article: ArticleSummary };
  }>(
    `{
    // Retrieve the latest 3 articles with the highlighted article filtered out:
    'editorial': *[_type == 'editorial'] | order(publicationDate) {"title":title.${targetLanguage}, slug, "summary":summary.${targetLanguage}, cover}[0],
    'highlight': *[_type == 'topicalPage']{"article":highlightedArticle->{"title":title.${targetLanguage}, slug, "summary":summary.${targetLanguage}, cover}}[0],
    }`
  )
);

const TopicalSafetyRegion: FCWithLayout<typeof getStaticProps> = (props) => {
  const { text: siteText, choropleth, data, content } = props;
  const router = useRouter();
  const text = siteText.veiligheidsregio_actueel;
  const escalationText = siteText.escalatie_niveau;

  const regionCode = router.query.code;

  const filteredRegion = props.choropleth.vr.escalation_levels.find(
    (item) => item.vrcode === regionCode
  );

  assert(
    filteredRegion,
    `Could not find a "vrcode" to match with the region: ${regionCode} to get the the current "escalation_level" of it.`
  );

  const dataInfectedTotal = data.tested_overall;
  const dataHospitalIntake = data.hospital_nice;

  return (
    <>
      <SEOHead
        title={replaceVariablesInText(text.metadata.title, {
          safetyRegionName: props.safetyRegionName,
        })}
        description={replaceVariablesInText(text.metadata.description, {
          safetyRegionName: props.safetyRegionName,
        })}
      />
      <Box bg="white" pb={4}>
        <MaxWidth px={{ _: 3, sm: 0 }}>
          <TileList>
            <WarningTile
              message={siteText.regionaal_index.belangrijk_bericht}
            />

            <TopicalPageHeader
              showBackLink
              lastGenerated={Number(props.lastGenerated)}
              title={replaceComponentsInText(text.title, {
                safetyRegionName: <strong>{props.safetyRegionName}</strong>,
              })}
            />

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

              <RiskLevelIndicator
                title={text.risoconiveau_maatregelen.title}
                description={text.risoconiveau_maatregelen.description}
                escalationLevel={filteredRegion.escalation_level}
                code={filteredRegion.vrcode}
                escalationTypes={escalationText.types}
              >
                <Link href={`/veiligheidsregio/${regionCode}/maatregelen`}>
                  <a>{text.risoconiveau_maatregelen.bekijk_href}</a>
                </Link>
              </RiskLevelIndicator>
            </MiniTrendTileLayout>

            <QuickLinks
              header={text.quick_links.header}
              links={[
                {
                  href: '/landelijk/vaccinaties',
                  text: text.quick_links.links.nationaal,
                },
                {
                  href: `/veiligheidsregio/${router.query.code}/positief-geteste-mensen`,
                  text: replaceVariablesInText(
                    text.quick_links.links.veiligheidsregio,
                    { safetyRegionName: props.safetyRegionName }
                  ),
                },
                { href: '/gemeente', text: text.quick_links.links.gemeente },
              ]}
            />

            {content.editorial && content.highlight?.article && (
              <EditorialTile
                editorial={content.editorial}
                highlightedArticle={content.highlight.article}
              />
            )}

            <Box>
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
                      onSelect={createSelectRegionHandler(router, 'actueel')}
                      tooltipContent={escalationTooltip(
                        createSelectRegionHandler(router, 'actueel')
                      )}
                    />
                  </TopicalChoroplethContainer>
                </>
              </TopicalTile>
              <Box
                borderTopWidth="1px"
                borderTopStyle="solid"
                borderTopColor="silver"
                mx={{ _: -3, md: 0 }}
              />
              <TopicalTile>
                <Box mx={-3}>
                  <EscalationLevelExplanations />
                </Box>
              </TopicalTile>
            </Box>

            <DataSitemap />
          </TileList>
        </MaxWidth>
      </Box>
    </>
  );
};

TopicalSafetyRegion.getLayout = getDefaultLayout();

export default TopicalSafetyRegion;
