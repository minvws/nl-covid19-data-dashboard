import { useRouter } from 'next/router';
import { useState } from 'react';
import Notification from '~/assets/notification.svg';
import { AnchorTile } from '~/components-styled/anchor-tile';
import { Box, Spacer } from '~/components-styled/base';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { CategoryHeading } from '~/components-styled/content-header';
import { EscalationMapLegenda } from '~/components-styled/escalation-map-legenda';
import { HeadingWithIcon } from '~/components-styled/heading-with-icon';
import { MessageTile } from '~/components-styled/message-tile';
import { TileList } from '~/components-styled/tile-list';
import { Text } from '~/components-styled/typography';
import { municipalThresholds } from '~/components/choropleth/municipal-thresholds';
import { MunicipalityChoropleth } from '~/components/choropleth/municipality-choropleth';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectMunicipalHandler } from '~/components/choropleth/select-handlers/create-select-municipal-handler';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { createPositiveTestedPeopleMunicipalTooltip } from '~/components/choropleth/tooltips/municipal/create-positive-tested-people-municipal-tooltip';
import { createPositiveTestedPeopleRegionalTooltip } from '~/components/choropleth/tooltips/region/create-positive-tested-people-regional-tooltip';
import { escalationTooltip } from '~/components/choropleth/tooltips/region/escalation-tooltip';
import { FCWithLayout } from '~/domain/layout/layout';
import { getNationalLayout } from '~/domain/layout/national-layout';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  getLastGeneratedDate,
  getNlData,
  getText,
} from '~/static-props/get-data';
import theme from '~/style/theme';
import { EscalationLevels } from '~/types/data';
import { assert } from '~/utils/assert';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

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
  const { data, text, choropleth } = props;
  const router = useRouter();
  const [selectedMap, setSelectedMap] = useState<'municipal' | 'region'>(
    'municipal'
  );

  return (
    <TileList>
      <Box>
        <CategoryHeading level={1} hide={true}>
          {text.nationaal_layout.headings.algemeen}
        </CategoryHeading>
        <HeadingWithIcon
          icon={<Notification color={theme.colors.notification} />}
          title={text.laatste_ontwikkelingen.title}
          headingLevel={2}
        />
      </Box>

      <AnchorTile
        title={text.notificatie.titel}
        href={text.notificatie.link.href}
        label={text.notificatie.link.text}
        external
        shadow
      >
        <Text>
          {replaceVariablesInText(
            text.notificatie.bericht,
            getEscalationCounts(choropleth.vr.escalation_levels)
          )}
        </Text>
      </AnchorTile>

      {text.regionaal_index.belangrijk_bericht && (
        <>
          <Spacer mt={4} />
          <MessageTile message={text.regionaal_index.belangrijk_bericht} />
        </>
      )}

      <ChoroplethTile
        title={text.veiligheidsregio_index.selecteer_titel}
        description={
          <>
            <span
              dangerouslySetInnerHTML={{
                __html: text.veiligheidsregio_index.selecteer_toelichting,
              }}
            />
            <EscalationMapLegenda />
          </>
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
      </ChoroplethTile>

      <ChoroplethTile
        title={text.positief_geteste_personen.map_titel}
        metadata={{
          date: data.tested_overall.last_value.date_unix,
          source: text.positief_geteste_personen.bronnen.rivm,
        }}
        description={text.positief_geteste_personen.map_toelichting}
        onChartRegionChange={setSelectedMap}
        chartRegion={selectedMap}
        legend={{
          thresholds:
            selectedMap === 'municipal'
              ? municipalThresholds.tested_overall.infected_per_100k
              : regionThresholds.tested_overall.infected_per_100k,
          title: text.positief_geteste_personen.chloropleth_legenda.titel,
        }}
      >
        {selectedMap === 'municipal' && (
          <MunicipalityChoropleth
            data={choropleth.gm}
            metricName="tested_overall"
            metricProperty="infected_per_100k"
            tooltipContent={createPositiveTestedPeopleMunicipalTooltip(
              createSelectMunicipalHandler(router)
            )}
            onSelect={createSelectMunicipalHandler(router)}
          />
        )}
        {selectedMap === 'region' && (
          <SafetyRegionChoropleth
            data={choropleth.vr}
            metricName="tested_overall"
            metricProperty="infected_per_100k"
            tooltipContent={createPositiveTestedPeopleRegionalTooltip(
              createSelectRegionHandler(router, 'positief-geteste-mensen')
            )}
            onSelect={createSelectRegionHandler(
              router,
              'positief-geteste-mensen'
            )}
          />
        )}
      </ChoroplethTile>
    </TileList>
  );
};

Home.getLayout = getNationalLayout;

export default Home;

/**
 * Calculate the counts of regions with a certain escalation level
 */
const getEscalationCounts = (
  escalationLevels?: EscalationLevels[]
): EscalationLevelCounts => {
  const counts: EscalationLevelCounts = {
    escalationLevel1: 0,
    escalationLevel2: 0,
    escalationLevel3: 0,
    escalationLevel4: 0,
    escalationLevel5: 0,
  };

  if (escalationLevels) {
    escalationLevels.forEach((region) => {
      assert(
        [1, 2, 3, 4, 5].indexOf(region.escalation_level) !== -1,
        'Escalation level not supported. Value needs to be 1-5.'
      );
      const key = `escalationLevel${region.escalation_level}` as keyof EscalationLevelCounts;
      counts[key] += 1;
    });
  }

  return counts;
};

/**
 * The keys in this object are used to find and replace values in the translation files.
 * Adjustments here need to be applied in Lokalize too.
 * This is also why the keys are a bit more verbose.
 */
type EscalationLevelCounts = {
  escalationLevel1: number;
  escalationLevel2: number;
  escalationLevel3: number;
  escalationLevel4: number;
  escalationLevel5: number;
};
