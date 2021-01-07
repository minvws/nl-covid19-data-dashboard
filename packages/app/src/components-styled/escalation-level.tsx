import { Box } from '~/components-styled/base';
import { EscalationLevelIcon } from '~/components-styled/escalation-level-icon';
import { Text } from '~/components-styled/typography';
import { EscalationLevel } from '~/components/restrictions/type';
import siteText from '~/locale/index';
import { useEscalationColor } from '~/utils/use-escalation-color';

export type EscalationLevelProps = {
  escalationLevel: EscalationLevel;
};

export function EscalationLevelInfoLabel(props: EscalationLevelProps) {
  const { escalationLevel } = props;

  const color = useEscalationColor(escalationLevel);

  return (
    <>
      <EscalationLevelIcon level={escalationLevel} />
      <Text as="span" marginLeft=".5em" color={color} fontWeight="bold">
        {siteText.escalatie_niveau.types[escalationLevel].titel}
      </Text>
    </>
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
