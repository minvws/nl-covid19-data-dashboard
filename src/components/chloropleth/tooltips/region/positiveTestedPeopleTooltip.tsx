import { NextRouter } from 'next/router';
import { ReactNode } from 'react';
import { SafetyRegionProperties } from '../../shared';
import styles from '../tooltip.module.scss';

export const createPositiveTestedPeopleRegionalTooltip = (
  router: NextRouter
) => (context: SafetyRegionProperties & { value: number }): ReactNode => {
  const onSelectRegion = (event: any) => {
    event.stopPropagation();
    router.push(
      '/veiligheidsregio/[code]/positief-geteste-mensen',
      `/veiligheidsregio/${context.vrcode}/positief-geteste-mensen`
    );
  };

  return (
    context && (
      <div className={styles.escalationTooltip} onClick={onSelectRegion}>
        <div className={styles.escalationTooltipHeader}>
          <h3>{context?.vrname}</h3>
        </div>
        {
          <div className={styles.positiveTestedPeopleInfo}>
            <div className={styles.bubble}></div>
            <div className={styles.escalationText}>
              <strong>
                {context.value !== undefined ? context.value : '-'}
              </strong>
            </div>
          </div>
        }
      </div>
    )
  );
};
