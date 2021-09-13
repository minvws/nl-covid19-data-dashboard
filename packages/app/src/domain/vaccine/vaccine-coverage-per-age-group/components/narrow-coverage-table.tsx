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
import { PercentageBar } from '~/components/percentage-bar';
import { Spacer } from '~/components/base';
interface NarrowCoverageRow {
  values: NlVaccineCoveragePerAgeGroupValue[];
}

export function NarrowCoverageTable({ values }: NarrowCoverageRow) {
  const { siteText, formatNumber } = useIntl();
  const text = siteText.vaccinaties.vaccination_coverage;
  const { templates, age_group_tooltips } =
    siteText.vaccinaties.vaccination_coverage;

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

          <Box maxWidth="25rem">
            <Box spacing={1}>
              <Percentage
                label={text.headers.first_shot}
                value={item.fully_vaccinated_percentage}
                color={COLOR_HAS_ONE_SHOT}
              />

              <PercentageBar
                percentage={item.fully_vaccinated_percentage}
                height={8}
                color={COLOR_HAS_ONE_SHOT}
                hasFullWidthBackground
              />
            </Box>

            <Spacer mb={3} />

            <Box spacing={1}>
              <Percentage
                label={text.headers.coverage}
                value={item.fully_vaccinated_percentage}
                color={COLOR_FULLY_VACCINATED}
              />

              <PercentageBar
                percentage={item.fully_vaccinated_percentage}
                height={8}
                color={COLOR_FULLY_VACCINATED}
                hasFullWidthBackground
              />
            </Box>
          </Box>
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
    <Box
      css={css({
        display: 'flex',
        alignItems: 'center',
        pr: asResponsiveArray({ _: 3, xl: 4 }),
      })}
    >
      <Box pr={3} minWidth="8.5rem" textAlign="left">
        <InlineText>{`${label}:`}</InlineText>
      </Box>
      <Box
        width={10}
        height={10}
        backgroundColor={color}
        borderRadius="50%"
        mr={2}
      />
      {`${formatPercentage(value)}%`}
    </Box>
  );
}
