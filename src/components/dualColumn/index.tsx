import { ReactNode } from 'react';

import styles from './dualColumn.module.scss';

export interface IProps {
  leftCol: ReactNode;
  rightCol: ReactNode;
}

export default function DualColumn(props: IProps) {
  const { leftCol, rightCol } = props;
  return (
    <div className={styles.dualColumn}>
      <div>{leftCol}</div>
      <div>{rightCol}</div>
    </div>
  );
}
