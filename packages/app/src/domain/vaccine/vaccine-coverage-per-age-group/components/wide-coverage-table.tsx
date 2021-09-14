import {
  GmVaccineCoveragePerAgeGroupValue,
  NlVaccineCoveragePerAgeGroupValue,
  VrVaccineCoveragePerAgeGroupValue,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { PercentageBar } from '~/components/percentage-bar';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { asResponsiveArray } from '~/style/utils';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { COLOR_FULLY_VACCINATED, COLOR_HAS_ONE_SHOT } from '../common';
import { formatAgeGroupString } from '../logic/format-age-group-string';
import { formatBirthyearRangeString } from '../logic/format-birthyear-range-string';
import { AgeGroup } from './age-group';
import { parseFullyVaccinatedPercentageLabel } from './logic/parse-fully-vaccinated-percentage-label';
interface WideCoverageTable {
  values:
    | NlVaccineCoveragePerAgeGroupValue[]
    | VrVaccineCoveragePerAgeGroupValue[]
    | GmVaccineCoveragePerAgeGroupValue[];
}

export function WideCoverageTable({ values }: WideCoverageTable) {
  const { siteText, formatNumber } = useIntl();
  const text = siteText.vaccinaties.vaccination_coverage;
  const { templates } = siteText.vaccinaties.vaccination_coverage;

  return (
    <Box overflow="auto">
      <StyledTable>
        <thead
          css={css({
            borderBottom: '1px solid',
            borderColor: 'silver',
          })}
        >
          <Row>
            <HeaderCell
              css={css({
                textAlign: 'left',
                width: asResponsiveArray({
                  _: '30%',
                  lg: '30%',
                }),
              })}
            >
              <InlineText variant="label1">{text.headers.agegroup}</InlineText>
            </HeaderCell>
            <HeaderCell
              css={css({
                textAlign: 'right',
                pr: asResponsiveArray({ _: 3, xl: 4 }),
                width: asResponsiveArray({
                  _: '25%',
                  lg: '20%',
                }),
              })}
            >
              <InlineText variant="label1">
                {text.headers.first_shot}
              </InlineText>
            </HeaderCell>
            <HeaderCell
              css={css({
                textAlign: 'right',
                pr: asResponsiveArray({ _: 3, xl: 4 }),
                width: asResponsiveArray({
                  _: '25%',
                  lg: '20%',
                }),
              })}
            >
              <InlineText variant="label1">{text.headers.coverage}</InlineText>
            </HeaderCell>
            <HeaderCell
              css={css({
                width: asResponsiveArray({
                  _: '20%',
                  lg: '30%',
                }),
              })}
            />
          </Row>
        </thead>
        <tbody>
          {values.map((item, index) => (
            <Row key={index}>
              <Cell>
                <AgeGroup
                  range={formatAgeGroupString(
                    item.age_group_range,
                    templates.agegroup
                  )}
                  total={replaceVariablesInText(
                    templates.agegroup.total_people,
                    {
                      total: formatNumber(item.age_group_total),
                    }
                  )}
                  birthyear_range={formatBirthyearRangeString(
                    item.birthyear_range,
                    templates.birthyears
                  )}
                />
              </Cell>
              <Cell>
                <Percentage
                  value={item.fully_vaccinated_percentage}
                  color={COLOR_HAS_ONE_SHOT}
                />
              </Cell>
              <Cell>
                <Percentage
                  value={item.fully_vaccinated_percentage}
                  color={COLOR_FULLY_VACCINATED}
                />
              </Cell>
              <Cell>
                <Box spacing={1}>
                  <PercentageBar
                    percentage={item.fully_vaccinated_percentage}
                    height={8}
                    color={COLOR_HAS_ONE_SHOT}
                    hasFullWidthBackground
                  />
                  <PercentageBar
                    percentage={item.fully_vaccinated_percentage}
                    height={8}
                    color={COLOR_FULLY_VACCINATED}
                    hasFullWidthBackground
                  />
                </Box>
              </Cell>
            </Row>
          ))}
        </tbody>
      </StyledTable>
    </Box>
  );
}

function Percentage({ value, color }: { value: number; color: string }) {
  const { formatPercentage } = useIntl();

  return (
    <InlineText
      variant="body2"
      textAlign="right"
      css={css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        pr: asResponsiveArray({ _: 3, xl: 4 }),
      })}
    >
      <Box
        width={10}
        height={10}
        backgroundColor={color}
        borderRadius="50%"
        mr={2}
      />
      {`${formatPercentage(value)}%`}
    </InlineText>
  );
}

function PercentageBars() {
  if (isPresent(data.fully_vaccinated_percentage_label)) {
    parsedVaccinatedLabel = parseFullyVaccinatedPercentageLabel(
      data.fully_vaccinated_percentage_label
    );
  }

  return (
    <>
      {isPresent(parsedVaccinatedLabel) ? (
        <KpiValue
          text={
            parsedVaccinatedLabel.sign === '>'
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
                )
          }
        />
      ) : (
        <Percentage
          value={item.fully_vaccinated_percentage}
          color={COLOR_FULLY_VACCINATED}
        />
      )}
    </>
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
    borderBottom: '1px solid',
    borderColor: 'silver',
  })
);

const HeaderCell = styled.th(
  css({
    textAlign: 'left',
    fontWeight: 'bold',
    verticalAlign: 'middle',
    pb: 2,
  })
);

const Cell = styled.td(
  css({
    py: 3,
    verticalAlign: 'middle',
  })
);
