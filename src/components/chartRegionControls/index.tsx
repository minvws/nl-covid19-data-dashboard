import styles from './chartregioncontrols.module.scss';
import RadioGroup, { IRadioGroupItem } from 'components/radioGroup';

import text from 'locale';

export interface IProps {
  onChange: (value: any) => void;
}

export default function ChartRegionControls(props: IProps) {
  const { onChange } = props;

  const values: IRadioGroupItem[] = [
    {
      label: text.charts.region_controls.municipal,
      value: 'municipal',
    },
    {
      label: text.charts.region_controls.region,
      value: 'region',
    },
  ];

  return (
    <RadioGroup
      className={styles['select-region-group']}
      values={values}
      onChange={onChange}
    />
  );
}
