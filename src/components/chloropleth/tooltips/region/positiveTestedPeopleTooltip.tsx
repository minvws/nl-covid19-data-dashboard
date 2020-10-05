import { NextRouter } from 'next/router';
import { ReactNode } from 'react';
import { SafetyRegionProperties } from '../../shared';
import { createSelectRegionHandler } from '../../../chloropleth/selectHandlers/createSelectRegionHandler';
import styles from '../tooltip.module.scss';

export const createPositiveTestedPeopleRegionalTooltip = (
  router: NextRouter
) => (context: SafetyRegionProperties & { value: number }): ReactNode => {
  const handler = createSelectRegionHandler(router);

  const onSelectRegion = (event: any) => {
    event.stopPropagation();
    handler(context);
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
