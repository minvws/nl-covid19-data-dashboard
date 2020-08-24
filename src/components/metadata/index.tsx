import styles from './metadata.module.scss';
import siteText from 'locale';

interface IProps {
  dataSource: {
    href: string;
    text: string;
  };
}

const Metadata: React.FC<IProps> = (props) => {
  const { dataSource } = props;

  const text: typeof siteText.common.metadata = siteText.common.metadata;

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
