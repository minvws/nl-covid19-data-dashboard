import {
  EscalationLevels,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
import { Box } from '~/components/base';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltip-content';
import { EscalationLevelIcon } from '~/components/escalation-level-icon';
import { Text } from '~/components/typography';
import { EscalationLevel } from '~/domain/restrictions/type';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

export function EscalationRegionalTooltip({
  context,
  getLink,
  hideValidFrom = false,
}: {
  context: SafetyRegionProperties & EscalationLevels;
  getLink?: (code: string) => string;
  hideValidFrom?: boolean;
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
    <TooltipContent
      title={context.vrname}
      link={getLink ? getLink(context.vrcode) : undefined}
    >
      <Box display="flex" alignItems="flex-start" spacing={2} spacingHorizontal>
        <EscalationLevelIcon level={level} />
        <div>
          <Text m={0} fontWeight="bold">
            {escalationText.titel}
          </Text>
          {!hideValidFrom && <Text m={0}>{validFromText}</Text>}
        </div>
      </Box>
    </TooltipContent>
  );
}
