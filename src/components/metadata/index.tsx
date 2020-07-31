import styles from './metadata.module.scss';

interface IProps {
  dataSource: {
    href: string;
    text: string;
  };
}

const Metadata: React.FC<IProps> = (props) => {
  const { dataSource } = props;

  return (
    <div className={styles.metadataContainer}>
      {dataSource ? (
        <p>
          Bron data: <a href={dataSource.href}>{dataSource.text}</a>
        </p>
      ) : null}
    </div>
  );
};

export default Metadata;
