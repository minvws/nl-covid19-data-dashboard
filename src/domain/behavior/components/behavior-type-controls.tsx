import { RadioGroup } from '~/components-styled/radio-group';
import text from '~/locale/index';

export type BehaviorTypeControlOption = 'compliance' | 'support';

export interface BehaviorTypeControlsProps {
  onChange: (value: BehaviorTypeControlOption) => void;
}

const items = [
  {
    label: text.nl_gedrag.common.compliance,
    value: 'compliance',
  },
  {
    label: text.nl_gedrag.common.support,
    value: 'support',
  },
];

export function BehaviorTypeControls(props: BehaviorTypeControlsProps) {
  const { onChange } = props;

  return <RadioGroup items={items} onChange={onChange} />;
}
