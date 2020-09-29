import { NextRouter } from 'next/router';
import { ReactNode } from 'react';
import { MunicipalityProperties } from '../../shared';
import styles from '../tooltip.module.scss';

export const positiveTestedPeopleMunicipalTooltip = (router: NextRouter) => (
  context: MunicipalityProperties & { value: number }
): ReactNode => {
  const onSelectRegion = (event: any) => {
    event.stopPropagation();
    router.push(
      '/gemeente/[code]/positief-geteste-mensen',
      `/gemeente/${context.gemcode}/positief-geteste-mensen`
    );
  };

  return (
    context && (
      <div className={styles.escalationTooltip} onClick={onSelectRegion}>
        <div className={styles.escalationTooltipHeader}>
          <h3>{context?.gemnaam}</h3>
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
