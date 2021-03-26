import css from '@styled-system/css';
import { useMemo } from 'react';
import styled from 'styled-components';
import { Box } from '~/components-styled/base';
import { InlineText } from '~/components-styled/typography';
import { useIntl } from '~/intl';
import { useBreakpoints } from '~/utils/useBreakpoints';
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
  const breakpoints = useBreakpoints(true);
  const rectHeight = breakpoints.md ? 16 : 11;

  // sort shortest bar on top
  const barData = useMemo(() => {
    return [
      {
        percentage: fullyPercentage,
        value: fully,
        label: fullyLabel,
        color: '#005083',
      },
      {
        percentage: partialPercentage,
        value: partially,
        label: partialLabel,
        color: '#239BE6',
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
    <Box width="100%" mt={{ _: 4, md: 0 }}>
      <Box height={rectHeight * 2} width={{ _: undefined, md: '90%' }}>
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
              y={rectHeight - 3}
              width="100%"
              height="3"
              fill="#C1C1C1"
            />
            {barData.map((data) => (
              <rect
                x={0}
                y={0}
                width={`${data.percentage}%`}
                height={rectHeight}
                fill={data.color}
              />
            ))}
            <rect
              x={`${barData[barData.length - 1].percentage}%`}
              y={0}
              width="3"
              height={rectHeight}
              fill="white"
            />
          </g>
          <g>
            <rect
              x={`${scale(maxValue)}%`}
              y={rectHeight - (rectHeight + 7)}
              width="7"
              height={rectHeight + 7}
              fill="black"
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
              <InlineText fontSize={{ _: 1, md: 2 }}>
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
