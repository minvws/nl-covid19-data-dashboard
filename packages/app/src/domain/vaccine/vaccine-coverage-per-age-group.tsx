import {
  assert,
  NlVaccineCoveragePerAgeGroupValue,
} from '@corona-dashboard/common';
import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { CoverageProgressBar } from './components/coverage-progress-bar';
import { CoverageRow } from './components/coverage-row';

type Props = {
  values: NlVaccineCoveragePerAgeGroupValue[];
};

const SORTING_ORDER = [
  '12+',
  '18+',
  '12-17',
  '18-29',
  '30-39',
  '40-49',
  '50-59',
  '65-69',
  '70-79',
  '80+',
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
  const { templates } = siteText.vaccinaties.vaccination_coverage;
  const breakpoints = useBreakpoints(true);

  return (
    <Box display="flex" flexDirection="column">
      <CoverageRow isHeaderRow>
        <InlineText>{headers.agegroup}</InlineText>
        <InlineText>{headers.coverage}</InlineText>
        {breakpoints.md ? <InlineText>{headers.progress}</InlineText> : <div />}
      </CoverageRow>
      {values
        .sort(
          (a, b) =>
            getSortingOrder(b.age_group_range) -
            getSortingOrder(a.age_group_range)
        )
        .map((value) => {
          return (
            <CoverageRow key={value.age_group_range}>
              <AgeGroup
                range={formatAgeGroupString(
                  value.age_group_range,
                  templates.agegroup
                )}
                total={replaceVariablesInText(templates.agegroup.total_people, {
                  total: formatNumber(value.age_group_total),
                })}
              />
              <VaccinationCoveragePercentage
                value={`${formatPercentage(value.fully_vaccinated_percentage, {
                  maximumFractionDigits: 1,
                  minimumFractionDigits: 1,
                })}%`}
              />
              <CoverageProgressBar
                partialCount={value.partially_vaccinated}
                partialPercentage={value.partially_vaccinated_percentage}
                fullCount={value.fully_vaccinated}
                fullPercentage={value.fully_vaccinated_percentage}
                total={value.age_group_total}
              />
            </CoverageRow>
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
  ageGroup: string,
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
      return templates.total;
    }
  }
}

function VaccinationCoveragePercentage({ value }: { value: string }) {
  return (
    <InlineText color="blue" fontSize={{ _: 3, lg: 4 }} fontWeight="bold">
      {value}
    </InlineText>
  );
}

function AgeGroup({ range, total }: { range: string; total: string }) {
  return (
    <Box display="flex" flexDirection="column">
      <InlineText fontWeight="bold" fontSize={{ _: 2, md: 3 }}>
        {range}
      </InlineText>
      <Box as="span" fontSize={{ _: 1, md: 2 }}>
        <InlineText>{total}</InlineText>
      </Box>
    </Box>
  );
}
