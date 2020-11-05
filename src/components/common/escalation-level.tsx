import { regionThresholds } from '~/components/choropleth/regionThresholds';
import { ChoroplethThresholds } from '../choropleth/shared';
import EscalationLevel1 from '~/assets/niveau-1.svg';
import EscalationLevel2 from '~/assets/niveau-2.svg';
import EscalationLevel3 from '~/assets/niveau-3.svg';
import EscalationLevel4 from '~/assets/niveau-4.svg';
import siteText from '~/locale/index';
import { Box } from '~/components-styled/base';
import { Text } from '~/components-styled/typography';

const escalationThresholds = (regionThresholds.escalation_levels as ChoroplethThresholds)
  .thresholds;

export type EscalationLevelLabelProps = {
  escalationLevel: number;
};

export function EscalationLevelInfoLabel(props: EscalationLevelLabelProps) {
  const { escalationLevel } = props;

  const color = escalationThresholds.find(
    (threshold) => threshold.threshold === escalationLevel
  )?.color;

  return (
    <>
      {escalationLevel === 1 && <EscalationLevel1 color={color} />}
      {escalationLevel === 2 && <EscalationLevel2 color={color} />}
      {escalationLevel === 3 && <EscalationLevel3 color={color} />}
      {escalationLevel === 4 && <EscalationLevel4 color={color} />}
      <Text
        as="span"
        marginLeft=".5em !important"
        color={color}
        fontWeight="bold"
      >
        {
          siteText.escalatie_niveau.types[escalationLevel as 1 | 2 | 3 | 4]
            .titel
        }
      </Text>
    </>
  );
}

export function EscalationLevelInfo(props: EscalationLevelLabelProps) {
  const { escalationLevel } = props;

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
      alignItems="center"
      mt={1}
    >
      <Text as="span" marginLeft="0 !important" marginRight=".5em !important">
        {siteText.escalatie_niveau.sidebar_label}
      </Text>
      <EscalationLevelInfoLabel escalationLevel={escalationLevel} />
    </Box>
  );
}
