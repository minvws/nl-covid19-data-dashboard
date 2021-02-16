import { Box } from '~/components-styled/base';
import { EscalationLevelIcon } from '~/components-styled/escalation-level-icon';
import { Text } from '~/components-styled/typography';
import { EscalationLevel } from '~/domain/restrictions/type';
import siteText from '~/locale/index';
import { regionThresholds } from '~/components/choropleth/region-thresholds';

export type EscalationLevelProps = {
  escalationLevel: EscalationLevel;
  iconSize?: 'small' | 'normal';
  fontSize?: number;
  useLevelColor?: boolean;
};

type EscalationLevelString = '1' | '2' | '3' | '4';

export function EscalationLevelInfoLabel({
  escalationLevel,
  iconSize = 'normal',
  fontSize = 2,
  useLevelColor = false,
}: EscalationLevelProps) {
  const color = useLevelColor
    ? regionThresholds.escalation_levels.escalation_level[escalationLevel - 1]
        .color
    : 'inherit';
  return (
    <Box display="flex" alignItems="center" justifyContent="flex-start">
      <EscalationLevelIcon level={escalationLevel} size={iconSize} />
      <Text
        as="span"
        ml={2}
        fontWeight="bold"
        fontSize={fontSize}
        color={color}
      >
        {
          siteText.escalatie_niveau.types[
            escalationLevel.toString() as EscalationLevelString
          ].titel
        }
      </Text>
    </Box>
  );
}

export function EscalationLevelInfo(props: EscalationLevelProps) {
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
