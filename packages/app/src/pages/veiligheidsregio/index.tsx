import fs from 'fs';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import path from 'path';
import { Box } from '~/components-styled/base';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { EscalationLevelIcon } from '~/components-styled/escalation-level-icon';
import { MessageTile } from '~/components-styled/message-tile';
import { TileList } from '~/components-styled/tile-list';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { escalationTooltip } from '~/components/choropleth/tooltips/region/escalation-tooltip';
import {
  useChoroplethColorScale,
  useSafetyRegionData,
} from '~/components/choropleth/hooks';
import { getDataThresholds } from '~/components/choropleth/legenda/utils';
import { regionGeo } from '~/components/choropleth/topology';
import styles from '~/components/choropleth/tooltips/tooltip.module.scss';
import { FCWithLayout } from '~/domain/layout/layout';
import { SafetyRegionComboBox } from '~/domain/layout/components/safety-region-combo-box';
import { getSafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import { SEOHead } from '~/components/seoHead';
import { TALLLanguages } from '~/locale/index';
import { parseMarkdownInLocale } from '~/utils/parse-markdown-in-locale';
import { useBreakpoints } from '~/utils/useBreakpoints';
import { RegionsMetricName } from '~/components/choropleth/shared';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const escalationThresholds =
  regionThresholds.escalation_levels.escalation_level;

interface EscalationMapLegendaProps {
  text: TALLLanguages;
  metricName: RegionsMetricName;
  metricProperty: string;
}
interface EscalationBarLegendaProps {
  info: {
    amount: number;
    color: string;
    threshold: number;
  };
  label: any;
  totalItems: number;
}

export const EscalationMapLegenda = (props: EscalationMapLegendaProps) => {
  const { text, metricName, metricProperty } = props;

  const { getChoroplethValue, hasData } = useSafetyRegionData(
    regionGeo,
    metricName,
    metricProperty
  );

  const selectedThreshold = getDataThresholds(
    regionThresholds,
    metricName,
    metricProperty
  );

  const getFillColor = useChoroplethColorScale(
    getChoroplethValue,
    selectedThreshold
  );

  const totalItems = regionGeo.features.length;

  const sortedEscalationArray = useMemo(() => {
    if (!hasData) return [];

    // Add an amount key to the escalation object to count the amount of items
    const sortedEscalationArray = escalationThresholds.map((item) => ({
      ...item,
      amount: regionGeo.features.filter(
        (i) => item.color === getFillColor(i.properties.vrcode)
      ).length,
    }));

    return sortedEscalationArray;
  }, [getFillColor, hasData]);

  return (
    <div className={styles.legenda} aria-label="legend">
      <h3>{text.escalatie_niveau.legenda.titel}</h3>
      {sortedEscalationArray.map((info) => (
        <div
          className={styles.escalationInfoLegenda}
          key={`legenda-item-${info?.threshold}`}
        >
          <Box display="flex" alignItems="center" width="10rem">
            <div className={styles.bubbleLegenda}>
              <EscalationLevelIcon level={info.threshold} />
            </div>
            <Box alignItems={'center'}>
              {text.escalatie_niveau.types[info.threshold].titel}
            </Box>
          </Box>

          <EscalationBarLegenda
            info={info}
            totalItems={totalItems}
            label={text.escalatie_niveau.legenda}
          />
        </div>
      ))}
    </div>
  );
};

const EscalationBarLegenda = (props: EscalationBarLegendaProps) => {
  const { info, totalItems, label } = props;

  const barWidth = info.amount / totalItems;

  return (
    <Box flexGrow={1} paddingY={1} display="flex">
      <Box
        flexGrow={barWidth}
        backgroundColor={info.color}
        height={'100%'}
        paddingRight={1}
      />
      <Box paddingLeft={2}>
        {info.amount
          ? replaceVariablesInText(label.regios, { amount: info.amount })
          : label.geen_regio}
      </Box>
    </Box>
  );
};

// Passing `any` to `FCWithLayout` because we
// can't do `getStaticProps` on this page because we require
// a code, but on this screen we select a code (safety region).
// All other pages which use `getSafetyRegionLayout` can assume
// the data is always there. Making the data optional would mean
// lots of unnecessary null checks on those pages.

const SafetyRegion: FCWithLayout<any> = (props) => {
  const router = useRouter();
  const breakpoints = useBreakpoints();

  const { text } = props;

  return (
    <>
      <SEOHead
        title={text.veiligheidsregio_index.metadata.title}
        description={text.veiligheidsregio_index.metadata.description}
      />

      {!breakpoints.md && (
        <Box bg="white">
          <SafetyRegionComboBox />
        </Box>
      )}

      <TileList>
        {text.regionaal_index.belangrijk_bericht && (
          <MessageTile message={text.regionaal_index.belangrijk_bericht} />
        )}

        <ChoroplethTile
          title={text.veiligheidsregio_index.selecteer_titel}
          description={
            <>
              <div
                dangerouslySetInnerHTML={{
                  __html: text.veiligheidsregio_index.selecteer_toelichting,
                }}
              />
              <EscalationMapLegenda
                text={text}
                metricName="escalation_levels"
                metricProperty="escalation_level"
              />
            </>
          }
        >
          <SafetyRegionChoropleth
            metricName="escalation_levels"
            metricProperty="escalation_level"
            onSelect={createSelectRegionHandler(router)}
            tooltipContent={escalationTooltip(
              createSelectRegionHandler(router)
            )}
          />
        </ChoroplethTile>
      </TileList>
    </>
  );
};

SafetyRegion.getLayout = getSafetyRegionLayout();

interface StaticProps {
  text: TALLLanguages;
  lastGenerated: string;
}

export async function getStaticProps(): Promise<{ props: StaticProps }> {
  const text = parseMarkdownInLocale(
    (await import('../../locale/index')).default
  );

  const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const lastGenerated = JSON.parse(fileContents).last_generated;

  return { props: { text, lastGenerated } };
}

export default SafetyRegion;
