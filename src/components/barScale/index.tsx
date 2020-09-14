import styles from './styles.module.scss';
import { useRef } from 'react';
import formatNumber from 'utils/formatNumber';
import ScreenReaderOnly from 'components/screenReaderOnly';
import replaceVariablesInText from 'utils/replaceVariablesInText';
import { scaleQuantile, scaleThreshold } from 'd3-scale';

import useDynamicScale from 'utils/useDynamicScale';
import siteText from 'locale';

type GradientStop = {
  color: string;
  value: number;
};

type BarscaleProps = {
  min: number;
  max: number;
  value: number | null | undefined;
  signaalwaarde?: number;
  gradient: GradientStop[];
  id: string;
  screenReaderText: string;
  rangeKey: string;
  showAxis?: boolean;
};

export default BarScale;

function BarScale({
  min,
  max,
  value,
  signaalwaarde,
  gradient,
  id,
  screenReaderText,
  rangeKey,
  showAxis,
}: BarscaleProps) {
  // Generate a random ID used for clipPath and linearGradient ID's.
  const rand = useRef(Math.random().toString(36).substring(2, 15));

  const { scale: x } = useDynamicScale(min, max, rangeKey, value);

  const text: typeof siteText.common.barScale = siteText.common.barScale;

  const clipPathId = useRef(`cut-off${id}-${rand.current}`);

  if (!x) {
    return null;
  }

  if (typeof value === 'undefined' || value === null) {
    return null;
  }

  const [xMin, xMax] = x.domain();

  const textAlign = scaleThreshold()
    .domain([20, 80])
    .range(['start', 'middle', 'end'] as any);

  const color = scaleQuantile()
    .domain(gradient.map((el) => el.value))
    .range(gradient.map((el) => el.color) as any);

  return (
    <>
      <ScreenReaderOnly>
        {replaceVariablesInText(screenReaderText, {
          value: String(value),
          signaalwaarde: String(signaalwaarde),
        })}
      </ScreenReaderOnly>

      <div className={styles.root} aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id={clipPathId.current}>
              <rect
                x="0"
                y={36}
                rx="2"
                ry="2"
                width={`${x(value)}%`}
                height="10"
                fill="black"
              />
            </clipPath>
            <linearGradient
              id={`barColor${id}-${rand.current}`}
              gradientUnits="userSpaceOnUse"
            >
              {color.domain().map((value: any) => (
                <stop
                  key={`stop-${value}`}
                  stopColor={color(value) as any}
                  offset={`${x(value)}%`}
                />
              ))}
            </linearGradient>
          </defs>

          <g>
            <rect
              x="0"
              y={36}
              rx="2"
              ry="2"
              width="100%"
              height="10"
              clipPath={`url(#${clipPathId.current})`}
              fill={`url(#barColor${id}-${rand.current})`}
            />
            <rect
              x="0"
              y={42}
              rx="2"
              ry="2"
              width="100%"
              height="4"
              fill={`url(#barColor${id}-${rand.current})`}
            />
          </g>

          <g>
            <line
              x1={`${x(value)}%`}
              x2={`${x(value)}%`}
              y1={46}
              y2={26}
              strokeWidth="3"
              stroke="#000"
            />

            <text
              className={styles.value}
              x={`${x(value)}%`}
              y={16}
              textAnchor={textAlign(x(value)) as any}
            >{`${formatNumber(value)}`}</text>
          </g>

          {signaalwaarde && showAxis && (
            <g>
              <line
                x1={`${x(signaalwaarde)}%`}
                x2={`${x(signaalwaarde)}%`}
                y1={56}
                y2={46}
                strokeWidth="3"
                stroke="#595959"
              />
              <text
                className={styles.criticalValue}
                x={`${x(signaalwaarde)}%`}
                y={72}
                textAnchor={textAlign(x(signaalwaarde)) as any}
              >
                {text.signaalwaarde}: {signaalwaarde}
              </text>
            </g>
          )}

          {showAxis && (
            <g>
              <text x={`${x(xMin)}%`} y={64} className={styles.tick}>
                {xMin}
              </text>
              <text
                x={`${x(xMax)}%`}
                y={64}
                className={styles.tick}
                textAnchor="end"
              >
                {xMax}
              </text>
            </g>
          )}
        </svg>
      </div>
    </>
  );
}
