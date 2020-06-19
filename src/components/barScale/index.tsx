import { useRef, FunctionComponent } from 'react';
import formatNumber from 'utils/formatNumber';

type BarscaleProps = {
  min: number;
  max: number;
  value: number;
  kritiekeWaarde?: number;
  gradient: any;
  id: string;
};

const BarScale: FunctionComponent<BarscaleProps> = ({
  min,
  max,
  value,
  kritiekeWaarde,
  gradient,
  id,
}) => {
  const valueOffset = ((value - min) / (max - min)) * 100;
  const rand = useRef(Math.random().toString(36).substring(2, 15));

  if (typeof value === 'undefined') {
    return null;
  }

  // let fontSize = '120%';
  // if (value.toString().length > 2) {
  //   fontSize = '110%';
  // }
  // if (value.toString().length > 3) {
  //   fontSize = '100%';
  // }

  const drawValue = (value) => {
    const offset = ((value - min) / (max - min)) * 100;

    let textAlignStyle = 'middle';
    if (offset > 66) {
      textAlignStyle = 'end';
    }
    if (offset < 33) {
      textAlignStyle = 'start';
    }

    return (
      <text
        className="value"
        x={`${offset}%`}
        y={0}
        textAnchor={textAlignStyle}
      >{`${formatNumber(value)}`}</text>
    );
  };

  const drawKritiekeWaarde = (kritiekeWaarde) => {
    if (kritiekeWaarde) {
      const offset = ((kritiekeWaarde - min) / (max - min)) * 100;
      return (
        <line
          x1={`${offset}%`}
          x2={`${offset}%`}
          y1="40"
          y2="30"
          r={valueOffset}
          strokeWidth="3"
          stroke="#595959"
        />
      );
    }
    return null;
  };

  const drawKritiekeWaardeLabel = (kritiekeWaarde) => {
    if (kritiekeWaarde) {
      const offset = ((kritiekeWaarde - min) / (max - min)) * 100;

      let textAlignStyle = 'middle';
      if (offset > 66) {
        textAlignStyle = 'end';
      }

      if (offset < 33) {
        textAlignStyle = 'start';
      }

      return (
        <text
          className="kritLabel"
          x={`${offset}%`}
          y={61}
          textAnchor={textAlignStyle}
        >{`Signaalwaarde: ${kritiekeWaarde}`}</text>
      );
    }
    return null;
  };

  return (
    <div className="barScale">
      <svg xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id={`cut-off${id}-${rand.current}`}>
            <rect
              x="0"
              y="20"
              rx="2"
              ry="2"
              width={`${valueOffset}%`}
              height="10"
              fill="red"
            />
          </clipPath>
          <linearGradient
            id={`barColor${id}-${rand.current}`}
            gradientUnits="userSpaceOnUse"
          >
            {gradient.map((stop) => {
              return (
                <stop
                  key={`stop${stop.offset}`}
                  stopColor={stop.color}
                  offset={stop.offset}
                />
              );
            })}
          </linearGradient>
        </defs>

        <rect
          x="0"
          y="20"
          rx="2"
          ry="2"
          width="100%"
          height="10"
          clipPath={`url(#cut-off${id}-${rand.current})`}
          fill={`url(#barColor${id}-${rand.current})`}
        />
        <rect
          x="0"
          y="26"
          rx="2"
          ry="2"
          width="100%"
          height="4"
          fill={`url(#barColor${id}-${rand.current})`}
        />
        <line
          x1={`${valueOffset}%`}
          x2={`${valueOffset}%`}
          y1="30"
          y2="10"
          r={valueOffset}
          strokeWidth="3"
          stroke="#000"
        />
        {drawKritiekeWaarde(kritiekeWaarde)}
        {drawKritiekeWaardeLabel(kritiekeWaarde)}
        {drawValue(value)}
      </svg>

      <div className="scale">
        <div className="minValue">{min}</div>
        <div className="maxValue">{max}</div>
      </div>
    </div>
  );
};

export default BarScale;
