import { NextRouter } from 'next/router';
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
import { SafetyRegionProperties } from '../../shared';
import styles from '../tooltip.module.scss';

export const escalationTooltip = (router: NextRouter) => {
  return (context: SafetyRegionProperties & EscalationLevels): ReactNode => {
    const level = context.escalation_level as EscalationLevel;

    const onSelect = (event: any) => {
      event.stopPropagation();
      router.push(
        `/veiligheidsregio/${context.vrcode}/positief-geteste-mensen`
      );
    };

    const escalationText = (text.escalatie_niveau.types as Record<
      string,
      unknown
    >)[level] as { titel: string; valid_from: string };

    return (
      <TooltipContent title={context.vrname} onSelect={onSelect}>
        <div className={styles.escalationInfo}>
          <div className={styles.bubble}>
            <EscalationLevelIcon level={level} />
          </div>
          <div>
            <strong>{escalationText.titel}</strong>
            <br />
            {replaceVariablesInText(escalationText.valid_from, {
              validFrom: formatDateFromSeconds(
                context.valid_from_unix,
                'short'
              ),
            })}
          </div>
        </div>
      </TooltipContent>
    );
  };
};
