import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { InlineText, BoldText } from '~/components/typography';
import { VisuallyHidden } from '~/components/visually-hidden';
import { EscalationLevelType } from '~/domain/escalation-level/common';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useEscalationLevel } from '~/utils/use-escalation-level';

interface EscalationLevelLabelProps {
  level: EscalationLevelType;
  validFrom: number;
  lastCalculated: number;
}

export function EscalationLevelLabel({
  level,
  validFrom,
  lastCalculated,
}: EscalationLevelLabelProps) {
  const { commonTexts, formatDateFromSeconds } = useIntl();
  const escalationLevel = useEscalationLevel(level);

  // We need to know if the two dates are on the same day, so reset hour to
  // 00:00 for both before comparing to avoid bugs when hours differ
  const isSameDate =
    new Date(validFrom * 1000).setHours(0, 0, 0) ===
    new Date(lastCalculated * 1000).setHours(0, 0, 0);

  return (
    <Box
      display="flex"
      alignItems={{ sm: 'center' }}
      spacingHorizontal={3}
      flexDirection={{ _: 'column', sm: 'row' }}
    >
      <Box
        display={{ _: 'flex', sm: undefined }}
        alignItems={{ _: 'center', sm: undefined }}
        minWidth="auto"
      >
        <EscalationLevelIcon color={escalationLevel.color}>
          <VisuallyHidden>
            {commonTexts.common.risiconiveau_singular}{' '}
          </VisuallyHidden>
          {level}
        </EscalationLevelIcon>

        <BoldText color={escalationLevel.color} variant="h3">
          {escalationLevel.title}
        </BoldText>
      </Box>

      <Box pt="2px" pl={{ _: 0, sm: 2 }} maxWidth={350}>
        <InlineText variant="body2" color="body">
          {replaceVariablesInText(
            isSameDate
              ? commonTexts.national_escalation_levels.valid_from
              : commonTexts.national_escalation_levels
                  .valid_from_and_last_calculated,
            {
              date: formatDateFromSeconds(validFrom, 'medium'),
              lastCalculated: formatDateFromSeconds(lastCalculated, 'medium'),
            }
          )}
        </InlineText>
      </Box>
    </Box>
  );
}

const EscalationLevelIcon = styled.div<{ color: string }>((x) =>
  css({
    height: '2.25rem',
    width: '2.25rem',
    minWidth: '2.25rem',
    marginRight: 2,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: x.color,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 6,
    lineHeight: 0,
  })
);
