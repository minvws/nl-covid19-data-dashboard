import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';
import { VisuallyHidden } from '~/components/visually-hidden';
import { EscalationLevelType } from '~/domain/escalation-level/common';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useEscalationLevel } from '~/utils/use-escalation-level';

interface EscalationLevelLabelProps {
  level: EscalationLevelType;
  date?: number;
}

export function EscalationLevelLabel({
  level,
  date,
}: EscalationLevelLabelProps) {
  const { siteText, formatDateFromSeconds } = useIntl();
  const escalationLevel = useEscalationLevel(level);

  return (
    <Box
      display="flex"
      alignItems={{ sm: 'center' }}
      spacingHorizontal={2}
      flexDirection={{ _: 'column', sm: 'row' }}
    >
      <Box
        display={{ _: 'flex', sm: undefined }}
        alignItems={{ _: 'center', sm: undefined }}
      >
        <EscalationLevelIcon color={escalationLevel.color}>
          <VisuallyHidden>
            {siteText.common.risiconiveau_singular}{' '}
          </VisuallyHidden>
          {level}
        </EscalationLevelIcon>

        <InlineText
          color={escalationLevel.color}
          fontWeight="bold"
          variant="h3"
        >
          {escalationLevel.title}
        </InlineText>
      </Box>

      {date && (
        <Box pt="2px" pl={{ _: 0, sm: 2 }}>
          <InlineText variant="body2">
            {replaceVariablesInText(
              siteText.national_escalation_levels.valid_from,
              {
                date: formatDateFromSeconds(date, 'weekday-medium'),
              }
            )}
          </InlineText>
        </Box>
      )}
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
