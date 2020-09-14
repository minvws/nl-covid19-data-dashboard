import Legenda from 'components/legenda';

import styles from './chloroplethlegenda.module.scss';

/*export type TProps<T = Municipalities | Regions> = {
  source: T;
  metricName: TMetricHolder<T>;
};*/

export interface ILegendaItem {
  color: string;
  label: string;
}

export type TProps = {
  title: string;
  items: ILegendaItem[];
};

export default function ChloroplethLegenda(props: TProps) {
  const { items, title } = props;
  return (
    <>
      <h4>{title}</h4>
      <Legenda>
        {items.map((item) => (
          <li key={item.color} className={styles.legendaItem}>
            <div style={{ backgroundColor: item.color }}></div>
            <div>{item.label}</div>
          </li>
        ))}
      </Legenda>
    </>
  );
}
