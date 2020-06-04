import React from 'react';
import styles from './graphHeader.module.scss';

const GraphHeader = ({ Icon, title }) => {
  return (
    <div className={styles.graphHeader}>
      {Icon && (
        <div className={styles.graphHeaderIcon}>
          <Icon />
        </div>
      )}
      <h3>{title}</h3>
    </div>
  );
};

export default GraphHeader;
