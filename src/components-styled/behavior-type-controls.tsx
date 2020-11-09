import { RadioGroup } from '~/components-styled/radio-group';

export type BehaviorTypeControlOption = 'compliance' | 'support';

export interface BehaviorTypeControlsProps {
  onChange: (value: BehaviorTypeControlOption) => void;
}

const items = [
  {
    label: 'compliance',
    value: 'compliance',
  },
  {
    label: 'support',
    value: 'support',
  },
];

export function BehaviorTypeControls(props: BehaviorTypeControlsProps) {
  const { onChange } = props;

  return <RadioGroup items={items} onChange={onChange} />;
}
