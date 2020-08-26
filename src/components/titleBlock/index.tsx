import styles from './titleBlock.module.scss';
import { WithChildren } from 'types';

interface IProps {
  Icon: any;
  title: string;
  children: WithChildren;
}

export default TitleBlock;

function TitleBlock(props: WithChildren<IProps>) {
  const { Icon, title, children } = props;

  return (
    <div className={styles.titleRow}>
      <Icon />
      <div>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}
