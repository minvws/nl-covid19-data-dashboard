import { RadioGroup } from '~/components/radio-group';
import { BehaviorType } from '../behavior-types';
import { useIntl } from '~/intl';

interface BehaviorTypeControlProps {
  onChange: (value: BehaviorType) => void;
  value: BehaviorType;
}

export function BehaviorTypeControl(props: BehaviorTypeControlProps) {
  const { siteText } = useIntl();

  const items = [
    {
      label: siteText.gedrag_common.compliance,
      value: 'compliance',
    },
    {
      label: siteText.gedrag_common.support,
      value: 'support',
    },
  ];
  return <RadioGroup {...props} items={items} />;
}
