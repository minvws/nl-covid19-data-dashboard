import { NlVaccineCoveragePerAgeGroupValue } from '@corona-dashboard/common';
import { css } from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { InlineText } from '~/components-styled/typography';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { useDynamicScale } from '~/utils/useDynamicScale';
import { Box } from '../base';

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
      {values.map((value) => (
        <CoverageRow hideBorder={value.age_group_range === 'total'}>
          <Agegroup
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
          <CoverageProgress
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

function Agegroup(props: { range: string; total: string }) {
  const { range, total } = props;
  return (
    <Box flex="display" flexDirection="column">
      <Box>
        <InlineText fontWeight="bold" fontSize={3}>
          {range}
        </InlineText>
      </Box>
      <Box as="span">
        <InlineText>{total}</InlineText>
      </Box>
    </Box>
  );
}

function VaccinationCoverage(props: { value: string }) {
  const { value } = props;
  return (
    <InlineText color="blue" fontSize={4} fontWeight="bold">
      {value}
    </InlineText>
  );
}

function CoverageProgress(props: {
  partially: number;
  fully: number;
  fullyPercentage: number;
  total: number;
}) {
  const { partially, fully, fullyPercentage, total } = props;
  const partialPercentage = (partially / total) * 100;
  const { siteText, formatPercentage, formatNumber } = useIntl();
  const {
    partial: partialLabel,
    fully: fullyLabel,
  } = siteText.vaccinaties.vaccination_coverage;

  const high = Math.max(partially, fully);
  const scale = useDynamicScale(high, 0, total);

  // sort shortest bar on top
  const values = [partialPercentage, fullyPercentage].sort().reverse();

  return (
    <Box>
      <Box height="2rem" width="90%">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          css={css({
            width: '100%',
            height: '100%',
            overflow: 'visible',
            shapeRendering: 'crispEdges',
          })}
        >
          <g>
            <rect x="0" y={13} width="100%" height="3" fill="#C1C1C1" />
            <rect
              x="0"
              y={0}
              width={`${values[0]}%`}
              height="16"
              fill="#239BE6"
            />
            <rect
              x="0"
              y={0}
              width={`${values[1]}%`}
              height="16"
              fill="#005083"
            />
            <line
              x1={`${values[1]}%`}
              x2={`${values[1]}%`}
              y1={0}
              y2={16}
              strokeWidth="3"
              stroke="white"
            />
          </g>
          <g>
            <line
              x1={`${scale(high)}%`}
              x2={`${scale(high)}%`}
              y1={-7}
              y2={16}
              strokeWidth="7"
              stroke="#232423"
            />
          </g>
        </svg>
      </Box>
      <Box display="flex">
        <Box display="flex" alignItems="stretch">
          <Box>
            <ColorIndicator color="#239BE6" />
          </Box>
          <Box>
            <InlineText>
              {formatPercentage(fullyPercentage, { maximumFractionDigits: 1 })}%
              {` ${fullyLabel} `}({formatNumber(fully)})
            </InlineText>
          </Box>
        </Box>
        <Box display="flex" alignItems="stretch" ml={2}>
          <Box>
            <ColorIndicator color="#005083" />
          </Box>
          <Box>
            <InlineText>
              {formatPercentage(partialPercentage, {
                maximumFractionDigits: 1,
              })}
              % {` ${partialLabel} `}({formatNumber(partially)})
            </InlineText>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

type CoverageRowProps = {
  children: [ReactNode, ReactNode, ReactNode];
  hideBorder?: boolean;
};

function CoverageRow(props: CoverageRowProps) {
  const { children, hideBorder = false } = props;
  return (
    <Row hideBorder={hideBorder}>
      <Box flex="0.4">{children[0]}</Box>
      <Box
        flex="0.4"
        justifyContent="center"
        display="flex"
        alignContent="center"
      >
        {children[1]}
      </Box>
      <Box flex="1">{children[2]}</Box>
    </Row>
  );
}

const Row = styled(Box)<{ hideBorder: boolean }>(({ hideBorder }) => {
  const cssProps = hideBorder
    ? { display: 'flex', alignContent: 'center' }
    : {
        display: 'flex',
        justifyContent: 'stretch',
        borderBottomColor: 'border',
        borderBottomStyle: 'solid',
        borderBottomWidth: '1px',
        pb: 3,
        mb: 4,
      };
  return css(cssProps as any);
});

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

const ColorIndicator = styled.span<{
  color?: string;
}>`
  content: '';
  display: ${(x) => (x.color ? 'inline-block' : 'none')};
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background: ${(x) => x.color || 'none'};
  margin-right: 0.2em;
  flex-shrink: 0;
`;
