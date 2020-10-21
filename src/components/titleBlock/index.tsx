import { WithChildren } from '~/types/index';
import styles from './titleBlock.module.scss';

interface IProps {
  Icon: any;
  title: string;
  children: WithChildren;
}

export function TitleBlock(props: WithChildren<IProps>) {
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
