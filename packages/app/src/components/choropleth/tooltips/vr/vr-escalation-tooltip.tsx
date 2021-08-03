import { EscalationLevels, VrGeoProperties } from '@corona-dashboard/common';
import { Box } from '~/components/base';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltip-content';
import { EscalationLevelIcon } from '~/components/escalation-level-icon';
import { Text } from '~/components/typography';
import { getEscalationLevelIndexKey } from '~/domain/escalation-level/get-escalation-level-index-key';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

export function VrEscalationTooltip({
  context,
  getLink,
  hideValidFrom = false,
}: {
  context: VrGeoProperties & EscalationLevels;
  getLink?: (code: string) => string;
  hideValidFrom?: boolean;
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
    <TooltipContent
      title={context.vrname}
      link={getLink ? getLink(context.vrcode) : undefined}
    >
      <Box display="flex" alignItems="flex-start" spacingHorizontal={2}>
        {level !== null && <EscalationLevelIcon level={level} />}
        <div>
          <Text fontWeight="bold">{escalationText.titel}</Text>
          {!hideValidFrom && <Text>{validFromText}</Text>}
        </div>
      </Box>
    </TooltipContent>
  );
}
