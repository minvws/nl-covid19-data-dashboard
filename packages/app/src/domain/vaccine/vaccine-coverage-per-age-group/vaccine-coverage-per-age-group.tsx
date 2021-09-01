import {
  assert,
  NlVaccineCoveragePerAgeGroupValue,
} from '@corona-dashboard/common';
import { Fragment } from 'react';
import { Box } from '~/components/base';
import { InlineTooltip } from '~/components/inline-tooltip';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { CoverageProgressBar } from './coverage-progress-bar';
import { CoverageRow, HeaderRow } from './coverage-row';

type Props = {
  values: NlVaccineCoveragePerAgeGroupValue[];
};

const SORTING_ORDER = [
  '81+',
  '71-80',
  '61-70',
  '51-60',
  '41-50',
  '31-40',
  '18-30',
  '12-17',
];

function getSortingOrder(ageGroup: string) {
  const index = SORTING_ORDER.findIndex((x) => x === ageGroup);

  assert(index >= 0, `No sorting order defined for age group ${ageGroup}`);

  return index;
}

export function VaccineCoveragePerAgeGroup(props: Props) {
  const { values } = props;

  const { siteText, formatPercentage, formatNumber } = useIntl();
  const { headers } = siteText.vaccinaties.vaccination_coverage;
  const { templates, age_group_tooltips } =
    siteText.vaccinaties.vaccination_coverage;

  return (
    <Box display="flex" flexDirection="column">
      <HeaderRow>
        <InlineText>{headers.agegroup}</InlineText>
        <InlineText>{headers.coverage}</InlineText>
        <InlineText>{headers.progress}</InlineText>
      </HeaderRow>
      {values
        .sort(
          (a, b) =>
            getSortingOrder(a.age_group_range) -
            getSortingOrder(b.age_group_range)
        )
        .map((value, index) => {
          return (
            <Fragment key={index}>
              <CoverageRow key={value.age_group_range}>
                <AgeGroup
                  range={formatAgeGroupString(
                    value.age_group_range,
                    templates.agegroup
                  )}
                  total={replaceVariablesInText(
                    templates.agegroup.total_people,
                    {
                      total: formatNumber(value.age_group_total),
                    }
                  )}
                  tooltipText={
                    (age_group_tooltips as Record<string, string>)[
                      value.age_group_range
                    ]
                  }
                  birthyear_range={formatBirthyearRangeString(
                    value.birthyear_range,
                    templates.birthyears
                  )}
                />
                <VaccinationCoveragePercentage
                  value={`${formatPercentage(
                    value.fully_vaccinated_percentage,
                    {
                      maximumFractionDigits: 1,
                      minimumFractionDigits: 1,
                    }
                  )}%`}
                />
                <CoverageProgressBar
                  partialCount={value.partially_vaccinated}
                  partialPercentage={value.partially_vaccinated_percentage}
                  fullCount={value.fully_vaccinated}
                  fullPercentage={value.fully_vaccinated_percentage}
                  total={value.age_group_total}
                />
              </CoverageRow>
            </Fragment>
          );
        })}
    </Box>
  );
}

/**
 * Format the given age group string according to these rules:
 *
 * If the group includes a hyphen (-) it is considered to be a range and
 * therefore formatted using the group template which looks roughly like this:
 * {{age_low}} tot {{age_high}} jaar
 *
 * If the group contains a plus sign (+) it is considered to be a 'this value
 * and higher' value and is formatted like this: {{age}} en ouder
 *
 * If none of these checks return true the value is considered to display the
 * totals and simply returns the locale string for this.
 *
 * @param ageGroup
 * @param templates
 * @returns
 */
function formatAgeGroupString(
  ageGroup: NlVaccineCoveragePerAgeGroupValue['age_group_range'],
  templates: {
    oldest: string;
    group: string;
    total: string;
    total_people: string;
  }
) {
  switch (true) {
    case ageGroup.includes('-'): {
      const [age_low, age_high] = ageGroup.split('-');
      return replaceVariablesInText(templates.group, {
        age_low,
        age_high,
      });
    }
    case ageGroup.includes('+'): {
      const age = ageGroup.replace('+', '');
      return replaceVariablesInText(templates.oldest, { age });
    }
    default: {
      throw new Error(`Invalid age group ${ageGroup}`);
    }
  }
}

/**
 * Format the birthyear range these rules:
 *
 * We could get 3 variants back from the data:
 * -2003, 2003-2006 and 2003-
 *
 * If the group includes a hyphen (-) at the start it is considered 2003 or earlier
 *
 * If the group includes a hyphen (-) at the end it is considered 2003 or later
 *
 * Otherwise the year will just be the full range with both birthyears.
 */

function formatBirthyearRangeString(
  birthyearRange: string,
  templates: {
    earlier: string;
    later: string;
    range: string;
  }
) {
  const splittedBirthyear = birthyearRange.split('-');

  switch (true) {
    case birthyearRange.startsWith('-'): {
      return replaceVariablesInText(templates.earlier, {
        birthyear: splittedBirthyear[1],
      });
    }
    case birthyearRange.endsWith('-'): {
      return replaceVariablesInText(templates.later, {
        birthyear: splittedBirthyear[0],
      });
    }
    default: {
      return replaceVariablesInText(templates.range, {
        birthyearStart: splittedBirthyear[0],
        birthyearEnd: splittedBirthyear[1],
      });
    }
  }
}

function VaccinationCoveragePercentage({ value }: { value: string }) {
  return (
    <InlineText variant="h3" color={colors.data.multiseries.cyan_dark}>
      {value}
    </InlineText>
  );
}

function AgeGroup({
  range,
  total,
  tooltipText,
  birthyear_range,
}: {
  range: string;
  total: string;
  tooltipText?: string;
  birthyear_range: string;
}) {
  return (
    <Box display="flex" flexDirection="column">
      {tooltipText ? (
        <InlineTooltip content={tooltipText}>
          <InlineText fontWeight="bold">{range}</InlineText>
        </InlineTooltip>
      ) : (
        <InlineText fontWeight="bold">{range}</InlineText>
      )}

      <InlineText variant="label1">
        {birthyear_range}: {total}
      </InlineText>
    </Box>
  );
}
