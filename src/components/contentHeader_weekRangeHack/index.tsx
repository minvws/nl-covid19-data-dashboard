import { HeadingWithIcon } from '~/components-styled/heading-with-icon';
import { Heading } from '~/components-styled/typography';
import styles from '../layout/layout.module.scss';
import { Metadata } from './metadata_weekRangeHack';

/**
 * An alteration from ContentHeader in order to render two sources in metadata.
 * This component will be thrown out in the next sprint probably because then
 * metadata will be taken out and the original is not worth fixing since it
 * requires a different kind of abstraction.
 *
 * The Metadata component is also copied and adjusted here locally for the same
 * reasons.
 */
export function ContentHeader_weekRangeHack(
  props: ContentHeader_weekRangeHackProps
) {
  const { category, icon, title, subtitle, metadata, id } = props;

  const layoutClasses = [styles.contentHeader];

  if (!category) {
    layoutClasses.push(styles.withoutCategory);
  }
  if (!icon) {
    layoutClasses.push(styles.withoutIcon);
  }

  return (
    <header id={id} className={layoutClasses.join(' ')}>
      {category && <p className={styles.category}>{category}</p>}
      {icon && <HeadingWithIcon icon={icon} title={title} headingLevel={2} />}
      {!icon && <Heading level={2}>{title}</Heading>}

      <div className={styles.text}>
        <p>{subtitle}</p>

        <div>
          <Metadata {...metadata} />
        </div>
      </div>
    </header>
  );
}

interface ContentHeader_weekRangeHackProps {
  title: string;
  subtitle: string;
  metadata: {
    datumsText: string;
    weekStartUnix: number;
    weekEndUnix: number;
    dateOfInsertionUnix: number;
    dataSource: {
      href: string;
      text: string;
    };
  };
  category?: string;
  icon?: JSX.Element;
  id?: string;
}
