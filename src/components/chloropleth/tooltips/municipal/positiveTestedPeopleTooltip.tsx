import { ReactNode } from 'react';
import { MunicipalityProperties } from '../../shared';
import styles from 'components/chloropleth/chloropleth.module.scss';

export default function positiveTestedPeopleTooltip(
  context: MunicipalityProperties & { value: number }
): ReactNode {
  return (
    context && (
      <div className={styles.defaultTooltip}>
        <strong>{context.gemnaam}</strong>
        <br />
        {context.value !== undefined && `${context.value} / 100.000`}
        {!context.value === undefined && '-'}
      </div>
    )
  );
}
