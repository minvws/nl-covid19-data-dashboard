import styled from 'styled-components';
import { Text } from '~/components-styled/typography';
import { colors } from '~/style/theme';
import { formatDateFromMilliseconds } from '~/utils/formatDate';
import { TrendValue, Value } from '../helpers';
import { ChartPadding } from './chart';

type ColorProps = {
  indicatorColor: string;
};

const Label = styled.div`
  pointer-events: none;
  background-color: white;
`;

const DottedLine = styled.div<ColorProps>`
  pointer-events: none;
  width: 1px;
  border-left-width: 1px;
  border-left-style: dashed;
  border-left-color: ${(props) => props.indicatorColor || 'black'};
`;

const Point = styled.div<ColorProps>`
  pointer-events: none;
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
    transform: translate(0, -50%);
    border-radius: 50%;
    background: ${(props) => props.indicatorColor || 'black'};
    opacity: 0.2;
  }
`;

const MarkerContainer = styled.div`
  transform: translate(-50%, 0);
  pointer-events: none;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 0;
  flex-shrink: 0;
  min-width: 5em;
`;

type MarkerProps<T> = {
  x: number;
  y: number;
  height: number;
  primaryColor?: string;
  data: any;
  padding: ChartPadding;
  showLine: boolean;
  formatLabel?: (data: T) => string;
};

export function Marker<T>(props: MarkerProps<T>) {
  const {
    primaryColor = colors.data.primary,
    x,
    y,
    data,
    height,
    padding,
    showLine = false,
    formatLabel = defaultFormatLabel,
  } = props;

  return (
    <MarkerContainer style={{ top: y, left: x }}>
      <Point indicatorColor={primaryColor} />
      {showLine && (
        <>
          <DottedLine
            indicatorColor={primaryColor}
            style={{
              height: `${height - y - (padding.top + padding.bottom + 6)}px`,
            }}
          />
          <Label>
            <Text fontSize={0} fontWeight="bold" m={0}>
              {formatLabel(data)}
            </Text>
          </Label>
        </>
      )}
    </MarkerContainer>
  );
}

function defaultFormatLabel<T extends Value & TrendValue>(data: T): string {
  return formatDateFromMilliseconds(data.__date.getTime());
}
