import { colors, DifferenceDecimal } from '@corona-dashboard/common';
import { space } from '~/style/theme';
import { TableText } from '../types';
import { TrendDirection, TrendIcon } from '~/components/trend-icon';
import { useIntl } from '~/intl';
import styled from 'styled-components';

interface VariantDifferenceProps {
  isWideTable?: boolean;
  text: TableText;
  value: DifferenceDecimal;
}

export const VariantDifference = ({ value, text, isWideTable }: VariantDifferenceProps) => {
  const { formatPercentage } = useIntl();

  const options = {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  };

  let returnValue: React.ReactNode = (
    <Difference color={colors.neutral} hasDifference={false} isWideTable={isWideTable}>
      <span>{text.verschil.gelijk}</span>
    </Difference>
  );

  const renderingConditionMapping = [
    {
      condition: value === undefined,
      renderingValue: <>-</>,
    },
    {
      condition: value?.difference > 0,
      renderingValue: (
        <Difference color={colors.black}>
          <TrendIcon trendDirection={TrendDirection.UP} />
          {formatPercentage(value.difference, options)} {text.verschil.meer}
        </Difference>
      ),
    },
    {
      condition: value?.difference < 0,
      renderingValue: (
        <Difference color={colors.black}>
          <TrendIcon trendDirection={TrendDirection.DOWN} />
          {formatPercentage(-value.difference, options)} {text.verschil.minder}
        </Difference>
      ),
    },
  ];

  renderingConditionMapping.forEach((mapping) => {
    const { condition, renderingValue } = mapping;
    if (condition) {
      returnValue = renderingValue;
    }
  });

  return <>{returnValue}</>;
};

interface DifferenceProps {
  color: string;
  hasDifference?: boolean;
  isWideTable?: boolean;
}

const Difference = styled.div<DifferenceProps>`
  span {
    /* The value of space[3] is a combination of the icon width plus the icon's margin-right */
    padding-left: ${({ hasDifference, isWideTable }) => (!hasDifference && isWideTable ? space[3] : undefined)};
  }

  svg {
    color: ${({ color }) => color};
    margin-right: ${space[1]};
    width: 12px;
    height: 12px;
    vertical-align: middle;
  }
`;
