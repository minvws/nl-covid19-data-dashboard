import styles from './styles.module.scss';
import { useRef, FunctionComponent } from 'react';
import ScreenReaderOnly from 'components/screenReaderOnly';
import { scaleQuantile, scaleThreshold } from 'd3-scale';

import { FormattedNumber } from 'react-intl';

import useDynamicScale from 'utils/useDynamicScale';

type GradientStop = {
  color: string;
  value: number;
};

type BarscaleProps = {
  min: number;
  max: number;
  value: number | null | undefined;
  kritiekeWaarde?: number;
  gradient: GradientStop[];
  id: string;
  screenReaderText: string;
};

const BarScale: FunctionComponent<BarscaleProps> = ({
  min,
  max,
  value,
  kritiekeWaarde,
  gradient,
  id,
  screenReaderText,
}) => {
  // Generate a random ID used for clipPath and linearGradient ID's.
  const rand = useRef(Math.random().toString(36).substring(2, 15));

  const { scale: x } = useDynamicScale(min, max, value);

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
      <ScreenReaderOnly>{screenReaderText}</ScreenReaderOnly>

      <div className={styles.root} aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id={`cut-off${id}-${rand.current}`}>
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
            >
              <FormattedNumber value={value} />
            </text>
          </g>

          {kritiekeWaarde && (
            <g>
              <line
                x1={`${x(kritiekeWaarde)}%`}
                x2={`${x(kritiekeWaarde)}%`}
                y1={56}
                y2={46}
                strokeWidth="3"
                stroke="#595959"
              />
              <text
                className={styles.criticalValue}
                x={`${x(kritiekeWaarde)}%`}
                y={72}
                textAnchor={textAlign(x(kritiekeWaarde)) as any}
              >{`Signaalwaarde: ${kritiekeWaarde}`}</text>
            </g>
          )}

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
        </svg>
      </div>
    </>
  );
};

export default BarScale;
