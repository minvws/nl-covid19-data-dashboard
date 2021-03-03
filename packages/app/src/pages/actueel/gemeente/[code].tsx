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
  getGmData,
  getLastGeneratedDate,
  getText,
} from '~/static-props/get-data';
import { colors } from '~/style/theme';
import { assert } from '~/utils/assert';
import { getSafetyRegionForMunicipalityCode } from '~/utils/getSafetyRegionForMunicipalityCode';
import { Link } from '~/utils/link';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
export { getStaticPaths } from '~/static-paths/gm';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getText,
  getGmData,
  createGetChoroplethData({
    vr: ({ escalation_levels }) => ({ escalation_levels }),
  }),
  createGetContent<{
    articles: ArticleSummary[];
    editorial: EditorialSummary;
    highlight: HighlightTeaserProps;
  }>(topicalPageQuery)
);

const TopicalMunicipality: FCWithLayout<typeof getStaticProps> = (props) => {
  const { text: siteText, municipalityName, choropleth, data, content } = props;
  const router = useRouter();
  const text = siteText.gemeente_actueel;
  const gmCode = router.query.code;

  const safetyRegionForMunicipality =
    typeof gmCode === 'string'
      ? getSafetyRegionForMunicipalityCode(gmCode)
      : undefined;

  const dataInfectedTotal = data.tested_overall;
  const dataHospitalIntake = data.hospital_nice;
  const escalationText = siteText.escalatie_niveau;

  const filteredRegion = props.choropleth.vr.escalation_levels.find(
    (item) => item.vrcode === safetyRegionForMunicipality?.code
  );

  assert(
    filteredRegion && filteredRegion.level,
    `Could not find a "vrcode" to match with the region: ${safetyRegionForMunicipality?.code} to get the the current "level" of it.`
  );

  return (
    <>
      <SEOHead
        title={replaceVariablesInText(text.metadata.title, {
          municipalityName,
        })}
        description={replaceVariablesInText(text.metadata.description, {
          municipalityName,
        })}
      />
      <Box bg="white" pb={4}>
        <MaxWidth>
          <TileList>
            <TopicalSectionHeader
              showBackLink
              lastGenerated={Number(props.lastGenerated)}
              title={replaceComponentsInText(text.title, {
                municipalityName: municipalityName,
              })}
              link={
                typeof gmCode === 'string'
                  ? {
                      text: replaceVariablesInText(
                        text.secties.actuele_situatie.link.text,
                        {
                          municipalityName: municipalityName,
                        }
                      ),
                      href: replaceVariablesInText(
                        text.secties.actuele_situatie.link.href,
                        { gmCode }
                      ),
                    }
                  : undefined
              }
            />
            <WarningTile
              message={siteText.regionaal_index.belangrijk_bericht}
              variant="emphasis"
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
                href={`/gemeente/${router.query.code}/positief-geteste-mensen`}
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
                href={`/gemeente/${router.query.code}/ziekenhuis-opnames`}
              />

              <RiskLevelIndicator
                title={text.risoconiveau_maatregelen.title}
                description={text.risoconiveau_maatregelen.description}
                level={filteredRegion.level}
                code={filteredRegion.vrcode}
                escalationTypes={escalationText.types}
                href={`/veiligheidsregio/${safetyRegionForMunicipality?.code}/maatregelen`}
              >
                {safetyRegionForMunicipality && (
                  <>
                    {siteText.common.vr_singular}:
                    <br />
                    <Link
                      href={`/actueel/veiligheidsregio/${safetyRegionForMunicipality.code}`}
                    >
                      <a>{safetyRegionForMunicipality.name}</a>
                    </Link>
                  </>
                )}
              </RiskLevelIndicator>
            </MiniTrendTileLayout>

            <QuickLinks
              header={text.quick_links.header}
              links={[
                {
                  href: '/landelijk/vaccinaties',
                  text: text.quick_links.links.nationaal,
                },
                safetyRegionForMunicipality
                  ? {
                      href: `/veiligheidsregio/${safetyRegionForMunicipality.code}/positief-geteste-mensen`,
                      text: replaceVariablesInText(
                        text.quick_links.links.veiligheidsregio,
                        { safetyRegionName: safetyRegionForMunicipality.name }
                      ),
                    }
                  : {
                      href: '/veiligheidsregio',
                      text: text.quick_links.links.veiligheidsregio_fallback,
                    },
                {
                  href: `/gemeente/${router.query.code}/positief-geteste-mensen`,
                  text: replaceVariablesInText(
                    text.quick_links.links.gemeente,
                    {
                      municipalityName: municipalityName,
                    }
                  ),
                },
              ]}
            />

            {content.editorial && content.highlight && (
              <>
                <TopicalSectionHeader
                  title={siteText.common_actueel.secties.artikelen.titel}
                  link={siteText.common_actueel.secties.artikelen.link}
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
                    tooltipContent={escalationTooltip(
                      createSelectRegionHandler(router, 'risiconiveau')
                    )}
                    highlightCode={safetyRegionForMunicipality?.code}
                  />
                </TopicalChoroplethContainer>
              </TopicalTile>
              <Box
                borderTopWidth="1px"
                borderTopStyle="solid"
                borderTopColor={colors.silver}
                mx={{ _: -3, md: 0 }}
              />
              <TopicalTile py={0}>
                <Box mx={-3}>
                  <EscalationLevelExplanations />
                </Box>
              </TopicalTile>
            </Box>

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

            <DataSitemap />
          </TileList>
        </MaxWidth>
      </Box>
    </>
  );
};

TopicalMunicipality.getLayout = getDefaultLayout();

export default TopicalMunicipality;
