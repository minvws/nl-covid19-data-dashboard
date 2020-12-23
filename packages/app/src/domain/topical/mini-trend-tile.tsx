import { ParentSize } from '@visx/responsive';
import { Box } from '~/components-styled/base';
import { LineChart } from '~/components-styled/line-chart';
import { Value } from '~/components-styled/line-chart/helpers';
import { Tile } from '~/components-styled/tile';
import { Heading } from '~/components-styled/typography';

type MiniTrendTileProps<T extends Value> = {
  icon: JSX.Element;
  title: string;
  text: string;
  trendData: T[];
};

export function MiniTrendTile<T extends Value>(props: MiniTrendTileProps<T>) {
  const { icon, title, text, trendData } = props;
  return (
    <Tile>
      {icon}
      <Heading level={2}>{title}</Heading>
      <Box>{text}</Box>
      <Box>
        <ParentSize>
          {(parent) => (
            <LineChart
              width={parent.width}
              timeframe="5weeks"
              values={trendData}
            />
          )}
        </ParentSize>
      </Box>
    </Tile>
  );
}
