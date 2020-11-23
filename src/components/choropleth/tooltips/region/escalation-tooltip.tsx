import { NextRouter } from 'next/router';
import { ReactNode } from 'react';
import { EscalationLevelIcon } from '~/components-styled/escalation-level-icon';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import text from '~/locale/index';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import styles from '../tooltip.module.scss';

const escalationThresholds = regionThresholds.escalation_levels.thresholds;

export const escalationTooltip = (router: NextRouter) => {
  return (context: any): ReactNode => {
    const type: number = context?.value;

    const thresholdInfo = escalationThresholds.find(
      (value) => value.threshold === type
    );

    const onSelect = (event: any) => {
      event.stopPropagation();
      router.push(
        `/veiligheidsregio/${context.vrcode}/positief-geteste-mensen`
      );
    };

    return (
      type &&
      thresholdInfo && (
        <TooltipContent title={context.vrname} onSelect={onSelect}>
          <div className={styles.escalationInfo}>
            <div className={styles.bubble}>
              <EscalationLevelIcon level={thresholdInfo.threshold} />
            </div>
            <div>
              <strong>
                {(text.escalatie_niveau.types as any)[type].titel}
              </strong>
              <br />
              {replaceVariablesInText(text.escalatie_niveau.valid_from, {
                validFrom: formatDateFromSeconds(
                  context.valid_from_unix,
                  'short'
                ),
              })}
            </div>
          </div>
        </TooltipContent>
      )
    );
  };
};
