import { scaleQuantile, scaleThreshold } from 'd3-scale';
import { useRef } from 'react';
import { ScreenReaderOnly } from '~/components/screenReaderOnly';
import siteText from '~/locale/index';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { useDynamicScale } from '~/utils/useDynamicScale';
import styles from './styles.module.scss';

type GradientStop = {
  color: string;
  value: number;
};

type BarscaleProps = {
  min: number;
  max: number;
  value: number;
  signaalwaarde?: number;
  gradient: GradientStop[];
  id: string;
  screenReaderText: string;
  rangeKey: string;
  showAxis?: boolean;
};

export function BarScale({
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

  const { scale } = useDynamicScale(min, max, rangeKey, value);

  const text = siteText.common.barScale;

  const [xMin, xMax] = scale.domain();

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
            <clipPath id={`cut-off${id}-${rand.current}`}>
              <rect
                x="0"
                y={36}
                rx="2"
                ry="2"
                width={`${scale(value)}%`}
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
                  offset={`${scale(value)}%`}
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
              clipPath={`url(#cut-off${id}-${rand.current})`}
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
              x1={`${scale(value)}%`}
              x2={`${scale(value)}%`}
              y1={46}
              y2={26}
              strokeWidth="3"
              stroke="#000"
            />

            <text
              className={styles.value}
              x={`${scale(value)}%`}
              y={16}
              textAnchor={textAlign(scale(value) ?? 0) as any}
            >{`${formatNumber(value)}`}</text>
          </g>

          {signaalwaarde && showAxis && (
            <g>
              <line
                x1={`${scale(signaalwaarde)}%`}
                x2={`${scale(signaalwaarde)}%`}
                y1={56}
                y2={46}
                strokeWidth="3"
                stroke="#595959"
              />
              <text
                className={styles.criticalValue}
                x={`${scale(signaalwaarde)}%`}
                y={72}
                textAnchor={textAlign(scale(signaalwaarde) ?? 0) as any}
              >
                {text.signaalwaarde}: {`${formatNumber(signaalwaarde)}`}
              </text>
            </g>
          )}

          {showAxis && (
            <g>
              <text x={`${scale(xMin)}%`} y={64} className={styles.tick}>
                {`${formatNumber(xMin)}`}
              </text>
              <text
                x={`${scale(xMax)}%`}
                y={64}
                className={styles.tick}
                textAnchor="end"
              >
                {`${formatNumber(xMax)}`}
              </text>
            </g>
          )}
        </svg>
      </div>
    </>
  );
}
