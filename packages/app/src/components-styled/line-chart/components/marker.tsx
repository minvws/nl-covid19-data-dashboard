import styled from 'styled-components';
import { Text } from '~/components-styled/typography';
import { colors } from '~/style/theme';
import { formatDateFromMilliseconds } from '~/utils/formatDate';
import { ChartMargins } from './chart';

type PointProps = {
  indicatorColor: string;
};

const Label = styled.div`
  pointer-events: none;
  background-color: white;
`;

const DottedLine = styled.div<PointProps>`
  pointer-events: none;
  width: 1px;
  border-left-width: 1px;
  border-left-style: dashed;
  border-left-color: ${(props) => props.indicatorColor || 'black'};
`;

const Point = styled.div<PointProps>`
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

type MarkerProps = {
  x: number;
  y: number;
  height: number;
  primaryColor?: string;
  data: any;
  margins: ChartMargins;
  showLine: boolean;
};

export function Marker(props: MarkerProps) {
  const {
    primaryColor = colors.data.primary,
    x,
    y,
    data,
    height,
    margins,
    showLine = false,
  } = props;

  return (
    <MarkerContainer style={{ top: y, left: x }}>
      <Point indicatorColor={primaryColor} />
      {showLine && (
        <>
          <DottedLine
            indicatorColor={primaryColor}
            style={{
              height: `${height - y - (margins.top + margins.bottom + 6)}px`,
            }}
          />
          <Label>
            <Text fontSize={0} fontWeight="bold" m={0}>
              {formatDateFromMilliseconds(data.__date.getTime())}
            </Text>
          </Label>
        </>
      )}
    </MarkerContainer>
  );
}
