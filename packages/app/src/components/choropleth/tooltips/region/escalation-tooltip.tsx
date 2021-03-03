import {
  EscalationLevels,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
import { ReactNode } from 'react';
import { Box } from '~/components-styled/base';
import { EscalationLevelIcon } from '~/components-styled/escalation-level-icon';
import { Text } from '~/components-styled/typography';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltip-content';
import { EscalationLevel } from '~/domain/restrictions/type';
import text from '~/locale/index';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { RegionSelectionHandler } from '../../select-handlers/create-select-region-handler';

export const escalationTooltip = (selectHandler: RegionSelectionHandler) => {
  return (context: SafetyRegionProperties & EscalationLevels): ReactNode => {
    const level = context.level as EscalationLevel;

    const onSelect = (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      selectHandler(context.vrcode);
    };

    const escalationText = ((text.escalatie_niveau.types as unknown) as Record<
      EscalationLevel,
      { titel: string; valid_from: string }
    >)[level];

    const validFromText = replaceVariablesInText(
      text.escalatie_niveau.valid_from,
      {
        validFrom: formatDateFromSeconds(context.valid_from_unix, 'day-month'),
      }
    );

    return (
      <TooltipContent title={context.vrname} onSelect={onSelect}>
        <Box
          display="flex"
          alignItems="flex-start"
          spacing={2}
          spacingHorizontal
        >
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
  };
};
