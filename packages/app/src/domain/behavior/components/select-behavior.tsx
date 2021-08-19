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
  options?: BehaviorIdentifier[];
}

export function SelectBehavior({
  value,
  onChange,
  options = behaviorIdentifiers as unknown as BehaviorIdentifier[],
}: SelectBehaviorProps) {
  const intl = useIntl();
  const selectOptions = options
    .map((id) => ({
      value: id,
      label: intl.siteText.gedrag_onderwerpen[id],
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <Select
      value={value}
      onChange={onChange}
      icon={<BehaviorIcon name={value} size={25} />}
      options={selectOptions}
    />
  );
}
