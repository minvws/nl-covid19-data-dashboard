import { Box, Spacer } from '~/components/base';
import { BoldText } from '~/components/typography';
import { useIntl } from '~/intl';
import { formatAgeGroupString } from '~/utils/format-age-group-string';
import { formatBirthyearRangeString } from '~/utils/format-birthyear-range-string';
import { useVaccineCoveragePercentageFormatter } from '~/domain/vaccine/logic/use-vaccine-coverage-percentage-formatter';
import {
  COLOR_FIRST,
  COLOR_LAST,
  vaccinceMetrics,
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
  metrics,
}: {
  text: SiteText['pages']['vaccinationsPage']['nl']['vaccination_coverage'];
  values:
    | NlVaccineCoveragePerAgeGroupValue[]
    | VrVaccineCoveragePerAgeGroupValue[]
    | GmVaccineCoveragePerAgeGroupValue[];
  metrics: vaccinceMetrics;
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
                metrics.first.label in item
                  ? formatCoveragePercentage(item, metrics.first.percentage)
                  : `${formatPercentage(item[metrics.first.percentage])}%`
              }
              color={COLOR_FIRST}
              textLabel={text.headers.labels.first}
            />

            <Bar
              value={item[metrics.first.percentage]}
              color={COLOR_FIRST}
              label={
                metrics.first.label in item
                  ? item[metrics.first.label]
                  : undefined
              }
            />
          </Box>

          <Spacer mb={3} />

          <Box spacing={1}>
            <NarrowPercentage
              value={
                metrics.last.label in item
                  ? formatCoveragePercentage(item, metrics.last.percentage)
                  : `${formatPercentage(item[metrics.last.percentage])}%`
              }
              color={COLOR_LAST}
              textLabel={text.headers.labels.last}
            />

            <Bar
              value={item[metrics.last.percentage]}
              color={COLOR_LAST}
              label={
                metrics.last.label in item
                  ? item[metrics.last.label]
                  : undefined
              }
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
}
