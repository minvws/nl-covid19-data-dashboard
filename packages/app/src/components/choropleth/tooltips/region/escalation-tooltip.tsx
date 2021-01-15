import { ReactNode } from 'react';
import { EscalationLevelIcon } from '~/components-styled/escalation-level-icon';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import { EscalationLevel } from '~/components/restrictions/type';
import text from '~/locale/index';
import { EscalationLevels } from '@corona-dashboard/common';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { RegionSelectionHandler } from '../../select-handlers/create-select-region-handler';
import { SafetyRegionProperties } from '@corona-dashboard/common';
import styles from '../tooltip.module.scss';

export const escalationTooltip = (selectHandler: RegionSelectionHandler) => {
  return (context: SafetyRegionProperties & EscalationLevels): ReactNode => {
    const level = context.escalation_level as EscalationLevel;

    const onSelect = (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      selectHandler(context);
    };

    const escalationText = ((text.escalatie_niveau.types as unknown) as Record<
      EscalationLevel,
      { titel: string; valid_from: string }
    >)[level];

    const validFromText = replaceVariablesInText(
      text.escalatie_niveau.valid_from,
      {
        validFrom: formatDateFromSeconds(context.valid_from_unix, 'short'),
      }
    );

    return (
      <TooltipContent title={context.vrname} onSelect={onSelect}>
        <div className={styles.escalationInfo}>
          <div className={styles.bubble}>
            <EscalationLevelIcon level={level} />
          </div>
          <div>
            <strong>{escalationText.titel}</strong>
            <br />
            {validFromText}
          </div>
        </div>
      </TooltipContent>
    );
  };
};
