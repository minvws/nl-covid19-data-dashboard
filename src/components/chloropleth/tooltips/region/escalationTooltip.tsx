import { NextRouter } from 'next/router';
import { ReactNode } from 'react';
import formatDate from 'utils/formatDate';
import replaceVariablesInText from 'utils/replaceVariablesInText';

import text from 'locale';
import styles from '../tooltip.module.scss';

import ExclamationMark from 'assets/exclamation-mark-bubble.svg';
import EmptyBubble from 'assets/empty-bubble.svg';

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
      type && (
        <div className={styles.escalationTooltip} onClick={onSelectRegion}>
          <div className={styles.escalationTooltipHeader}>
            <h4>{context?.vrname}</h4>
          </div>
          {
            <div className={styles.escalationInfo}>
              <div className={styles.bubble}>
                {type !== 1 && <ExclamationMark fill={thresholdInfo?.color} />}
                {type === 1 && <EmptyBubble fill={thresholdInfo?.color} />}
              </div>
              <div>
                <strong>
                  {(text.escalatie_niveau.types as any)[type].titel}
                </strong>
                : {(text.escalatie_niveau.types as any)[type].toelichting}
                <br />
                {replaceVariablesInText(text.escalatie_niveau.valid_from, {
                  validFrom: formatDate(context.valid_from_unix),
                })}
              </div>
            </div>
          }
        </div>
      )
    );
  };
};
