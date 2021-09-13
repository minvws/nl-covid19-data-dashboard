import css from '@styled-system/css';
import { Box } from '~/components/base';
import { colors } from '~/style/theme';

export const partialColor = colors.data.multiseries.cyan;
export const fullColor = colors.data.multiseries.cyan_dark;

const MARKER_WIDTH = 7;
const BAR_HORIZONTAL_SPACING = 5;
const BAR_HEIGHT = 9;

export function CoverageProgressBar(props: {
  partialCount: number;
  partialPercentage: number;
  fullCount: number;
  fullPercentage: number;
  total: number;
}) {
  const { fullPercentage, partialPercentage } = props;

  const containerHeight = BAR_HEIGHT * 2 + BAR_HORIZONTAL_SPACING;

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
            <rect x={0} y={0} width="100%" height={BAR_HEIGHT} fill="#E6E6E6" />
            <rect
              x={0}
              y={0}
              width={`${partialPercentage}%`}
              height={BAR_HEIGHT}
              fill="#8FCAE7"
            />
            <rect
              x={0}
              y={containerHeight - BAR_HEIGHT}
              width="100%"
              height={BAR_HEIGHT}
              fill="#E6E6E6"
            />
            <rect
              x={0}
              y={containerHeight - BAR_HEIGHT}
              width={`${fullPercentage}%`}
              height={BAR_HEIGHT}
              fill="#007BC7"
            />
          </g>
        </svg>
      </Box>
    </Box>
  );
}
