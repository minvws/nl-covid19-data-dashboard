import { NlVaccineCoveragePerAgeGroupValue } from '@corona-dashboard/common';
import { InlineText } from '~/components-styled/typography';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { Box } from '../base';
import { AgeGroup } from './components/age-group';
import { CoverageProgressBar } from './components/coverage-progress-bar';
import { CoverageRow } from './components/coverage-row';
import { VaccinationCoverage } from './components/vaccination-coverage';

type Props = {
  values: NlVaccineCoveragePerAgeGroupValue[];
};

export function VaccineCoveragePerAgeGroup(props: Props) {
  const { values } = props;

  const { siteText, formatPercentage, formatNumber } = useIntl();
  const { headers } = siteText.vaccinaties.vaccination_coverage;
  const { templates } = siteText.vaccinaties.vaccination_coverage;

  return (
    <Box display="flex" flexDirection="column">
      <CoverageRow>
        <InlineText>{headers.agegroup}</InlineText>
        <InlineText>{headers.coverage}</InlineText>
        <InlineText>{headers.progress}</InlineText>
      </CoverageRow>
      {values.map((value, index, arr) => (
        <CoverageRow hideBorder={index === arr.length - 1}>
          <AgeGroup
            range={formatAgeGroup(value.age_group_range, templates.agegroup)}
            total={replaceVariablesInText(templates.agegroup.total_people, {
              total: formatNumber(value.age_group_total),
            })}
          />
          <VaccinationCoverage
            value={`${formatPercentage(value.fully_vaccinated_percentage, {
              maximumFractionDigits: 1,
            })}%`}
          />
          <CoverageProgressBar
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
