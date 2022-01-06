import css from '@styled-system/css';
import { Box } from '~/components/base';
import { RichContentSelect } from '~/components/rich-content-select';
import { Text } from '~/components/typography';
import { useIntl } from '~/intl';
import {
  BehaviorIdentifier,
  behaviorIdentifiers,
} from '../logic/behavior-types';
import { BehaviorIcon } from './behavior-icon';

interface SelectBehaviorProps {
  label: string;
  value: BehaviorIdentifier;
  onChange: (value: BehaviorIdentifier) => void;
  options?: BehaviorIdentifier[];
}

export function SelectBehavior({
  label,
  value,
  onChange,
  options = behaviorIdentifiers as unknown as BehaviorIdentifier[],
}: SelectBehaviorProps) {
  const intl = useIntl();
  const selectOptions = options
    .map((id) => {
      const label = intl.siteText.gedrag_onderwerpen[id];
      const iconSize = 25;
      return {
        value: id,
        label,
        content: (
          <Box display="flex" alignItems="flex-start">
            <Box pr={1} width={iconSize} height={iconSize}>
              <BehaviorIcon name={id} size={iconSize} aria-hidden={true} />
            </Box>
            <Text
              css={css({
                lineHeight: `${iconSize}px`,
              })}
            >
              {label}
            </Text>
          </Box>
        ),
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <RichContentSelect
      label={label}
      visuallyHiddenLabel
      initialValue={value}
      options={selectOptions}
      onChange={(option) => onChange(option.value)}
      useContentForSelectedOption
    />
  );
}
