import {
  assert,
  NlVaccineCoveragePerAgeGroupValue,
} from '@corona-dashboard/common';
import { Fragment } from 'react';
import { Box } from '~/components/base';
import { InlineTooltip } from '~/components/inline-tooltip';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { CoverageProgressBar } from './coverage-progress-bar';
import { CoverageRow, HeaderRow } from './coverage-row';
import { useBreakpoints } from '~/utils/use-breakpoints';
import css from '@styled-system/css';
import { formatAgeGroupString } from './logic/format-age-group-string';
import { formatBirthyearRangeString } from './logic/format-birthyear-range-string';
import { PercentageBar } from '~/components/percentage-bar';
import { NarrowCoverageRow } from '~/domain/vaccine/vaccine-coverage-per-age-group/narrow-coverage-row';
import { WideCoverageTable } from '~/domain/vaccine/vaccine-coverage-per-age-group/wide-coverage-table';
import styled from 'styled-components';
import { ChartTile } from '~/components/chart-tile';

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
  const breakpoints = useBreakpoints(true);
  console.log(values);

  const { siteText, formatPercentage, formatNumber } = useIntl();
  const { headers } = siteText.vaccinaties.vaccination_coverage;
  const { templates, age_group_tooltips } =
    siteText.vaccinaties.vaccination_coverage;

  const sortedValues = values.sort(
    (a, b) =>
      getSortingOrder(a.age_group_range) - getSortingOrder(b.age_group_range)
  );
  return (
    <ChartTile title={'title'} description={'description'}>
      {breakpoints.md ? (
        <WideCoverageTable values={sortedValues} />
      ) : (
        <NarrowCoverageRow values={sortedValues} />
      )}
    </ChartTile>
  );
}
