import {
  GmVaccineCoveragePerAgeGroupValue,
  NlVaccineCoveragePerAgeGroupValue,
  VrVaccineCoveragePerAgeGroupValue,
} from '@corona-dashboard/common';
import { Box, Spacer } from '~/components/base';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { COLOR_FULLY_VACCINATED, COLOR_HAS_ONE_SHOT } from '../common';
import { formatAgeGroupString } from '../logic/format-age-group-string';
import { formatBirthyearRangeString } from '../logic/format-birthyear-range-string';
import { AgeGroup } from './age-group';
import { Bar } from './bar';
import { NarrowPercentage } from './narrow-percentage';

interface NarrowCoverageRow {
  values:
    | NlVaccineCoveragePerAgeGroupValue[]
    | VrVaccineCoveragePerAgeGroupValue[]
    | GmVaccineCoveragePerAgeGroupValue[];
}

export function NarrowCoverageTable({ values }: NarrowCoverageRow) {
  const { siteText } = useIntl();
  const text = siteText.vaccinaties.vaccination_coverage;
  const { templates } = siteText.vaccinaties.vaccination_coverage;

  return (
    <Box>
      <Box borderBottom="1px solid" borderColor="silver" pb={2}>
        <InlineText fontWeight="bold" variant="label1">
          {text.headers.agegroup}
        </InlineText>
      </Box>

      {values.map((item, index) => (
        <Box
          key={index}
          pt={2}
          pb={3}
          spacing={3}
          borderBottom="1px solid"
          borderColor="silver"
        >
          <AgeGroup
            range={formatAgeGroupString(
              item.age_group_range,
              templates.agegroup
            )}
            ageGroupTotal={
              'age_group_total' in item ? item.age_group_total : undefined
            }
            birthyear_range={formatBirthyearRangeString(
              item.birthyear_range,
              templates.birthyears
            )}
          />

          <Box spacing={1}>
            <NarrowPercentage
              value={item.has_one_shot_percentage}
              color={COLOR_HAS_ONE_SHOT}
              textLabel={text.headers.first_shot}
              label={
                'has_one_shot_percentage_label' in item
                  ? item.has_one_shot_percentage_label
                  : undefined
              }
            />

            <Bar
              value={item.has_one_shot_percentage}
              color={COLOR_HAS_ONE_SHOT}
              label={
                'has_one_shot_percentage_label' in item
                  ? item.has_one_shot_percentage_label
                  : undefined
              }
            />
          </Box>

          <Spacer mb={3} />

          <Box spacing={1}>
            <NarrowPercentage
              value={item.fully_vaccinated_percentage}
              color={COLOR_FULLY_VACCINATED}
              textLabel={text.headers.coverage}
              label={
                'fully_vaccinated_percentage_label' in item
                  ? item.fully_vaccinated_percentage_label
                  : undefined
              }
            />

            <Bar
              value={item.fully_vaccinated_percentage}
              color={COLOR_FULLY_VACCINATED}
              label={
                'fully_vaccinated_percentage_label' in item
                  ? item.fully_vaccinated_percentage_label
                  : undefined
              }
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
}
