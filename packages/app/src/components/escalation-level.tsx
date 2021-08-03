import { Box } from '~/components/base';
import {
  EscalationLevelIcon,
  SizeVariants,
} from '~/components/escalation-level-icon';
import { Text } from '~/components/typography';
import { getEscalationLevelIndexKey } from '~/domain/escalation-level/get-escalation-level-index-key';
import { EscalationLevel } from '~/domain/restrictions/types';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { useEscalationColor } from '~/utils/use-escalation-color';

type EscalationLevelProps = {
  level: EscalationLevel;
  fontSize?: number;
  useLevelColor?: boolean;
  size?: SizeVariants;
};

export function EscalationLevelInfoLabel({
  level,
  size,
  fontSize = 2,
  useLevelColor = false,
}: EscalationLevelProps) {
  return (
    <Box display="flex" alignItems="center" justifyContent="flex-start">
      {level !== null && (
        <Box mr={2} display="inline-block">
          <EscalationLevelIcon level={level} size={size} />
        </Box>
      )}
      <Box>
        <EscalationLevelLabel
          level={level}
          fontSize={fontSize}
          useLevelColor={useLevelColor}
        />
      </Box>
    </Box>
  );
}

export function EscalationLevelLabel({
  level,
  fontSize,
  useLevelColor = false,
}: {
  level: EscalationLevel;
  fontSize: number;
  useLevelColor?: boolean;
}) {
  const { siteText } = useIntl();
  const escalationColor = useEscalationColor(level);

  const color = useLevelColor
    ? level === null
      ? colors.gray
      : escalationColor
    : 'inherit';

  return (
    <Box color={color} fontSize={fontSize}>
      <Text as="span" fontWeight="bold">
        {
          siteText.escalatie_niveau.types[getEscalationLevelIndexKey(level)]
            .titel
        }
      </Text>
    </Box>
  );
}
