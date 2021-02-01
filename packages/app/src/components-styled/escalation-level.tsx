import { Box } from '~/components-styled/base';
import { EscalationLevelIcon } from '~/components-styled/escalation-level-icon';
import { Text } from '~/components-styled/typography';
import { EscalationLevel } from '~/domain/restrictions/type';
import siteText from '~/locale/index';

export type EscalationLevelProps = {
  escalationLevel: EscalationLevel;
};

export function EscalationLevelInfoLabel(props: EscalationLevelProps) {
  const { escalationLevel } = props;

  return (
    <Box display="flex" alignItems="center" justifyContent="flex-start">
      <EscalationLevelIcon level={escalationLevel} />
      <Text as="span" ml={2} fontWeight="bold">
        {siteText.escalatie_niveau.types[escalationLevel].titel}
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
