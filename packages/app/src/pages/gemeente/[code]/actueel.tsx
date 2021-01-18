import { useRouter } from 'next/router';
import GetestIcon from '~/assets/test.svg';
import ZiekenhuisIcon from '~/assets/ziekenhuis.svg';
import { Box } from '~/components-styled/base';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { DataDrivenText } from '~/components-styled/data-driven-text';
import { EscalationMapLegenda } from '~/components-styled/escalation-map-legenda';
import { MaxWidth } from '~/components-styled/max-width';
import { MessageTile } from '~/components-styled/message-tile';
import { QuickLinks } from '~/components-styled/quick-links';
import { TileList } from '~/components-styled/tile-list';
import { Heading } from '~/components-styled/typography';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { escalationTooltip } from '~/components/choropleth/tooltips/region/escalation-tooltip';
import { FCWithLayout, getLayoutWithMetadata } from '~/domain/layout/layout';
import { Search } from '~/domain/topical/components/search';
import { DataSitemap } from '~/domain/topical/data-site-map';
import { EscalationLevelExplanationsTile } from '~/domain/topical/escalation-level-explanations-tile';
import { MiniTrendTile } from '~/domain/topical/mini-trend-tile';
import { MiniTrendTileLayout } from '~/domain/topical/mini-trend-tile-layout';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  getGmData,
  getLastGeneratedDate,
  getText,
} from '~/static-props/get-data';
import { getSafetyRegionForMunicipalityCode } from '~/utils/getSafetyRegionForMunicipalityCode';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

export { getStaticPaths } from '~/static-paths/gm';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getText,
  getGmData,
  createGetChoroplethData({
    vr: ({ escalation_levels }) => ({ escalation_levels }),
  })
);

const MunicipalityActueel: FCWithLayout<typeof getStaticProps> = (props) => {
  const { text: siteText, municipalityName, choropleth, data } = props;
  const router = useRouter();
  const text = siteText.gemeente_actueel;
  const safetyRegionForMunicipality =
    typeof router.query.code === 'string'
      ? getSafetyRegionForMunicipalityCode(router.query.code)
      : undefined;

  const dataInfectedTotal = data.tested_overall;
  const dataHospitalIntake = data.hospital_nice;

  return (
    <Box bg="white" pb={4}>
      <MaxWidth>
        <TileList>
          <MessageTile message={siteText.regionaal_index.belangrijk_bericht} />

          <Search />

          <Heading level={1} fontWeight="normal">
            De actuele situatie in <strong>{municipalityName}</strong>
          </Heading>

          <MiniTrendTileLayout>
            <MiniTrendTile
              title={text.mini_trend_tiles.positief_getest.title}
              text={
                <DataDrivenText
                  data={data}
                  metricName="tested_overall"
                  metricProperty="infected_per_100k"
                  differenceKey="tested_overall__infected_per_100k"
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
              metricProperty="infected_per_100k"
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
            {/* 
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
            /> */}
          </MiniTrendTileLayout>

          <QuickLinks
            header={text.quick_links.header}
            links={[
              { href: '/landelijk', text: text.quick_links.links.nationaal },
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
                href: '/gemeentes',
                text: replaceVariablesInText(text.quick_links.links.gemeente, {
                  municipalityName: municipalityName,
                }),
              },
            ]}
          ></QuickLinks>

          <ChoroplethTile
            title={text.risiconiveaus.selecteer_titel}
            description={
              <>
                <span
                  dangerouslySetInnerHTML={{
                    __html: text.risiconiveaus.selecteer_toelichting,
                  }}
                />
                <EscalationMapLegenda
                  data={choropleth.vr}
                  metricName="escalation_levels"
                  metricProperty="escalation_level"
                />
              </>
            }
          >
            <SafetyRegionChoropleth
              data={choropleth.vr}
              metricName="escalation_levels"
              metricProperty="escalation_level"
              onSelect={createSelectRegionHandler(router)}
              tooltipContent={escalationTooltip(
                createSelectRegionHandler(router)
              )}
            />
          </ChoroplethTile>

          <EscalationLevelExplanationsTile />

          <DataSitemap />
        </TileList>
      </MaxWidth>
    </Box>
  );
};

/** @TODO Fill metadata / adjust layout */
const metadata = {
  title: '',
};
MunicipalityActueel.getLayout = getLayoutWithMetadata(metadata);

export default MunicipalityActueel;
