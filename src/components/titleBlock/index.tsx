import styles from './titleBlock.module.scss';

interface IProps {
  Icon: any;
  title: string;
}

const TitleBlock: React.FC<IProps> = (props) => {
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
};

export default TitleBlock;
