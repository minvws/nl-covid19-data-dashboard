import css from '@styled-system/css';
import { useMemo } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useDynamicScale } from '~/utils/use-dynamic-scale';

export function CoverageProgressBar(props: {
  partiallyVaccinated: number;
  fullyVaccinated: number;
  fullyPercentage: number;
  partiallyPercentage: number;
  total: number;
  showTotals: boolean;
}) {
  const {
    partiallyVaccinated,
    fullyVaccinated,
    fullyPercentage,
    partiallyPercentage,
    total,
    showTotals,
  } = props;
  const { siteText, formatPercentage, formatNumber } = useIntl();
  const { partially: partialLabel, fully: fullyLabel } =
    siteText.vaccinaties.vaccination_coverage;
  const maxValue = Math.max(partiallyVaccinated, fullyVaccinated);
  const scale = useDynamicScale(maxValue, 0, total);
  const breakpoints = useBreakpoints(true);
  const barHeight = breakpoints.md ? (showTotals ? 26 : 16) : 11;

  // sort shortest bar on top
  const barData = useMemo(() => {
    return [
      {
        percentage: fullyPercentage,
        value: fullyVaccinated,
        label: fullyLabel,
        color: '#005083',
      },
      {
        percentage: partiallyPercentage,
        value: partiallyVaccinated,
        label: partialLabel,
        color: '#239BE6',
      },
    ]
      .sort((a, b) => b.value - a.value)
      .filter((x) => x.value > 0);
  }, [
    fullyPercentage,
    fullyVaccinated,
    fullyLabel,
    partiallyPercentage,
    partiallyVaccinated,
    partialLabel,
  ]);

  return (
    <Box width="100%" mt={{ _: 4, md: 0 }}>
      <Box height={barHeight + 8} width={{ md: '90%' }}>
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
            <rect
              x="0"
              y={barHeight - 3}
              width="100%"
              height="3"
              fill="#C1C1C1"
            />
            {barData.map((data) => (
              <rect
                key={data.color}
                x={0}
                y={0}
                width={`${data.percentage}%`}
                height={barHeight}
                fill={data.color}
              />
            ))}
            {barData.length > 1 && (
              <rect
                x={`${barData[barData.length - 1].percentage}%`}
                y={0}
                width={3}
                height={barHeight}
                fill="white"
              />
            )}
          </g>
          <g>
            <rect
              x={`${scale(maxValue)}%`}
              y={barHeight - (barHeight + 7)}
              width={7}
              height={barHeight + 7}
              fill="black"
            />
          </g>
        </svg>
      </Box>
      <Box display="flex">
        {[...barData].reverse().map((data, index) => (
          <Box
            display="flex"
            alignItems="stretch"
            ml={index === 0 ? 0 : 2}
            key={data.color}
          >
            <Box>
              <ColorIndicator color={data.color} />
            </Box>
            <Box>
              <InlineText fontSize={{ _: 1, md: 2 }}>
                {formatPercentage(data.percentage, {
                  maximumFractionDigits: 1,
                })}
                {'% '}
                {data.label} ({formatNumber(data.value)})
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
