import { FunctionComponent } from 'react';
import styles from './graphHeader.module.scss';

type GraphHeaderTypes = {
  Icon?: any;
  title: string;
};

const GraphHeader: FunctionComponent<GraphHeaderTypes> = ({ Icon, title }) => {
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
