import { RadioGroup } from '~/components-styled/radio-group';
import text from '~/locale/index';
import { BehaviorType } from '../behavior-types';

export interface BehaviorTypeControlProps {
  onChange: (value: BehaviorType) => void;
  value: BehaviorType;
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
