import { Metadata } from '~/components/metadata';
import { TitleWithIcon } from '~/components/titleWithIcon';
import styles from './layout.module.scss';

export function ContentHeader(props: IContentHeaderProps) {
  const { category, Icon, title, subtitle, metadata, id } = props;

  return (
    <header id={id}>
      <p className={styles.category}>{category}</p>
      <TitleWithIcon Icon={Icon} title={title} as="h2" />

      <div className={styles.text}>
        <p>{subtitle}</p>

        <div>
          <Metadata {...metadata} />
        </div>
      </div>
    </header>
  );
}

interface IContentHeaderProps {
  category: string;
  Icon: React.ComponentType;
  title: string;
  subtitle: string;
  metadata: {
    datumsText: string;
    dateUnix?: number;
    dateInsertedUnix?: number;
    dataSource: {
      href: string;
      text: string;
    };
  };
  id?: string;
}
