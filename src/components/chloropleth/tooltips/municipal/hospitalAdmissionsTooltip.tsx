import { ReactNode } from 'react';
import styles from 'components/chloropleth/chloropleth.module.scss';
import { MunicipalityProperties } from 'components/chloropleth/shared';

export default function hospitalAdmissionsTooltip(
  context: MunicipalityProperties & { value: number }
): ReactNode {
  return (
    context && (
      <div className={styles.defaultTooltip}>
        <strong>{context.gemnaam}</strong>
        <br />
        {context.value !== undefined && `${context.value}`}
        {!context.value === undefined && '-'}
      </div>
    )
  );
}
