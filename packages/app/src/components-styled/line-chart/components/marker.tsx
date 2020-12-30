import styled from 'styled-components';
import { Text } from '~/components-styled/typography';
import { colors } from '~/style/theme';
import { formatDateFromMilliseconds } from '~/utils/formatDate';
import { HoverPoint } from '..';
import { TrendValue, Value } from '../helpers';
import { ChartPadding } from './chart-axes';

type ColorProps = {
  indicatorColor: string;
};

const Label = styled.div`
  background-color: white;
`;

const DottedLine = styled.div<ColorProps>`
  width: 1px;
  border-left-width: 1px;
  border-left-style: dashed;
  border-left-color: ${(props) => props.indicatorColor || 'black'};
`;

const Point = styled.div<ColorProps>`
  position: relative;
  height: 18px;
  width: 18px;

  &::after {
    content: '';
    position: absolute;
    height: 8px;
    width: 8px;
    transform: translate(50%, -50%);
    border-radius: 50%;
    border: 1px solid white;
    background: ${(props) => props.indicatorColor || 'black'};
  }

  &::before {
    content: '';
    position: absolute;
    height: 18px;
    width: 18px;
    transform: translate(0, -45%);
    border-radius: 50%;
    background: ${(props) => props.indicatorColor || 'black'};
    opacity: 0.2;
  }
`;

const MarkerContainer = styled.div`
  transform: translate(-50%, 0);
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 0;
  flex-shrink: 0;
  min-width: 26px;
  background-color: rgba(0, 0, 0, 0.03);
`;

type MarkerProps<T> = {
  data: HoverPoint<T>[];
  height: number;
  primaryColor?: string;
  padding: ChartPadding;
  showLine: boolean;
  formatLabel?: (data: T & Value & TrendValue) => string;
};

export function Marker<T>(props: MarkerProps<T>) {
  const {
    primaryColor = colors.data.primary,
    data,
    height,
    padding,
    showLine = false,
    formatLabel = defaultFormatLabel,
  } = props;

  return (
    <MarkerContainer
      style={{
        top: padding.top,
        left: data[0].x + padding.left,
        height: height - (padding.top + padding.bottom),
      }}
    >
      {data.map((d, index) => (
        <Point indicatorColor={d.color} style={{ top: d.y - index * 18 }} />
      ))}

      {showLine && (
        <>
          <DottedLine
            indicatorColor={primaryColor}
            style={{
              height: `${
                height - data[0].y - (padding.top + padding.bottom + 6)
              }px`,
            }}
          />
          <Label>
            <Text fontSize={0} fontWeight="bold" m={0}>
              {formatLabel(data[0].data)}
            </Text>
          </Label>
        </>
      )}
    </MarkerContainer>
  );
}

function defaultFormatLabel<T>(data: T & Value & TrendValue): string {
  return formatDateFromMilliseconds(data.__date.getTime());
}
