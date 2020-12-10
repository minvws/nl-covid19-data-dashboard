import { ReactNode } from 'react';
import {
  EscalationLevel,
  EscalationLevelIcon,
} from '~/components-styled/escalation-level-icon';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import text from '~/locale/index';
import { EscalationLevels } from '~/types/data';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { RegionSelectionHandler } from '../../select-handlers/create-select-region-handler';
import { SafetyRegionProperties } from '../../shared';
import styles from '../tooltip.module.scss';

export const escalationTooltip = (selectHandler: RegionSelectionHandler) => {
  return (context: SafetyRegionProperties & EscalationLevels): ReactNode => {
    const level = context.escalation_level as EscalationLevel;

    const onSelect = (event: any) => {
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
