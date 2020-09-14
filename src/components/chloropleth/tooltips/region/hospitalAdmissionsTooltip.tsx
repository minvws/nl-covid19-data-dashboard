import { ReactNode } from 'react';
import styles from 'components/chloropleth/chloropleth.module.scss';
import { SafetyRegionProperties } from 'components/chloropleth/shared';

export default function hospitalAdmissionsTooltip(
  context: SafetyRegionProperties & { value: number }
): ReactNode {
  return (
    context && (
      <div className={styles.defaultTooltip}>
        <strong>{context.vrname}</strong>
        <br />
        {context.value !== undefined && `${context.value}`}
        {!context.value === undefined && '-'}
      </div>
    )
  );
}
