import css from '@styled-system/css';
import fs from 'fs';
import { useRouter } from 'next/router';
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
import styles from '~/components/choropleth/tooltips/tooltip.module.scss';
import { SEOHead } from '~/components/seoHead';
import { SafetyRegionComboBox } from '~/domain/layout/components/safety-region-combo-box';
import { FCWithLayout } from '~/domain/layout/layout';
import { getSafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import { TALLLanguages } from '~/locale/index';
import { getChoroplethData } from '~/static-props/choropleth-data';
import { StaticProps } from '~/static-props/types';
import { parseMarkdownInLocale } from '~/utils/parse-markdown-in-locale';
import { useBreakpoints } from '~/utils/useBreakpoints';

export async function getStaticProps() {
  const choropleth = getChoroplethData({
    vr: ({ escalation_levels }) => ({ escalation_levels }),
  });

  const text = parseMarkdownInLocale(
    (await import('../../locale/index')).default
  );

  const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const lastGenerated = JSON.parse(fileContents).last_generated;

  return { props: { text, lastGenerated, choropleth } };
}

// Passing `any` to `FCWithLayout` because we
// can't do `getStaticProps` on this page because we require
// a code, but is is the screen we select a code (safety region).
// All other pages which use `getSafetyRegionLayout` can assume
// the data is always there. Making the data optional would mean
// lots of unnecessary null checks on those pages.

const SafetyRegion: FCWithLayout<StaticProps<typeof getStaticProps>> = ({
  text,
  choropleth,
}) => {
  const router = useRouter();
  const breakpoints = useBreakpoints();

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
              <EscalationMapLegenda text={text} />
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
      </TileList>
    </>
  );
};

SafetyRegion.getLayout = getSafetyRegionLayout as any;

export default SafetyRegion;

interface EscalationMapLegendaProps {
  text: TALLLanguages;
}

const escalationThresholds =
  regionThresholds.escalation_levels.escalation_level;

export const EscalationMapLegenda = (props: EscalationMapLegendaProps) => {
  const { text } = props;

  return (
    <div className={styles.legenda} aria-label="legend">
      <h3 css={css({ maxWidth: '20em' })}>
        {text.escalatie_niveau.legenda.titel}
      </h3>
      {escalationThresholds.map((info) => (
        <div
          className={styles.escalationInfoLegenda}
          key={`legenda-item-${info?.threshold}`}
        >
          <div className={styles.bubbleLegenda}>
            <EscalationLevelIcon level={info.threshold} />
          </div>
          <div className={styles.escalationTextLegenda}>
            {text.escalatie_niveau.types[info.threshold].titel}
          </div>
        </div>
      ))}
    </div>
  );
};
