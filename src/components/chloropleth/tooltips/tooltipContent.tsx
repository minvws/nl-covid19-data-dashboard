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
    <div className={styles.tooltip} onClick={onSelectRegion}>
      <div className={styles.tooltipHeader}>
        <h3>{title}</h3>
      </div>
      {<div className={styles.tooltipInfo}>{children}</div>}
    </div>
  );
}
