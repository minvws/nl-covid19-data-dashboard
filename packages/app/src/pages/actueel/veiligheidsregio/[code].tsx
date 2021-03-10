import { useRouter } from 'next/router';
import GetestIcon from '~/assets/test.svg';
import ZiekenhuisIcon from '~/assets/ziekenhuis.svg';
import { ArticleSummary } from '~/components-styled/article-teaser';
import { Box } from '~/components-styled/base';
import { DataDrivenText } from '~/components-styled/data-driven-text';
import { EscalationMapLegenda } from '~/components-styled/escalation-map-legenda';
import { HighlightTeaserProps } from '~/components-styled/highlight-teaser';
import { MaxWidth } from '~/components-styled/max-width';
import { QuickLinks } from '~/components-styled/quick-links';
import { RiskLevelIndicator } from '~/components-styled/risk-level-indicator';
import { SEOHead } from '~/components-styled/seo-head';
import { TileList } from '~/components-styled/tile-list';
import { Heading } from '~/components-styled/typography';
import { VisuallyHidden } from '~/components-styled/visually-hidden';
import { WarningTile } from '~/components-styled/warning-tile';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { escalationTooltip } from '~/components/choropleth/tooltips/region/escalation-tooltip';
import { FCWithLayout, getDefaultLayout } from '~/domain/layout/layout';
import { ArticleList } from '~/domain/topical/article-list';
import { DataSitemap } from '~/domain/topical/data-sitemap';
import { EditorialSummary } from '~/domain/topical/editorial-teaser';
import { EditorialTile } from '~/domain/topical/editorial-tile';
import { EscalationLevelExplanations } from '~/domain/topical/escalation-level-explanations';
import { MiniTrendTile } from '~/domain/topical/mini-trend-tile';
import { MiniTrendTileLayout } from '~/domain/topical/mini-trend-tile-layout';
import { TopicalChoroplethContainer } from '~/domain/topical/topical-choropleth-container';
import { TopicalSectionHeader } from '~/domain/topical/topical-section-header';
import { TopicalTile } from '~/domain/topical/topical-tile';
import { topicalPageQuery } from '~/queries/topical-page-query';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  createGetContent,
  getLastGeneratedDate,
  getText,
  getVrData,
} from '~/static-props/get-data';
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
    articles: ArticleSummary[];
    editorial: EditorialSummary;
    highlight: HighlightTeaserProps;
  }>(topicalPageQuery)
);

const TopicalSafetyRegion: FCWithLayout<typeof getStaticProps> = (props) => {
  const { text: siteText, choropleth, data, content } = props;
  const router = useRouter();
  const text = siteText.veiligheidsregio_actueel;
  const escalationText = siteText.escalatie_niveau;
  const vrCode = router.query.code as string;

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
        {/**
         * Since now the sections have a H2 heading I think we need to include
         * a hidden H1 here.
         *
         * @TODO figure out what the title should be
         */}
        <VisuallyHidden>
          <Heading level={1}>
            {replaceComponentsInText(text.title, {
              safetyRegionName: props.safetyRegionName,
            })}
          </Heading>
        </VisuallyHidden>

        <MaxWidth id="content">
          <TileList>
            <TopicalSectionHeader
              showBackLink
              lastGenerated={Number(props.lastGenerated)}
              title={replaceComponentsInText(
                text.secties.actuele_situatie.titel,
                {
                  safetyRegionName: props.safetyRegionName,
                }
              )}
              link={{
                text: replaceVariablesInText(
                  text.secties.actuele_situatie.link.text,
                  {
                    safetyRegionName: props.safetyRegionName,
                  }
                ),
                href: replaceVariablesInText(
                  text.secties.actuele_situatie.link.href,
                  { vrCode }
                ),
              }}
            />

            <WarningTile
              message={siteText.regionaal_index.belangrijk_bericht}
              variant="emphasis"
            />

            <MiniTrendTileLayout id="metric-navigation">
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
                href={`/veiligheidsregio/${router.query.code}/positief-geteste-mensen`}
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
                href={`/veiligheidsregio/${router.query.code}/ziekenhuis-opnames`}
              />

              <RiskLevelIndicator
                title={text.risoconiveau_maatregelen.title}
                description={text.risoconiveau_maatregelen.description}
                level={data.escalation_level.level}
                code={data.code}
                escalationTypes={escalationText.types}
                href={`/veiligheidsregio/${router.query.code}/risiconiveau`}
              >
                <Link href={`/veiligheidsregio/${vrCode}/maatregelen`}>
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

            {content.editorial && content.highlight && (
              <>
                <TopicalSectionHeader
                  title={siteText.common_actueel.secties.artikelen.titel}
                />
                <EditorialTile
                  editorial={content.editorial}
                  highlight={content.highlight}
                />
              </>
            )}

            <Box pb={4}>
              <TopicalSectionHeader
                title={siteText.common_actueel.secties.risicokaart.titel}
              />
              <TopicalTile>
                <TopicalChoroplethContainer
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
                      metricProperty="level"
                    />
                  }
                >
                  <SafetyRegionChoropleth
                    data={choropleth.vr}
                    metricName="escalation_levels"
                    metricProperty="level"
                    onSelect={createSelectRegionHandler(router, 'risiconiveau')}
                    highlightCode={`${vrCode}`}
                    tooltipContent={escalationTooltip(
                      createSelectRegionHandler(router, 'risiconiveau')
                    )}
                  />
                </TopicalChoroplethContainer>
              </TopicalTile>
              <Box
                borderTopWidth="1px"
                borderTopStyle="solid"
                borderTopColor="silver"
                mx={{ _: -3, md: 0 }}
              />
              <TopicalTile py={0}>
                <Box mx={-3}>
                  <EscalationLevelExplanations />
                </Box>
              </TopicalTile>
            </Box>

            <DataSitemap />

            <Box pb={4}>
              <TopicalSectionHeader
                title={siteText.common_actueel.secties.meer_lezen.titel}
                description={
                  siteText.common_actueel.secties.meer_lezen.omschrijving
                }
                link={siteText.common_actueel.secties.meer_lezen.link}
              />
              <ArticleList articleSummaries={content.articles} />
            </Box>
          </TileList>
        </MaxWidth>
      </Box>
    </>
  );
};

TopicalSafetyRegion.getLayout = getDefaultLayout();

export default TopicalSafetyRegion;
