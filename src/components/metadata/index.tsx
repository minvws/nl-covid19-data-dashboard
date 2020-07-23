import styles from './metadata.module.scss';
import { Translation } from 'types/data';

interface IProps {
  dataSource: {
    href: Translation;
    text: Translation;
  };
}

const Metadata: React.FC<IProps> = (props) => {
  const { dataSource } = props;

  return (
    <div className={styles.metadataContainer}>
      {dataSource ? (
        <p>
          Bron data:{' '}
          <a href={dataSource.href.translation}>
            {dataSource.text.translation}
          </a>
        </p>
      ) : null}
    </div>
  );
};

export default Metadata;
