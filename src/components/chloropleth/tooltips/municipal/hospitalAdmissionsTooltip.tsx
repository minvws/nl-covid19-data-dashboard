import { NextRouter } from 'next/router';
import { ReactNode } from 'react';
import styles from '~/components/chloropleth/tooltips/tooltip.module.scss';
import { MunicipalityProperties } from '~/components/chloropleth/shared';
import { createSelectMunicipalHandler } from '~/components/chloropleth/selectHandlers/createSelectMunicipalHandler';

export const createMunicipalHospitalAdmissionsTooltip = (
  router: NextRouter
) => (context: MunicipalityProperties & { value: number }): ReactNode => {
  const handler = createSelectMunicipalHandler(router);

  const onSelectRegion = (event: any) => {
    event.stopPropagation();
    handler(context);
  };

  return (
    context && (
      <div className={styles.escalationTooltip} onClick={onSelectRegion}>
        <div className={styles.escalationTooltipHeader}>
          <h3>{context?.gemnaam}</h3>
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
