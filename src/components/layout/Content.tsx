import Metadata from 'components/metadata';
import TitleWithIcon from 'components/titleWithIcon';
import { WithChildren } from 'types';
import styles from './layout.module.scss';

export { ContentHeader, TwoColumnLayout };

function ContentHeader(props: IContentHeaderProps) {
  const { category, Icon, title, subtitle, metadata } = props;

  return (
    <header>
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

function TwoColumnLayout(props: WithChildren) {
  const { children } = props;
  return <div className={styles['two-column']}>{children}</div>;
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
}
