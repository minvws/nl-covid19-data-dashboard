import { useMemo, Fragment, useState } from 'react';
import styles from './radiogroup.module.scss';

export interface IRadioGroupItem {
  label: string;
  value: string;
}

export interface IProps {
  onChange: (value: any) => void;
  value?: string;
  values: IRadioGroupItem[];
  className?: string;
}

/**
 * Very simple styled radiogroup component that takes an array of radiogroup items and
 * reports its changes using the given onSelect callback.
 *
 * @param props
 */
export default function RadioGroup(props: IProps) {
  const { onChange, values, className, value } = props;
  const [selected, setSelected] = useState<string>(value ?? values?.[0].value);

  const id = useMemo(() => Math.random().toString(36).substr(2), []);

  const onLocalChange = (value: string): void => {
    if (value !== selected) {
      setSelected(value);
      onChange(value);
    }
  };

  const combinedClassName = className
    ? `${styles['select-radio-group']} ${className}`
    : styles['select-radio-group'];

  return (
    <div className={combinedClassName}>
      {values.map((pair: IRadioGroupItem, index: number) => (
        <Fragment key={`radiogroup-${index}-${id}`}>
          <input
            onChange={() => onLocalChange(pair.value)}
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
