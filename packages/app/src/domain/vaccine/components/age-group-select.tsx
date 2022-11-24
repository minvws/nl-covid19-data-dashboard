import { useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import { Box } from '~/components/base';
import { RichContentSelect } from '~/components/rich-content-select';
import { Option } from '~/components/rich-content-select/types';
import { Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { parseBirthyearRange } from '../logic/parse-birthyear-range';

export type AgeGroup = '12' | '18' | '60';

const AGE_GROUPS = [
  {
    ageGroup: '60',
    birthyearRange: '-1961',
  },
  {
    ageGroup: '18',
    birthyearRange: '-2003',
  },
  {
    ageGroup: '12',
    birthyearRange: '-2009',
  },
] as const;

type AgeGroupSelectProps = {
  onChange: (value: AgeGroup) => void;
  initialValue?: AgeGroup;
  shownAgeGroups?: AgeGroup[];
};

export function AgeGroupSelect(props: AgeGroupSelectProps) {
  const { onChange, initialValue = '18', shownAgeGroups } = props;

  const { commonTexts } = useIntl();

  const options: Option<AgeGroup>[] = useMemo(
    () =>
      AGE_GROUPS.map((ageGroupAndRange) => {
        const birthyearRange = parseBirthyearRange(ageGroupAndRange.birthyearRange);
        if (isPresent(birthyearRange)) {
          if (shownAgeGroups && shownAgeGroups.includes(ageGroupAndRange.ageGroup)) {
            return {
              value: ageGroupAndRange.ageGroup,
              label: commonTexts.common.age_groups[ageGroupAndRange.ageGroup],
              content: (
                <Box>
                  <Text>{commonTexts.common.age_groups[ageGroupAndRange.ageGroup]}</Text>
                  <Text variant="label1">{replaceVariablesInText(commonTexts.common.birthyear_ranges[birthyearRange.type], birthyearRange)}</Text>
                </Box>
              ),
            };
          }
        }
      }).filter(isPresent),
    [commonTexts.common.age_groups, commonTexts.common.birthyear_ranges, shownAgeGroups]
  );

  return (
    <RichContentSelect
      label={commonTexts.common.age_group_dropdown.label}
      visuallyHiddenLabel
      initialValue={initialValue}
      options={options}
      onChange={(option) => onChange(option.value)}
    />
  );
}
