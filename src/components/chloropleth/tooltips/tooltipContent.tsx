import { ReactNode } from 'react';
import styles from '~/components/chloropleth/tooltips/tooltip.module.scss';

interface IProps {
  title: string;
  onSelect: (event: React.MouseEvent<HTMLInputElement>) => void;
  children: ReactNode;
}

export function TooltipContent(props: IProps) {
  const { title, onSelect, children } = props;

  return (
    <div className={styles.tooltip} onClick={onSelect}>
      <div className={styles.tooltipHeader}>
        <h3>{title}</h3>
      </div>
      <div className={styles.tooltipInfo}>{children}</div>
    </div>
  );
}
