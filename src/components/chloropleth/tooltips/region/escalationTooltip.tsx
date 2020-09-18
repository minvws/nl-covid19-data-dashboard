import { NextRouter } from 'next/router';
import { ReactNode } from 'react';
import formatDate from 'utils/formatDate';
import replaceVariablesInText from 'utils/replaceVariablesInText';

import text from 'locale';
import styles from '../tooltip.module.scss';

import EscalationLevel1 from 'assets/niveau-1.svg';
import EscalationLevel2 from 'assets/niveau-2.svg';
import EscalationLevel3 from 'assets/niveau-3.svg';

import { thresholds } from 'components/chloropleth/SafetyRegionChloropleth';

const escalationThresholds = thresholds.escalation_levels.thresholds;

export const escalationTooltip = (router: NextRouter) => {
  return (context: any): ReactNode => {
    const type: number = context?.value;

    const thresholdInfo = escalationThresholds.find(
      (value) => value.threshold === type
    );

    const onSelectRegion = (event: any) => {
      event.stopPropagation();
      router.push(
        '/veiligheidsregio/[code]/positief-geteste-mensen',
        `/veiligheidsregio/${context.vrcode}/positief-geteste-mensen`
      );
    };

    return (
      type &&
      thresholdInfo && (
        <div className={styles.escalationTooltip} onClick={onSelectRegion}>
          <div className={styles.escalationTooltipHeader}>
            <h3>{context?.vrname}</h3>
          </div>
          {
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
              </div>
              <div className={styles.escalationText}>
                <strong>
                  {(text.escalatie_niveau.types as any)[type].titel}
                </strong>
                <br />
                {replaceVariablesInText(text.escalatie_niveau.valid_from, {
                  validFrom: formatDate(
                    context.valid_from_unix * 1000,
                    'short'
                  ),
                })}
              </div>
            </div>
          }
        </div>
      )
    );
  };
};
