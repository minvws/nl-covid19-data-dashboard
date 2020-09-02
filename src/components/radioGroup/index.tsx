import { useMemo, Fragment, useState } from 'react';
import styles from './radiogroup.module.scss';

export interface IRadioGroupItem {
  label: string;
  value: string;
}

export interface IProps {
  onSelect: (value: any) => void;
  values: IRadioGroupItem[];
}

export default function RadioGroup(props: IProps) {
  const { onSelect, values } = props;
  const [selected, setSelected] = useState<string>(values?.[0].value);

  const id = useMemo(() => Math.random().toString(36).substr(2), []);

  const onChange = (value: string) => {
    if (value !== selected) {
      setSelected(value);
      onSelect(value);
    }
  };

  return (
    <div className={styles['select-region-type']}>
      {values.map((pair: IRadioGroupItem, index: number) => (
        <Fragment key={`radiogroup-${index}-${id}`}>
          <input
            onChange={() => onChange(pair.value)}
            id={`radiogroup-${index}-${id}`}
            type="radio"
            name={`regionType-${id}`}
            value={pair.value}
            checked={selected === pair.value}
          />
          <label htmlFor={`radiogroup-${index}-${id}`}>{pair.label}</label>{' '}
        </Fragment>
      ))}
    </div>
  );
}
