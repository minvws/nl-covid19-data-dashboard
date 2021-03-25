import css from '@styled-system/css';
import { useMemo } from 'react';
import styled from 'styled-components';
import { Box } from '~/components-styled/base';
import { InlineText } from '~/components-styled/typography';
import { useIntl } from '~/intl';
import { useDynamicScale } from '~/utils/useDynamicScale';

export function CoverageProgressBar(props: {
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
  const maxValue = Math.max(partially, fully);
  const scale = useDynamicScale(maxValue, 0, total);

  // sort shortest bar on top
  const barData = useMemo(() => {
    return [
      {
        percentage: fullyPercentage,
        value: fully,
        label: fullyLabel,
        color: '#239BE6',
      },
      {
        percentage: partialPercentage,
        value: partially,
        label: partialLabel,
        color: '#005083',
      },
    ].sort((a, b) => b.value - a.value);
  }, [
    fullyPercentage,
    fully,
    fullyLabel,
    partialPercentage,
    partially,
    partialLabel,
  ]);

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
            {barData.map((data) => (
              <rect
                x="0"
                y={0}
                width={`${data.percentage}%`}
                height="16"
                fill={data.color}
              />
            ))}
            <line
              x1={`${barData[barData.length - 1].percentage}%`}
              x2={`${barData[barData.length - 1].percentage}%`}
              y1={0}
              y2={16}
              strokeWidth="3"
              stroke="white"
            />
          </g>
          <g>
            <line
              x1={`${scale(maxValue)}%`}
              x2={`${scale(maxValue)}%`}
              y1={-7}
              y2={16}
              strokeWidth="7"
              stroke="#232423"
            />
          </g>
        </svg>
      </Box>
      <Box display="flex">
        {[...barData].reverse().map((ld, index) => (
          <Box display="flex" alignItems="stretch" ml={index === 0 ? 0 : 2}>
            <Box>
              <ColorIndicator color={ld.color} />
            </Box>
            <Box>
              <InlineText>
                {formatPercentage(ld.percentage, { maximumFractionDigits: 1 })}%
                {` ${ld.label} `}({formatNumber(ld.value)})
              </InlineText>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
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
