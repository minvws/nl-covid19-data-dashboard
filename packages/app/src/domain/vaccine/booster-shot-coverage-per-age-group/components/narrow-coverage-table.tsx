import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { SiteText } from '~/locale';
import { formatAgeGroupString } from '~/utils/format-age-group-string';
import { formatBirthyearRangeString } from '~/utils/format-birthyear-range-string';
import { Bar } from '~/domain/vaccine/components/bar';
import { COLOR_FULLY_BOOSTERED } from '~/domain/vaccine/common';
import { AgeGroup } from '~/domain/vaccine/components/age-group';
import { NarrowPercentage } from '~/domain/vaccine/components/narrow-percentage';
import { NlBoosterShotPerAgeGroupValue } from '@corona-dashboard/common';

export function NarrowCoverageTable({
  values,
  text,
}: {
  values: NlBoosterShotPerAgeGroupValue[];
  text: SiteText['pages']['vaccinationsPage']['nl']['booster_per_age_group_table'];
}) {
  const { formatNumber, formatPercentage } = useIntl();

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
              text.templates.agegroup
            )}
            ageGroupTotal={
              'age_group_total' in item ? item.age_group_total : undefined
            }
            birthyear_range={formatBirthyearRangeString(
              item.birthyear_range,
              text.templates.birthyears
            )}
            text={text.templates.agegroup.total_people}
          />

          <Box spacing={1}>
            <NarrowPercentage
              value={`${formatNumber(
                item.received_booster_total
              )} (${formatPercentage(item.received_booster_percentage)}%)`}
              color={COLOR_FULLY_BOOSTERED}
              textLabel={text.headers.turnout_booter_shot}
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
