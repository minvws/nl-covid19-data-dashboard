import styled from 'styled-components';
import { Text } from '~/components-styled/typography';
import { colors } from '~/style/theme';
import { formatDateFromMilliseconds } from '~/utils/formatDate';
import { ChartPadding, ChartValue, HoverPoint } from './chart';

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
  background-color: rgba(0, 0, 255, 0.05);
`;

type MarkerProps = {
  data: HoverPoint[];
  height: number;
  primaryColor?: string;
  padding: ChartPadding;
  showLine: boolean;
  formatLabel?: (data: ChartValue) => string;
};

export function Marker(props: MarkerProps) {
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
      {data.map((d) => (
        <Point indicatorColor={primaryColor} style={{ top: d.y }} />
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

function defaultFormatLabel(data: ChartValue): string {
  return formatDateFromMilliseconds(data.__date.getTime());
}
