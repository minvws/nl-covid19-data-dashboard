import css from '@styled-system/css';
import styled from 'styled-components';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { useBreakpoints } from '~/utils/use-breakpoints';

export const partialColor = colors.data.multiseries.cyan;
export const fullColor = colors.data.multiseries.cyan_dark;

const MARKER_WIDTH = 7;

export function CoverageProgressBar(props: {
  partialCount: number;
  partialPercentage: number;
  fullCount: number;
  fullPercentage: number;
  total: number;
}) {
  const { partialCount, fullCount, fullPercentage, partialPercentage } = props;
  const { siteText } = useIntl();
  const { partially: partialLabel, fully: fullLabel } =
    siteText.vaccinaties.vaccination_coverage;
  const breakpoints = useBreakpoints(true);

  const barHeight = 11;
  const showCount = breakpoints.md;

  const markerHeight = barHeight + MARKER_WIDTH;
  const containerHeight = markerHeight;

  return (
    <Box width="100%" spacing={1}>
      <Box height={containerHeight} width={`calc(100% - ${MARKER_WIDTH}px)`}>
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
              x={0}
              y={containerHeight - barHeight}
              width="100%"
              height={barHeight}
              fill="#C1C1C1"
            />

            <rect
              x={0}
              y={containerHeight - barHeight}
              width={`${fullPercentage}%`}
              height={barHeight}
              fill={fullColor}
            />
            <rect
              x={`${fullPercentage}%`}
              y={containerHeight - barHeight}
              width={`${partialPercentage}%`}
              height={barHeight}
              fill={partialColor}
            />
            {fullPercentage && partialPercentage && (
              <rect
                x={`${fullPercentage}%`}
                y={containerHeight - barHeight}
                width={1}
                height={barHeight}
                fill="white"
              />
            )}
            {partialPercentage && (
              <rect
                x={`${fullPercentage + partialPercentage}%`}
                y={containerHeight - barHeight}
                width={1}
                height={barHeight}
                fill="white"
              />
            )}
          </g>
        </svg>
      </Box>
      <Box display="flex" spacingHorizontal={2}>
        <LegendItem
          color={fullColor}
          percentage={fullPercentage}
          label={fullLabel}
          count={showCount ? fullCount : undefined}
        />
        <LegendItem
          color={partialColor}
          percentage={partialPercentage}
          label={partialLabel}
          count={showCount ? partialCount : undefined}
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
  count?: number;
  label: string;
}) {
  const { formatPercentage, formatNumber } = useIntl();
  return (
    <Box display="flex" alignItems="baseline">
      <ColorIndicator color={color} />
      {isDefined(count) ? (
        <InlineText variant="label1">
          {`${formatPercentage(percentage, {
            maximumFractionDigits: 1,
            minimumFractionDigits: 1,
          })}% ${label} (${formatNumber(count)})`}
        </InlineText>
      ) : (
        <InlineText variant="label1">
          {`${formatPercentage(percentage, {
            maximumFractionDigits: 1,
            minimumFractionDigits: 1,
          })}% ${label}`}
        </InlineText>
      )}
    </Box>
  );
}
