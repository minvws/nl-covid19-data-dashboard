import {
  EscalationLevels,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
import { Box } from '~/components-styled/base';
import { EscalationLevelIcon } from '~/components-styled/escalation-level-icon';
import { Text } from '~/components-styled/typography';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltip-content';
import { EscalationLevel } from '~/domain/restrictions/type';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

export function EscalationRegionalTooltip({
  context,
  getLink,
}: {
  context: SafetyRegionProperties & EscalationLevels;
  getLink: (code: string) => string;
}) {
  const level = context.level as EscalationLevel;

  const { formatDateFromSeconds, siteText } = useIntl();

  const escalationText = ((siteText.escalatie_niveau
    .types as unknown) as Record<
    EscalationLevel,
    { titel: string; valid_from: string }
  >)[level];

  const validFromText = replaceVariablesInText(
    siteText.escalatie_niveau.valid_from,
    {
      validFrom: formatDateFromSeconds(context.valid_from_unix, 'day-month'),
    }
  );

  return (
    <TooltipContent title={context.vrname} link={getLink(context.vrcode)}>
      <Box display="flex" alignItems="flex-start" spacing={2} spacingHorizontal>
        <EscalationLevelIcon level={level} />
        <div>
          <Text m={0} fontWeight="bold">
            {escalationText.titel}
          </Text>
          <Text m={0}>{validFromText}</Text>
        </div>
      </Box>
    </TooltipContent>
  );
}
