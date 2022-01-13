import { Box, Spacer } from '~/components/base';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { formatAgeGroupString } from '~/utils/format-age-group-string';
import { formatBirthyearRangeString } from '~/utils/format-birthyear-range-string';
import { useVaccineCoveragePercentageFormatter } from '../../logic/use-vaccine-coverage-percentage-formatter';
import {
  COLOR_FULLY_BOOSTERED,
  COLOR_FULLY_VACCINATED,
  COLOR_HAS_ONE_SHOT,
  CoverageTableRow,
} from '../common';
import { AgeGroup } from './age-group';
import { Bar } from './bar';
import { NarrowPercentage } from './narrow-percentage';

export function NarrowCoverageTable({ values }: { values: CoverageTableRow }) {
  const { siteText, formatPercentage } = useIntl();
  const formatCoveragePercentage = useVaccineCoveragePercentageFormatter();
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
              value={`${formatPercentage(item.received_booster_percentage)}%`}
              color={COLOR_FULLY_BOOSTERED}
              textLabel={text.headers.first_shot}
            />

            <Bar
              value={item.received_booster_percentage}
              color={COLOR_FULLY_BOOSTERED}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
}
