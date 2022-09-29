import { Box, Spacer } from '~/components/base';
import { BoldText } from '~/components/typography';
import { useIntl } from '~/intl';
import { formatAgeGroupString } from '~/utils/format-age-group-string';
import { formatBirthyearRangeString } from '~/utils/format-birthyear-range-string';
import {
  COLOR_FULLY_VACCINATED,
  COLOR_AUTUMN_2022_SHOT,
} from '~/domain/vaccine/common';
import { Bar } from '~/domain/vaccine/components/bar';
import { NarrowPercentage } from '~/domain/vaccine/components/narrow-percentage';
import { AgeGroup } from '~/domain/vaccine/components/age-group';
import { NlVaccineCoveragePerAgeGroupValue } from '@corona-dashboard/common';
import { SiteText } from '~/locale';

interface NarrowCoverageTableProps {
  text: SiteText['pages']['vaccinations_page']['nl']['vaccination_coverage'];
  values: NlVaccineCoveragePerAgeGroupValue[];
}

export const NarrowCoverageTable = ({
  values,
  text,
}: NarrowCoverageTableProps) => {
  const { commonTexts, formatPercentage } = useIntl();

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
                item.autumn_2022_vaccinated_percentage
                  ? `${formatPercentage(
                      item.autumn_2022_vaccinated_percentage
                    )}%`
                  : text.no_data
              }
              color={COLOR_AUTUMN_2022_SHOT}
              textLabel={text.headers.autumn_2022_shot}
            />

            <Bar
              value={item.autumn_2022_vaccinated_percentage}
              color={COLOR_AUTUMN_2022_SHOT}
            />
          </Box>

          <Spacer mb={3} />

          <Box spacing={1}>
            <NarrowPercentage
              value={`${formatPercentage(item.fully_vaccinated_percentage)}%`}
              color={COLOR_FULLY_VACCINATED}
              textLabel={text.headers.fully_vaccinated}
            />

            <Bar
              value={item.fully_vaccinated_percentage}
              color={COLOR_FULLY_VACCINATED}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
};
