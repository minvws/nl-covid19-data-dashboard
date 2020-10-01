import { NextRouter } from 'next/router';
import { ReactNode } from 'react';
import styles from '~/components/chloropleth/tooltips/tooltip.module.scss';
import { SafetyRegionProperties } from '~/components/chloropleth/shared';
import { createSelectRegionHandler } from '~/components/chloropleth/selectHandlers/createSelectRegionHandler';

export const createRegionHospitalAdmissionsTooltip = (router: NextRouter) => (
  context: SafetyRegionProperties & { value: number }
): ReactNode => {
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
            <div className={styles.escalationText}>
              <strong>
                {context.value !== undefined
                  ? `${context.value} / 100.000`
                  : '-'}
              </strong>
            </div>
          </div>
        }
      </div>
    )
  );
};
