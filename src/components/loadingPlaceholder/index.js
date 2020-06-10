import styles from './loadingPlaceholder.module.scss';

import * as React from 'react';

export default function LoadingPlaceholder({ width, children }) {
  return (
    <span className={styles.loadingPlaceholder} aria-hidden="true">
      {children ? children : null}
    </span>
  );
}
