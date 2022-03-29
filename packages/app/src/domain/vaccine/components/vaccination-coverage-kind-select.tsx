import { useMemo } from 'react';
import { isPresent } from 'ts-is-present';
import { Box } from '~/components/base';
import { RichContentSelect } from '~/components/rich-content-select';
import { Option } from '~/components/rich-content-select/types';
import { Text } from '~/components/typography';
import { useIntl } from '~/intl';

export type CoverageKindProperty =
  | 'fully_vaccinated_percentage'
  | 'has_one_shot_percentage';

const COVERAGE_KINDS: CoverageKindProperty[] = [
  'fully_vaccinated_percentage',
  'has_one_shot_percentage',
];

type VaccinationCoverageKindSelectProps = {
  onChange: (value: CoverageKindProperty) => void;
  initialValue?: CoverageKindProperty;
};

export function VaccinationCoverageKindSelect(
  props: VaccinationCoverageKindSelectProps
) {
  const { onChange, initialValue = 'fully_vaccinated_percentage' } = props;

  const { commonTexts } = useIntl();

  const options: Option<CoverageKindProperty>[] = useMemo(
    () =>
      COVERAGE_KINDS.map((kind) => {
        return {
          value: kind,
          label: commonTexts.vaccinations.coverage_kinds[kind],
          content: (
            <Box pr={2}>
              <Text>{commonTexts.vaccinations.coverage_kinds[kind]}</Text>
            </Box>
          ),
        };
      }).filter(isPresent),
    [commonTexts.vaccinations.coverage_kinds]
  );

  return (
    <RichContentSelect
      label={commonTexts.vaccinations.coverage_kind_dropdown.label}
      visuallyHiddenLabel
      initialValue={initialValue}
      options={options}
      onChange={(option) => onChange(option.value)}
    />
  );
}
