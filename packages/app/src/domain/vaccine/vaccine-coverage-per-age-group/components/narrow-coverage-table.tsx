import { Box, Spacer } from '~/components/base';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { formatAgeGroupString } from '~/utils/format-age-group-string';
import { formatBirthyearRangeString } from '~/utils/format-birthyear-range-string';
import { useVaccineCoveragePercentageFormatter } from '~/domain/vaccine/logic/use-vaccine-coverage-percentage-formatter';
import {
  COLOR_FULLY_VACCINATED,
  COLOR_HAS_ONE_SHOT,
} from '~/domain/vaccine/common';
import { Bar } from '~/domain/vaccine/components/bar';
import { NarrowPercentage } from '~/domain/vaccine/components/narrow-percentage';
import { AgeGroup } from '~/domain/vaccine/components/age-group';
import {
  GmVaccineCoveragePerAgeGroupValue,
  NlVaccineCoveragePerAgeGroupValue,
  VrVaccineCoveragePerAgeGroupValue,
} from '@corona-dashboard/common';

export function NarrowCoverageTable({
  values,
}: {
  values:
    | NlVaccineCoveragePerAgeGroupValue[]
    | VrVaccineCoveragePerAgeGroupValue[]
    | GmVaccineCoveragePerAgeGroupValue[];
}) {
  const { siteText, formatPercentage } = useIntl();
  const formatCoveragePercentage = useVaccineCoveragePercentageFormatter();
  const text = siteText.pages.vaccinations.nl.vaccination_coverage;
  const { templates } = siteText.pages.vaccinations.nl.vaccination_coverage;

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
            text={templates.agegroup.total_people}
          />

          <Box spacing={1}>
            <NarrowPercentage
              value={
                'has_one_shot_percentage_label' in item
                  ? formatCoveragePercentage(item, 'has_one_shot_percentage')
                  : `${formatPercentage(item.has_one_shot_percentage)}%`
              }
              color={COLOR_HAS_ONE_SHOT}
              textLabel={text.headers.first_shot}
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
              value={
                'fully_vaccinated_percentage_label' in item
                  ? formatCoveragePercentage(
                      item,
                      'fully_vaccinated_percentage'
                    )
                  : `${formatPercentage(item.fully_vaccinated_percentage)}%`
              }
              color={COLOR_FULLY_VACCINATED}
              textLabel={text.headers.coverage}
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
