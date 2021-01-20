import { useRouter } from 'next/router';
import GetestIcon from '~/assets/test.svg';
import ZiekenhuisIcon from '~/assets/ziekenhuis.svg';
import { Box } from '~/components-styled/base';
import { DataDrivenText } from '~/components-styled/data-driven-text';
import { EscalationMapLegenda } from '~/components-styled/escalation-map-legenda';
import { MaxWidth } from '~/components-styled/max-width';
import { WarningMessage } from '~/components-styled/warning-message';
import { QuickLinks } from '~/components-styled/quick-links';
import { TileList } from '~/components-styled/tile-list';
import { Heading } from '~/components-styled/typography';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { escalationTooltip } from '~/components/choropleth/tooltips/region/escalation-tooltip';
import { SEOHead } from '~/components/seoHead';
import { FCWithLayout, getDefaultLayout } from '~/domain/layout/layout';
import { Search } from '~/domain/topical/components/search';
import { DataSitemap } from '~/domain/topical/data-sitemap';
import { EscalationLevelExplanations } from '~/domain/topical/escalation-level-explanations';
import { MiniTrendTile } from '~/domain/topical/mini-trend-tile';
import { MiniTrendTileLayout } from '~/domain/topical/mini-trend-tile-layout';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  getLastGeneratedDate,
  getText,
  getVrData,
} from '~/static-props/get-data';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';

export { getStaticPaths } from '~/static-paths/vr';
import { RiskLevelIndicator } from '~/components-styled/risk-level-indicator';
import { assert } from '~/utils/assert';
import { TopicalChoroplethContainer } from '~/domain/topical/topical-choropleth-container';
import { TopicalTile } from '~/domain/topical/topical-tile';
import css from '@styled-system/css';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getText,
  getVrData,
  createGetChoroplethData({
    vr: ({ escalation_levels }) => ({ escalation_levels }),
  })
);

const SafetyRegionActueel: FCWithLayout<typeof getStaticProps> = (props) => {
  const { text: siteText, choropleth, data } = props;
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
        <MaxWidth>
          <TileList>
            <WarningMessage
              message={siteText.regionaal_index.belangrijk_bericht}
            />

            <Search initialValue={props.safetyRegionName} />

            <Heading level={1} fontWeight="normal">
              {replaceComponentsInText(text.title, {
                safetyRegionName: <strong>{props.safetyRegionName}</strong>,
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
            </MiniTrendTileLayout>

            <RiskLevelIndicator
              title={text.risoconiveau_maatregelen.title}
              description={text.risoconiveau_maatregelen.description}
              link={{
                title: text.risoconiveau_maatregelen.bekijk_href,
                href: `/veiligheidsregio/${regionCode}/maatregelen`,
              }}
              escalationLevel={filteredRegion.escalation_level}
              code={filteredRegion.vrcode}
              escalationTypes={escalationText.types}
            />

            <QuickLinks
              header={text.quick_links.header}
              links={[
                { href: '/landelijk', text: text.quick_links.links.nationaal },
                {
                  href: `/veiligheidsregio/${router.query.code}/positief-geteste-mensen`,
                  text: replaceVariablesInText(
                    text.quick_links.links.veiligheidsregio,
                    { safetyRegionName: props.safetyRegionName }
                  ),
                },
                { href: '/gemeentes', text: text.quick_links.links.gemeente },
              ]}
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
                  borderTopColor="gray"
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
          </TileList>
        </MaxWidth>
      </Box>
    </>
  );
};

SafetyRegionActueel.getLayout = getDefaultLayout();

export default SafetyRegionActueel;
