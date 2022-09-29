import { Box, Spacer } from '~/components/base';
import { BoldText } from '~/components/typography';
import { useIntl } from '~/intl';
import { formatAgeGroupString } from '~/utils/format-age-group-string';
import { formatBirthyearRangeString } from '~/utils/format-birthyear-range-string';
import { useVaccineCoveragePercentageFormatter } from '~/domain/vaccine/logic/use-vaccine-coverage-percentage-formatter';
import {
  COLOR_FULLY_VACCINATED,
  COLOR_FULLY_BOOSTERED,
} from '~/domain/vaccine/common';
import { Bar } from '~/domain/vaccine/components/bar';
import { NarrowPercentage } from '~/domain/vaccine/components/narrow-percentage';
import { AgeGroup } from '~/domain/vaccine/components/age-group';
import {
  NlVaccineCoveragePerAgeGroupArchived_20220908Value,
  VrVaccineCoveragePerAgeGroupArchived_20220908Value,
  GmVaccineCoveragePerAgeGroupArchived_20220908Value,
} from '@corona-dashboard/common';
import { SiteText } from '~/locale';

export function NarrowCoverageTable({
  values,
  text,
}: {
  text: SiteText['pages']['vaccinations_page']['nl'];
  values:
    | NlVaccineCoveragePerAgeGroupArchived_20220908Value[]
    | VrVaccineCoveragePerAgeGroupArchived_20220908Value[]
    | GmVaccineCoveragePerAgeGroupArchived_20220908Value[];
}) {
  const { commonTexts, formatPercentage } = useIntl();
  const formatCoveragePercentage = useVaccineCoveragePercentageFormatter();

  return (
    <Box>
      <Box borderBottom="1px solid" borderColor="silver" pb={2}>
        <BoldText variant="label1">
          {text.vaccination_coverage.headers.agegroup}
        </BoldText>
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
                'fully_vaccinated_percentage_label' in item
                  ? formatCoveragePercentage(
                      item,
                      'fully_vaccinated_percentage'
                    )
                  : `${formatPercentage(item.fully_vaccinated_percentage)}%`
              }
              color={COLOR_FULLY_VACCINATED}
              textLabel={text.vaccination_coverage.headers.fully_vaccinated}
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

          <Spacer mb={3} />

          <Box spacing={1}>
            <NarrowPercentage
              value={
                'booster_shot_percentage_label' in item
                  ? formatCoveragePercentage(item, 'booster_shot_percentage')
                  : item.booster_shot_percentage === null
                  ? text.vaccination_coverage.no_data
                  : `${formatPercentage(item.booster_shot_percentage)}%`
              }
              color={COLOR_FULLY_BOOSTERED}
              textLabel={
                text.archived.vaccination_coverage.headers.booster_shot
              }
            />

            <Bar
              value={item.booster_shot_percentage}
              color={COLOR_FULLY_BOOSTERED}
              label={
                'booster_shot_percentage_label' in item
                  ? item.booster_shot_percentage_label
                  : undefined
              }
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
}
