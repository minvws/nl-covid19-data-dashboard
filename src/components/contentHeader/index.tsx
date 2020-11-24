import { HeadingWithIcon } from '~/components-styled/heading-with-icon';
import { Heading } from '~/components-styled/typography';
import styles from '../layout/layout.module.scss';
import { Metadata } from './metadata';

export function ContentHeader(props: IContentHeaderProps) {
  const { category, icon, title, subtitle, metadata, id, reference } = props;

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
        <p>
          {subtitle} <a href={reference.href}>{reference.text}</a>
        </p>

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
    dateUnix: number;
    dateInsertedUnix?: number;
    dataSource: {
      href: string;
      text: string;
    };
  };
  reference: {
    href: string;
    text: string;
  };
  category?: string;
  icon?: JSX.Element;
  id?: string;
}
