//import styles from './chloroplethlegenda.module.scss';

export interface ILegendaItem {
  color: string;
  label: string;
}

export type TProps = {
  title: string;
  items: ILegendaItem[];
};

export default function ChloroplethLegenda(_props: TProps) {
  return null;
  /*const { items, title } = props;
  return (
    <>
      <h4>{title}</h4>
      <ul className={styles.legenda}>
        {items.map((item) => (
          <li key={item.color} className={styles.legendaItem}>
            <div
              className={styles.box}
              style={{ backgroundColor: item.color }}
            ></div>
            <div>{item.label}</div>
          </li>
        ))}
      </ul>
    </>
  );*/
}
