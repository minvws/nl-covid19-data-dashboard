import { TitleWithIcon } from '~/components/titleWithIcon';
import styles from './layout.module.scss';
import { MetadataHack } from './metadata_sourcesHack';

/**
 * An alteration from ContentHeader in order to render two sources in metadata.
 * This component will be thrown out in the next sprint probably because then
 * metadata will be taken out and the original is not worth fixing since it
 * requires a different kind of abstraction.
 *
 * The Metadata component is also copied and adjusted here locally for the same
 * reasons.
 */
export function ContentHeader_sourcesHack(props: IContentHeaderProps) {
  const { category, Icon, title, subtitle, metadata, id } = props;

  const layoutClasses = [styles.contentHeader];

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
          <MetadataHack {...metadata} />
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
    dataSourceA: {
      href: string;
      text: string;
    };
    dataSourceB: {
      href: string;
      text: string;
    };
  };
  category?: string;
  Icon?: React.ComponentType;
  id?: string;
}
