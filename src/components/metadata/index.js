import styles from './metadata.module.scss';

export default function Metadata(props) {
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
}
