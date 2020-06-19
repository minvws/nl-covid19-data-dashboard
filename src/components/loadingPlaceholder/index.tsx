import { FunctionComponent } from 'react';

import styles from './loadingPlaceholder.module.scss';

const LoadingPlaceholder: FunctionComponent = ({ children }) => {
  return (
    <span className={styles.loadingPlaceholder} aria-hidden="true">
      {children ? children : null}
    </span>
  );
};

export default LoadingPlaceholder;
