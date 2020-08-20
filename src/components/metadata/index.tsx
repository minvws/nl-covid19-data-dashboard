import styles from './metadata.module.scss';
import { TranslationStrings } from 'types/common';

interface IProps {
  dataSource: {
    href: string;
    text: string;
  };
  text: TranslationStrings;
}

const Metadata: React.FC<IProps> = (props) => {
  const { dataSource, text } = props;

  return (
    <div className={styles.metadataContainer}>
      {dataSource ? (
        <p>
          {text.source}: <a href={dataSource.href}>{dataSource.text}</a>
        </p>
      ) : null}
    </div>
  );
};

export default Metadata;
