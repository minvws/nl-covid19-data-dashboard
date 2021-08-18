import { EscalationLevels } from '@corona-dashboard/common';
import { Box } from '~/components/base';
import { TooltipContent } from '~/components/choropleth/tooltips';
import { TooltipData } from '~/components/choropleth/tooltips/types';
import { EscalationLevelIcon } from '~/components/escalation-level-icon';
import { Text } from '~/components/typography';
import { getEscalationLevelIndexKey } from '~/domain/escalation-level/get-escalation-level-index-key';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

export function VrEscalationTooltip({
  context,
  hideValidFrom = false,
}: {
  context: TooltipData<EscalationLevels>;
  hideValidFrom?: boolean;
}) {
  const { dataItem, dataOptions } = context;
  const level = dataItem.level;

  const { formatDateFromSeconds, siteText } = useIntl();

  const escalationText =
    siteText.escalatie_niveau.types[getEscalationLevelIndexKey(level)];

  const validFromText = replaceVariablesInText(
    siteText.escalatie_niveau.valid_from,
    {
      validFrom: formatDateFromSeconds(dataItem.valid_from_unix, 'day-month'),
    }
  );

  return (
    <TooltipContent
      title={context.featureName}
      link={
        dataOptions.getLink ? dataOptions.getLink(dataItem.vrcode) : undefined
      }
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
