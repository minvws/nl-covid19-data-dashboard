import {
  EscalationLevels,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
import { Box } from '~/components/base';
import { EscalationLevelIcon } from '~/components/escalation-level-icon';
import { Text } from '~/components/typography';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltip-content';
import { getEscalationLevelIndexKey } from '~/domain/escalation-level/get-escalation-level-index-key';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

export function EscalationRegionalTooltip({
  context,
  getLink,
}: {
  context: SafetyRegionProperties & EscalationLevels;
  getLink: (code: string) => string;
}) {
  const level = context.level;

  const { formatDateFromSeconds, siteText } = useIntl();

  const escalationText =
    siteText.escalatie_niveau.types[getEscalationLevelIndexKey(level)];

  const validFromText = replaceVariablesInText(
    siteText.escalatie_niveau.valid_from,
    {
      validFrom: formatDateFromSeconds(context.valid_from_unix, 'day-month'),
    }
  );

  return (
    <TooltipContent title={context.vrname} link={getLink(context.vrcode)}>
      <Box display="flex" alignItems="flex-start" spacing={2} spacingHorizontal>
        {level !== null && <EscalationLevelIcon level={level} />}
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
