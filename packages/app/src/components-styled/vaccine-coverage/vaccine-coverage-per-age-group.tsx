import { NlVaccineCoveragePerAgeGroupValue } from '@corona-dashboard/common';
import { InlineText } from '~/components-styled/typography';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { useBreakpoints } from '~/utils/useBreakpoints';
import { Box } from '../base';
import { AgeGroup } from './components/age-group';
import { CoverageProgressBar } from './components/coverage-progress-bar';
import { CoverageRow } from './components/coverage-row';
import { VaccinationCoveragePercentage } from './components/vaccination-coverage-percentage';

type Props = {
  values: NlVaccineCoveragePerAgeGroupValue[];
};

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
        {breakpoints.md ? <InlineText>{headers.progress}</InlineText> : null}
      </CoverageRow>
      {values.map((value, index, arr) => (
        <CoverageRow
          borderColor={index === arr.length - 1 ? 'black' : undefined}
          key={value.age_group_range}
        >
          <AgeGroup
            range={formatAgeGroup(value.age_group_range, templates.agegroup)}
            total={replaceVariablesInText(templates.agegroup.total_people, {
              total: formatNumber(value.age_group_total),
            })}
          />
          <VaccinationCoveragePercentage
            value={`${formatPercentage(value.fully_vaccinated_percentage, {
              maximumFractionDigits: 1,
            })}%`}
          />
          <CoverageProgressBar
            showsTotals={index === arr.length - 1}
            partially={value.partially_vaccinated}
            fully={value.fully_vaccinated}
            fullyPercentage={value.fully_vaccinated_percentage}
            total={value.age_group_total}
          />
        </CoverageRow>
      ))}
    </Box>
  );
}

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
