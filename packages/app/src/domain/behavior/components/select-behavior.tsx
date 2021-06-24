import { Select } from '~/components/select';
import { useIntl } from '~/intl';
import {
  BehaviorIdentifier,
  behaviorIdentifiers,
} from '../logic/behavior-types';
import { BehaviorIcon } from './behavior-icon';

interface SelectBehaviorProps {
  value: BehaviorIdentifier;
  onChange: (value: BehaviorIdentifier) => void;
}

export function SelectBehavior({ value, onChange }: SelectBehaviorProps) {
  const intl = useIntl();
  const options = behaviorIdentifiers.map((id) => ({
    value: id,
    label: intl.siteText.gedrag_onderwerpen[id],
  }));

  return (
    <Select
      value={value}
      onChange={onChange}
      icon={<BehaviorIcon name={value} size={20} />}
      options={options}
    />
  );
}
