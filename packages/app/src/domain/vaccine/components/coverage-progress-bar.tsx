import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { useBreakpoints } from '~/utils/use-breakpoints';

export function CoverageProgressBar(props: {
  partialCount: number;
  partialPercentage: number;
  fullCount: number;
  fullPercentage: number;
  total: number;
  isLarge: boolean;
}) {
  const {
    partialCount,
    fullCount,
    fullPercentage,
    partialPercentage,
    isLarge,
  } = props;
  const { siteText } = useIntl();
  const {
    partially: partialLabel,
    fully: fullLabel,
  } = siteText.vaccinaties.vaccination_coverage;

  const breakpoints = useBreakpoints(true);

  const barHeight = breakpoints.md ? (isLarge ? 26 : 16) : 11;

  const partialColor = '#239BE6';
  const fullColor = '#005083';

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

            <rect
              x={0}
              y={0}
              width={`${fullPercentage}%`}
              height={barHeight}
              fill={fullColor}
            />
            <rect
              x={`${fullPercentage}%`}
              y={0}
              width={`${partialPercentage}%`}
              height={barHeight}
              fill={partialColor}
            />

            <rect
              /**
               * Render a white divider of 2px which covers 1px off each bar.
               */
              x={`calc(${fullPercentage}% - 1px)`}
              y={0}
              width={2}
              height={barHeight}
              fill="white"
            />
          </g>
        </svg>
      </Box>
      <Box display="flex" spacing={2} spacingHorizontal>
        <LegendItem
          color={fullColor}
          percentage={fullPercentage}
          label={fullLabel}
          count={fullCount}
        />
        <LegendItem
          color={partialColor}
          percentage={partialPercentage}
          label={partialLabel}
          count={partialCount}
        />
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

function LegendItem({
  color,
  percentage,
  count,
  label,
}: {
  color: string;
  percentage: number;
  count: number;
  label: string;
}) {
  const { formatPercentage, formatNumber } = useIntl();
  return (
    <Box display="flex">
      <Box>
        <ColorIndicator color={color} />
      </Box>
      <InlineText fontSize={{ _: 1, md: 2 }}>
        {`${formatPercentage(percentage, {
          maximumFractionDigits: 1,
        })}% ${label} (${formatNumber(count)})`}
      </InlineText>
    </Box>
  );
}
