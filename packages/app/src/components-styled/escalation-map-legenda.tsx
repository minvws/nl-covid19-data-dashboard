import { EscalationLevelIcon } from '~/components-styled/escalation-level-icon';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import siteText from '~/locale';
import { Box } from './base';
import { InlineText } from './typography';

const escalationThresholds =
  regionThresholds.escalation_levels.escalation_level;

export const EscalationMapLegenda = () => {
  return (
    <Box spacing={3} aria-label="legend">
      <h3>{siteText.escalatie_niveau.legenda.titel}</h3>
      {escalationThresholds.map((info) => (
        <Box
          key={info.threshold}
          display="flex"
          alignItems="center"
          spacing={3}
          spacingHorizontal
        >
          <EscalationLevelIcon level={info.threshold} />
          <InlineText fontSize="1.2rem">
            {siteText.escalatie_niveau.types[info.threshold].titel}
          </InlineText>
        </Box>
      ))}
    </Box>
  );
};
