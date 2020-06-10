import React from 'react';
import styles from './graphHeader.module.scss';
import ScreenReaderOnly from 'components/screenReaderOnly';

const GraphHeader = ({ Icon, title, regio }) => {
  return (
    <div className={styles.graphHeader}>
      {Icon && (
        <div className={styles.graphHeaderIcon}>
          <Icon />
        </div>
      )}
      <h3>
        {title}
        {regio && <ScreenReaderOnly>in {regio}</ScreenReaderOnly>}
      </h3>
    </div>
  );
};

export default GraphHeader;