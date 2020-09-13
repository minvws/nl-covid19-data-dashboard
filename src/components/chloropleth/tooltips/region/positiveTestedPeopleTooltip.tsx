import { ReactNode } from 'react';
import { SafetyRegionProperties } from '../../shared';
import styles from 'components/chloropleth/chloropleth.module.scss';

export default function positiveTestedPeopleTooltip(
  context: SafetyRegionProperties & { value: number }
): ReactNode {
  return (
    context && (
      <div className={styles.defaultTooltip}>
        <strong>{context.vrname}</strong>
        <br />
        {context.value && `${context.value} / 100.000`}
        {!context.value && '-'}
      </div>
    )
  );
}
