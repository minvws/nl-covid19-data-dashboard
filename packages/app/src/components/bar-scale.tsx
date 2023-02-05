import css from '@styled-system/css';
import { scaleQuantile, scaleThreshold } from 'd3-scale';
import { Box } from '~/components/base';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useDynamicScale } from '~/utils/use-dynamic-scale';
import { VisuallyHidden } from './visually-hidden';

type GradientStop = {
  color: string;
  value: number;
};

type BarscaleProps = {
  min: number;
  max: number;
  value: number;
  limit?: number;
  gradient: GradientStop[];
  id: string;
  screenReaderText: string;
  showAxis?: boolean;
  showValue?: boolean;
};

export function BarScale({ min, max, value, limit, gradient, id, screenReaderText, showAxis, showValue }: BarscaleProps) {
  const scale = useDynamicScale(value, min, max);
  const { formatNumber } = useIntl();

  const [xMin] = scale.domain();

  const textAlign = scaleThreshold<number, 'start' | 'middle' | 'end'>()
    .domain([20, 80])
    .range(['start', 'middle', 'end'] as const);

  const color = scaleQuantile<string>()
    .domain(gradient.map((el) => el.value))
    .range(gradient.map((el) => el.color));

  return (
    <>
      <VisuallyHidden>
        {replaceVariablesInText(screenReaderText, {
          value: String(value),
          limit: String(limit),
        })}
      </VisuallyHidden>

      <Box height="5rem" aria-hidden="true">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          css={css({
            width: '100%',
            height: '100%',
            overflow: 'visible',
            shapeRendering: 'crispEdges',
          })}
        >
          <defs>
            <clipPath id={`${id}-cut-off`}>
              <rect x="0" y={36} rx="2" ry="2" width={`${scale(value)}%`} height="10px" fill="black" />
            </clipPath>
            <linearGradient id={`${id}-bar-color`} gradientUnits="userSpaceOnUse">
              {color.domain().map((value) => (
                <stop key={`stop-${value}`} stopColor={color(value)} offset={`${scale(value)}%`} />
              ))}
            </linearGradient>
          </defs>

          <g>
            <rect x="0" y={36} rx="2" ry="2" width="100%" height="10px" clipPath={`url(#${id}-cut-off)`} fill={`url(#${id}-bar-color)`} />
            <rect x="0" y={42} rx="2" ry="2" width="100%" height="4px" fill={`url(#${id}-bar-color)`} />
          </g>

          <g>
            <line x1={`${scale(value)}%`} x2={`${scale(value)}%`} y1={46} y2={26} strokeWidth="3" stroke="black" />

            {showValue && (
              <text
                x={`${scale(value)}%`}
                y={16}
                textAnchor={textAlign(scale(value) ?? 0)}
                css={css({
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  fill: 'black',
                })}
              >
                {`${formatNumber(value)}`}
              </text>
            )}
          </g>

          {limit && showAxis && (
            <g>
              {scale(limit) < 100 && <line x1={`${scale(limit)}%`} x2={`${scale(limit)}%`} y1={56} y2={46} strokeWidth="3" stroke="gray7" />}
              <text x={`${scale(limit)}%`} y={scale(limit) < 100 ? 72 : 64} textAnchor={textAlign(scale(limit) ?? 0)} css={css({ fill: 'gray7', fontSize: '0.875rem' })}>
                {`${formatNumber(limit)}`}
              </text>
            </g>
          )}

          {showAxis && (
            <g>
              <text x={`${scale(xMin)}%`} y={64} css={css({ fill: 'gray7', fontSize: '0.875rem' })}>
                {`${formatNumber(xMin)}`}
              </text>
            </g>
          )}
        </svg>
      </Box>
    </>
  );
}
