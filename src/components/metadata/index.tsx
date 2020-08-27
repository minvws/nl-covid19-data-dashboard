import styles from './metadata.module.scss';
import siteText from 'locale';

interface IProps {
  dataSource: {
    href: string;
    text: string;
  };
}

export default Metadata;

function Metadata(props: IProps) {
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
}
