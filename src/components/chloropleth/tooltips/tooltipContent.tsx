import { ReactNode } from 'react';
import styles from '~/components/chloropleth/tooltips/tooltip.module.scss';

interface IProps {
  title: string;
  onSelectRegion: (event: React.MouseEvent<HTMLInputElement>) => void;
  children: ReactNode;
}

export function TooltipContent(props: IProps) {
  const { title, onSelectRegion, children } = props;

  return (
    <div className={styles.escalationTooltip} onClick={onSelectRegion}>
      <div className={styles.escalationTooltipHeader}>
        <h3>{title}</h3>
      </div>
      {
        <div className={styles.positiveTestedPeopleInfo}>
          <div className={styles.escalationText}>{children}</div>
        </div>
      }
    </div>
  );
}
