import { Box } from '~/components/base';
import { useIntl } from '~/intl';
import { InlineText } from '~/components/typography';
import { AgeGroup } from './age-group';
import { formatBirthyearRangeString } from '../logic/format-birthyear-range-string';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { formatAgeGroupString } from '../logic/format-age-group-string';
import { COLOR_HAS_ONE_SHOT, COLOR_FULLY_VACCINATED } from '../common';
import { asResponsiveArray } from '~/style/utils';
import { NlVaccineCoveragePerAgeGroupValue } from '@corona-dashboard/common';
import css from '@styled-system/css';

interface NarrowCoverageRow {
  values: NlVaccineCoveragePerAgeGroupValue[];
}

export function NarrowCoverageTable({ values }: NarrowCoverageRow) {
  const { siteText, formatNumber } = useIntl();
  const { headers } = siteText.vaccinaties.vaccination_coverage;
  const { templates, age_group_tooltips } =
    siteText.vaccinaties.vaccination_coverage;

  return (
    <Box>
      <Box borderBottom="1px solid" borderColor="silver" pb={2}>
        <InlineText fontWeight="bold">{headers.agegroup}</InlineText>
      </Box>
      {values.map((item, index) => (
        <Box
          key={index}
          spacing={3}
          py={2}
          borderBottom="1px solid"
          borderColor="silver"
        >
          <AgeGroup
            range={formatAgeGroupString(
              item.age_group_range,
              templates.agegroup
            )}
            total={replaceVariablesInText(templates.agegroup.total_people, {
              total: formatNumber(item.age_group_total),
            })}
            tooltipText={
              (age_group_tooltips as Record<string, string>)[
                item.age_group_range
              ]
            }
            birthyear_range={formatBirthyearRangeString(
              item.birthyear_range,
              templates.birthyears
            )}
          />

          <Percentage
            label="Opkomst 1e prik"
            value={item.fully_vaccinated_percentage}
            color={COLOR_HAS_ONE_SHOT}
          />

          <Percentage
            label="Vaccinatiegraad"
            value={item.fully_vaccinated_percentage}
            color={COLOR_HAS_ONE_SHOT}
          />
        </Box>
      ))}
    </Box>
  );
}

function Percentage({
  value,
  color,
  label,
}: {
  value: number;
  color: string;
  label: string;
}) {
  const { formatPercentage } = useIntl();

  return (
    <InlineText
      variant="body2"
      textAlign="right"
      css={css({
        display: 'flex',
        alignItems: 'center',
        pr: asResponsiveArray({ _: 3, xl: 4 }),
      })}
    >
      <Box pr={3}>
        <InlineText>{`${label}:`}</InlineText>
      </Box>
      <Box
        width={10}
        height={10}
        backgroundColor={color}
        borderRadius="50%"
        mr={2}
      />
      {`${formatPercentage(value, {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      })}%`}
    </InlineText>
  );
}
