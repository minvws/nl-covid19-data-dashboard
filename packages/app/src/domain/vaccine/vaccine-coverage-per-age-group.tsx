import { NlVaccineCoveragePerAgeGroupValue } from '@corona-dashboard/common';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { Box } from '../../components/base';
import { CoverageProgressBar } from './components/coverage-progress-bar';
import { CoverageRow } from './components/coverage-row';

type Props = {
  values: NlVaccineCoveragePerAgeGroupValue[];
};

export function VaccineCoveragePerAgeGroup(props: Props) {
  const { values } = props;

  const { siteText, formatPercentage, formatNumber } = useIntl();
  const { headers } = siteText.vaccinaties.vaccination_coverage;
  const { group, oldest, total, total_people } =
    siteText.vaccinaties.vaccination_coverage.templates.agegroup;
  const breakpoints = useBreakpoints(true);

  return (
    <Box display="flex" flexDirection="column">
      <CoverageRow isHeaderRow>
        <InlineText>{headers.agegroup}</InlineText>
        <InlineText>{headers.coverage}</InlineText>
        {breakpoints.md ? <InlineText>{headers.progress}</InlineText> : null}
      </CoverageRow>
      {values.map((value, index, arr) => (
        <CoverageRow
          borderColor={index === arr.length - 1 ? 'black' : undefined}
          key={value.age_group_range}
        >
          <AgeGroup
            range={formatAgeGroup(value.age_group_range, {
              group,
              oldest,
              total,
              total_people,
            })}
            total={replaceVariablesInText(total_people, {
              total: formatNumber(value.age_group_total),
            })}
          />
          <VaccinationCoveragePercentage
            value={`${formatPercentage(value.fully_vaccinated_percentage, {
              maximumFractionDigits: 1,
            })}%`}
          />
          <CoverageProgressBar
            showTotals={index === arr.length - 1}
            partiallyVaccinated={value.partially_vaccinated}
            fullyVaccinated={value.fully_vaccinated}
            fullyPercentage={value.fully_vaccinated_percentage}
            partiallyPercentage={value.partially_vaccinated_percentage}
            total={value.age_group_total}
          />
        </CoverageRow>
      ))}
    </Box>
  );
}

/**
 * Format the given age group string according to these rules:
 *
 * If the group includes a hyphen (-) it is considered to be a range
 * and therefore formatted using the group template which looks roughly like this:
 * {{age_low}} tot {{age_high}} jaar
 *
 * If the group contains a plus sign (+) it is considered to be a 'this value and higher' value
 * and is foratted like this:
 * {{age}} en ouder
 *
 * If none of these checks return true the value is considered to display the totals
 * and simply returns the locale string for this.
 *
 * @param ageGroup
 * @param templates
 * @returns
 */
function formatAgeGroup(
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
    <Box display="flex" width="50%" justifyContent="flex-end">
      <InlineText color="blue" fontSize={{ _: 3, lg: 4 }} fontWeight="bold">
        {value}
      </InlineText>
    </Box>
  );
}

function AgeGroup({ range, total }: { range: string; total: string }) {
  return (
    <Box display="flex" flexDirection="column">
      <Box>
        <InlineText fontWeight="bold" fontSize={{ _: 2, md: 3 }}>
          {range}
        </InlineText>
      </Box>
      <Box as="span" fontSize={{ _: 1, md: 2 }}>
        <InlineText>{total}</InlineText>
      </Box>
    </Box>
  );
}
