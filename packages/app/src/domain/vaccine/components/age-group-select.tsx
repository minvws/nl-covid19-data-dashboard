import { useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import { Box } from '~/components/base';
import { RichContentSelect } from '~/components/rich-content-select';
import { Option } from '~/components/rich-content-select/types';
import { Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { parseBirthyearRange } from '../logic/parse-birthyear-range';

export type AgeGroup = '12+' | '12-17' | '18+';

const AGE_GROUPS = [
  {
    ageGroup: '12+',
    birthyearRange: '-2009',
  },
  {
    ageGroup: '12-17',
    birthyearRange: '2004-2009',
  },
  {
    ageGroup: '18+',
    birthyearRange: '-2003',
  },
] as const;

type AgeGroupSelectProps = {
  onChange: (value: AgeGroup) => void;
  initialValue?: AgeGroup;
};

export function AgeGroupSelect(props: AgeGroupSelectProps) {
  const { onChange, initialValue = '18+' } = props;

  const { siteText } = useIntl();

  const options: Option<AgeGroup>[] = useMemo(
    () =>
      AGE_GROUPS.map((el) => {
        const birthyearRange = parseBirthyearRange(el.birthyearRange);

        if (isPresent(birthyearRange)) {
          return {
            value: el.ageGroup,
            label: siteText.vaccinaties.age_groups[el.ageGroup],
            content: (
              <Box>
                <Text fontWeight="bold">
                  {siteText.vaccinaties.age_groups[el.ageGroup]}
                </Text>
                <Text>
                  {replaceVariablesInText(
                    siteText.vaccinaties.birthyear_ranges[birthyearRange.type],
                    birthyearRange
                  )}
                </Text>
              </Box>
            ),
          };
        }
      }).filter(isPresent),
    [siteText.vaccinaties.age_groups, siteText.vaccinaties.birthyear_ranges]
  );

  return (
    <RichContentSelect
      label={siteText.vaccinaties.age_group_dropdown.label}
      visuallyHiddenLabel
      initialValue={initialValue}
      options={options}
      onChange={(option) => onChange(option.value)}
    />
  );
}
