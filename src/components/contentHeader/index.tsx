import { ReactNode } from 'react';
import { Box } from '~/components-styled/base';
import { TitleWithIcon } from '~/components/titleWithIcon';
import styles from '../layout/layout.module.scss';
import { Metadata } from './metadata';

export function GenericContentHeader(props: ISmallContentHeaderProps) {
  const { category, Icon, title, id, children } = props;

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
      {children}
      {!children && <Box mb={4} />}
    </header>
  );
}

export function ContentHeader(props: IContentHeaderProps) {
  const { category, Icon, title, subtitle, metadata, id } = props;

  return (
    <GenericContentHeader title={title} id={id} category={category} Icon={Icon}>
      <div className={styles.text}>
        <p>{subtitle}</p>

        <div>
          <Metadata {...metadata} />
        </div>
      </div>
    </GenericContentHeader>
  );
}

interface ISmallContentHeaderProps {
  category?: string;
  Icon?: React.ComponentType;
  title: string;
  id?: string;
  children?: ReactNode;
}

interface IContentHeaderProps
  extends Omit<ISmallContentHeaderProps, 'children'> {
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
}
