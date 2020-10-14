import { NextRouter } from 'next/router';
import { ReactNode } from 'react';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

import text from '~/locale/index';
import styles from '../tooltip.module.scss';

import EscalationLevel1 from '~/assets/niveau-1.svg';
import EscalationLevel2 from '~/assets/niveau-2.svg';
import EscalationLevel3 from '~/assets/niveau-3.svg';
import EscalationLevel4 from '~/assets/niveau-4.svg';

import { TooltipContent } from '~/components/chloropleth/tooltips/tooltipContent';
import { regionThresholds } from '~/components/chloropleth/regionThresholds';
import { ChoroplethThresholds } from '../../shared';

const escalationThresholds = (regionThresholds.escalation_levels as ChoroplethThresholds)
  .thresholds;

export const escalationTooltip = (router: NextRouter) => {
  return (context: any): ReactNode => {
    const type: number = context?.value;

    const thresholdInfo = escalationThresholds.find(
      (value) => value.threshold === type
    );

    const onSelect = (event: any) => {
      event.stopPropagation();
      router.push(
        '/veiligheidsregio/[code]/positief-geteste-mensen',
        `/veiligheidsregio/${context.vrcode}/positief-geteste-mensen`
      );
    };

    return (
      type &&
      thresholdInfo && (
        <TooltipContent title={context.vrname} onSelect={onSelect}>
          <div className={styles.escalationInfo}>
            <div className={styles.bubble}>
              {thresholdInfo.threshold === 1 && (
                <EscalationLevel1 color={thresholdInfo.color} />
              )}
              {thresholdInfo.threshold === 2 && (
                <EscalationLevel2 color={thresholdInfo.color} />
              )}
              {thresholdInfo.threshold === 3 && (
                <EscalationLevel3 color={thresholdInfo.color} />
              )}
              {thresholdInfo.threshold === 4 && (
                <EscalationLevel4 color={thresholdInfo.color} />
              )}
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
