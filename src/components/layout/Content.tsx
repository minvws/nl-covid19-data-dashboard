import { Metadata } from '~/components/metadata';
import { TitleWithIcon } from '~/components/titleWithIcon';
import styles from './layout.module.scss';

export function ContentHeader(props: IContentHeaderProps) {
  const { category, Icon, title, subtitle, metadata, id } = props;

  const layoutClasses = [];

  if (!category) {
    layoutClasses.push(styles.withoutCategory);
  }
  if (!Icon) {
    layoutClasses.push(styles.withoutIcon);
  }

  return (
    <header id={id} className={layoutClasses.join(' ')}>
      {category && <p className={styles.category}>{category}</p>}
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
  category?: string;
  Icon?: React.ComponentType;
  id?: string;
}
