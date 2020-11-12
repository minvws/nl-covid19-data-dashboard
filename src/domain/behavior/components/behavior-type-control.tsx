import { RadioGroup } from '~/components-styled/radio-group';
import text from '~/locale/index';

export type BehaviorTypeControlOption = 'compliance' | 'support';

export interface BehaviorTypeControlProps {
  onChange: (value: BehaviorTypeControlOption) => void;
  value: BehaviorTypeControlOption;
}

const items = [
  {
    label: text.gedrag_common.compliance,
    value: 'compliance',
  },
  {
    label: text.gedrag_common.support,
    value: 'support',
  },
];

export function BehaviorTypeControl(props: BehaviorTypeControlProps) {
  return <RadioGroup {...props} items={items} />;
}
