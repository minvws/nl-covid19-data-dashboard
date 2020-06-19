import React, { FunctionComponent } from 'react';

import styles from './graphHeader.module.scss';
import ScreenReaderOnly from 'components/screenReaderOnly';

type GraphHeaderTypes = {
  Icon?: React.ComponentType;
  title: string;
  regio?: string;
};

const GraphHeader: FunctionComponent<GraphHeaderTypes> = ({
  Icon,
  title,
  regio,
}) => {
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
