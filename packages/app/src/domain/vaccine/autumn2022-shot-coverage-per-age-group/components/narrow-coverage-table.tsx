import { Box, Spacer } from '~/components/base';
import { BoldText } from '~/components/typography';
import { useIntl } from '~/intl';
import { formatAgeGroupString } from '~/utils/format-age-group-string';
import { formatBirthyearRangeString } from '~/utils/format-birthyear-range-string';
import { useVaccineCoveragePercentageFormatter } from '~/domain/vaccine/logic/use-vaccine-coverage-percentage-formatter';
import {
  COLOR_FULLY_VACCINATED,
  COLOR_AUTUMN_2022_SHOT,
} from '~/domain/vaccine/common';
import { Bar } from '~/domain/vaccine/components/bar';
import { NarrowPercentage } from '~/domain/vaccine/components/narrow-percentage';
import { AgeGroup } from '~/domain/vaccine/components/age-group';
import {
  GmVaccineCoveragePerAgeGroupValue,
  NlVaccineCoveragePerAgeGroupValue,
  VrVaccineCoveragePerAgeGroupValue,
} from '@corona-dashboard/common';
import { SiteText } from '~/locale';

export function NarrowCoverageTable({
  values,
  text,
}: {
  text: SiteText['pages']['vaccinations_page']['nl']['vaccination_coverage'];
  values:
    | NlVaccineCoveragePerAgeGroupValue[]
    | VrVaccineCoveragePerAgeGroupValue[]
    | GmVaccineCoveragePerAgeGroupValue[];
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
                'autumn_2022_vaccinated_percentage_label' in item
                  ? formatCoveragePercentage(
                      item,
                      'autumn_2022_vaccinated_percentage'
                    )
                  : item.autumn_2022_vaccinated_percentage === null
                  ? text.no_data
                  : `${formatPercentage(
                      item.autumn_2022_vaccinated_percentage
                    )}%`
              }
              color={COLOR_AUTUMN_2022_SHOT}
              textLabel={'Najaarsprik'}
            />

            <Bar
              value={item.autumn_2022_vaccinated_percentage}
              color={COLOR_AUTUMN_2022_SHOT}
              label={
                'autumn_2022_vaccinated_percentage_label' in item
                  ? item.autumn_2022_vaccinated_percentage_label
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
              textLabel={text.headers.fully_vaccinated}
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
