import { ReactNode } from 'react';
import { SafetyRegionProperties } from '../../shared';
import styles from '~/components/chloropleth/chloropleth.module.scss';

export function positiveTestedPeopleRegionalTooltip(
  context: SafetyRegionProperties & { value: number }
): ReactNode {
  return (
    context && (
      <div className={styles.defaultTooltip}>
        <strong>{context.vrname}</strong>
        <br />
        {context.value !== undefined && `${context.value} / 100.000`}
        {!context.value === undefined && '-'}
      </div>
    )
  );
}
