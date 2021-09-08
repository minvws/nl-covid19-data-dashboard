import {
  GmVaccineCoveragePerAgeGroupValue,
  VrVaccineCoveragePerAgeGroupValue,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import styled from 'styled-components';
import { isPresent } from 'ts-is-present';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { Markdown } from '~/components/markdown';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { asResponsiveArray } from '~/style/utils';
import { assert } from '~/utils/assert';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { parseBirthyearRange } from './logic/parse-birthyear-range';
import { parseFullyVaccinatedPercentageLabel } from './logic/parse-fully-vaccinated-percentage-label';

const SORT_ORDER = ['18+', '12-17', '12+'];
interface VaccineCoveragePerAgeGroupVrGmProps {
  title: string;
  description: string;
  annotation_description?: string;
  topLabels: {
    agegroups: string;
    vaccination_coverage: string;
    with_one_shot: string;
  };
  data:
    | VrVaccineCoveragePerAgeGroupValue[]
    | GmVaccineCoveragePerAgeGroupValue[];
}

export function VaccineCoveragePerAgeGroupVrGm({
  title,
  description,
  annotation_description,
  topLabels,
  data,
}: VaccineCoveragePerAgeGroupVrGmProps) {
  const { siteText } = useIntl();

  const sortedData = data.sort(
    (a, b) =>
      SORT_ORDER.indexOf(a.age_group_range) -
      SORT_ORDER.indexOf(b.age_group_range)
  );

  return (
    <ChartTile
      title={title}
      description={description}
      metadata={{
        source: siteText.vaccinaties.vaccination_coverage.bronnen.rivm,
        date: data[0].date_unix,
      }}
    >
      <Box overflow="auto" spacing={3}>
        <StyledTable>
          <thead>
            <Row
              css={css({
                borderTop: 'none',
              })}
            >
              <HeaderCell>{topLabels.agegroups}</HeaderCell>
              <HeaderCell
                css={css({
                  textAlign: 'right',
                })}
              >
                {topLabels.vaccination_coverage}
              </HeaderCell>
              <HeaderCell
                css={css({
                  textAlign: 'right',
                })}
              >
                {topLabels.with_one_shot}
              </HeaderCell>
            </Row>
          </thead>
          <tbody>
            {sortedData.map((item, index) => (
              <Row key={index}>
                <Cell>
                  <Box
                    display="flex"
                    flexDirection="column"
                    fontWeight="bold"
                    textAlign="left"
                  >
                    {siteText.vaccinaties.age_groups[item.age_group_range]}
                    <InlineText fontWeight="normal" variant="label2">
                      <InlineTextBirthyear
                        birthyearRange={item.birthyear_range}
                      />
                    </InlineText>
                  </Box>
                </Cell>
                <Cell>
                  <InlineText fontWeight="bold">
                    <ParseText
                      value={item.fully_vaccinated_percentage}
                      label={item.fully_vaccinated_percentage_label}
                      hasBoldText
                    />
                  </InlineText>
                </Cell>

                <Cell>
                  <ParseText
                    value={item.has_1_shot_percentage}
                    label={item.has_1_shot_percentage_label}
                  />
                </Cell>
              </Row>
            ))}
          </tbody>
        </StyledTable>

        {annotation_description && (
          <Box maxWidth="maxWidthText" color="annotation">
            <Markdown content={annotation_description} />
          </Box>
        )}
      </Box>
    </ChartTile>
  );
}

interface ParseBirthyearRangeProps {
  birthyearRange: string;
}

function InlineTextBirthyear({ birthyearRange }: ParseBirthyearRangeProps) {
  const { siteText } = useIntl();

  const parsedBirthyearRange = parseBirthyearRange(birthyearRange);

  assert(
    parsedBirthyearRange,
    `There is something wrong with parsing the birthyear range: ${birthyearRange}`
  );

  return (
    <InlineText fontWeight="normal" variant="label2">
      {replaceVariablesInText(
        siteText.vaccinaties.birthyear_ranges[parsedBirthyearRange.type],
        parsedBirthyearRange
      )}
    </InlineText>
  );
}

interface ParseTextProps {
  value: number | null;
  label: string | null;
  hasBoldText?: boolean;
}

function ParseText({ value, label, hasBoldText }: ParseTextProps) {
  const { formatPercentage, siteText } = useIntl();

  if (!isPresent(value)) {
    return (
      <InlineText fontWeight={hasBoldText ? 'bold' : 'normal'}>–</InlineText>
    );
  }

  if (isPresent(label)) {
    const parsedVaccinatedLabel = parseFullyVaccinatedPercentageLabel(label);

    assert(
      parsedVaccinatedLabel,
      `There is something wrong with parsing the label: ${label}`
    );

    return (
      <InlineText fontWeight={hasBoldText ? 'bold' : 'normal'}>
        {parsedVaccinatedLabel.sign === '>'
          ? replaceVariablesInText(
              siteText.vaccinaties_common.labels.meer_dan,
              {
                value: formatPercentage(parsedVaccinatedLabel.value) + '%',
              }
            )
          : replaceVariablesInText(
              siteText.vaccinaties_common.labels.minder_dan,
              {
                value: formatPercentage(parsedVaccinatedLabel.value) + '%',
              }
            )}
      </InlineText>
    );
  }

  return (
    <InlineText
      fontWeight={hasBoldText ? 'bold' : 'normal'}
    >{`${formatPercentage(value as number)}%`}</InlineText>
  );
}

const StyledTable = styled.table(
  css({
    borderCollapse: 'collapse',
    width: '100%',
  })
);

const Row = styled.tr(
  css({
    borderTop: '1px solid',
    borderColor: 'border',
  })
);

const commonCellStyles = {
  pr: asResponsiveArray({ _: 3, sm: 4, lg: 5 }),

  '&:last-child': {
    pr: asResponsiveArray({ _: 0, sm: 4, lg: 5 }),
  },
} as React.CSSProperties;

const HeaderCell = styled.th(
  css({
    ...commonCellStyles,
    textAlign: 'left',
    fontWeight: 'normal',

    pb: 2,
  })
);

const Cell = styled.td(
  css({
    ...commonCellStyles,
    verticalAlign: 'middle',
    textAlign: 'right',
    width: 'auto',
    alignItems: 'center',
    py: 3,
  })
);
