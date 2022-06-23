import { Box, Spacer } from '~/components/base';
import { BoldText } from '~/components/typography';
import { useIntl } from '~/intl';
import { formatAgeGroupString } from '~/utils/format-age-group-string';
import { formatBirthyearRangeString } from '~/utils/format-birthyear-range-string';
import { useVaccineCoveragePercentageFormatter } from '~/domain/vaccine/logic/use-vaccine-coverage-percentage-formatter';
import { ARCHIVED_COLORS } from '~/domain/vaccine/common';
import { Bar } from '~/domain/vaccine/components/bar';
import { NarrowPercentage } from '~/domain/vaccine/components/narrow-percentage';
import { AgeGroup } from '~/domain/vaccine/components/age-group';
import {
  GmVaccineCoveragePerAgeGroupArchivedValue,
  NlVaccineCoveragePerAgeGroupArchivedValue,
  VrVaccineCoveragePerAgeGroupArchivedValue,
} from '@corona-dashboard/common';
import { SiteText } from '~/locale';

export function NarrowCoverageTable({
  values,
  text,
}: {
  text: SiteText['pages']['vaccinationsPage']['nl']['vaccination_coverage'];
  values:
    | NlVaccineCoveragePerAgeGroupArchivedValue[]
    | VrVaccineCoveragePerAgeGroupArchivedValue[]
    | GmVaccineCoveragePerAgeGroupArchivedValue[];
}) {
  const { commonTexts, formatPercentage } = useIntl();
  const formatCoveragePercentage = useVaccineCoveragePercentageFormatter();

  return (
    <Box>
      <Box borderBottom="1px solid" borderColor="silver" pb={2}>
        <BoldText variant="label1">{text.headers.agegroup}</BoldText>
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
              commonTexts.common.agegroup
            )}
            ageGroupTotal={
              'age_group_total' in item ? item.age_group_total : undefined
            }
            birthyear_range={formatBirthyearRangeString(
              item.birthyear_range,
              commonTexts.common.birthyears
            )}
            text={commonTexts.common.agegroup.total_people}
          />

          <Box spacing={1}>
            <NarrowPercentage
              value={
                'has_one_shot_percentage_label' in item
                  ? formatCoveragePercentage(item, 'has_one_shot_percentage')
                  : `${formatPercentage(item.has_one_shot_percentage)}%`
              }
              color={ARCHIVED_COLORS.COLOR_HAS_ONE_SHOT}
              textLabel={text.headers.first_shot}
            />

            <Bar
              value={item.has_one_shot_percentage}
              color={ARCHIVED_COLORS.COLOR_HAS_ONE_SHOT}
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
              color={ARCHIVED_COLORS.COLOR_FULLY_VACCINATED}
              textLabel={text.headers.coverage}
            />

            <Bar
              value={item.fully_vaccinated_percentage}
              color={ARCHIVED_COLORS.COLOR_FULLY_VACCINATED}
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
