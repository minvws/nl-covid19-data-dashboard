import { AxisBottom, AxisLeft } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { ParentSize } from '@visx/responsive';
import { Box, BoxProps } from '~/components-styled/base';
import { LineChart } from '~/components-styled/line-chart';
import { ComponentCallbackInfo } from '~/components-styled/line-chart/components/chart';
import { Value } from '~/components-styled/line-chart/helpers';
import { Heading } from '~/components-styled/typography';
import { formatDateFromMilliseconds } from '~/utils/formatDate';
import { formatNumber } from '~/utils/formatNumber';

type MiniTrendTileProps<T extends Value> = {
  icon: JSX.Element;
  title: string;
  text: string;
  trendData: T[];
  metricProperty: keyof T;
} & BoxProps;

export function MiniTrendTile<T extends Value>(props: MiniTrendTileProps<T>) {
  const { icon, title, text, trendData, metricProperty, ...boxProps } = props;
  return (
    <Box {...(boxProps as any)} display="flex" flexDirection="column">
      <Box flexDirection="row" display="flex">
        {icon}
        <Heading level={4} as="h2">
          {title}
        </Heading>
      </Box>
      <Box>{text}</Box>
      <Box>
        <ParentSize>
          {(parent) => (
            <LineChart
              width={parent.width}
              timeframe="5weeks"
              values={trendData}
              linesConfig={[{ metricProperty }]}
              componentCallback={componentCallback}
              showMarkerLine={true}
              formatTooltip={(value: TrendValue) => formatNumber(value.__value)}
            />
          )}
        </ParentSize>
      </Box>
    </Box>
  );
}

function componentCallback(callbackInfo: ComponentCallbackInfo) {
  switch (callbackInfo.type) {
    case 'GridRows': {
      const domain = callbackInfo.configuration.scale.domain();
      const lastItem = domain[domain.length - 1];
      return (
        <GridRows
          {...(callbackInfo.configuration as any)}
          tickValues={[0, lastItem / 2, lastItem]}
        />
      );
    }
    case 'AxisBottom': {
      const domain = callbackInfo.configuration.scale.domain();
      const tickFormat = (d: Date) => {
        if (d === domain[0]) {
          return callbackInfo.configuration.tickFormat(d);
        }
        return formatLastDate(d);
      };

      const tickLabelProps = (value: Date, index: number) => {
        const labelProps = callbackInfo.configuration.tickLabelProps
          ? callbackInfo.configuration.tickLabelProps(value, index)
          : {};
        labelProps.textAnchor = value === domain[0] ? 'start' : 'middle';
        return labelProps;
      };

      return (
        <AxisBottom
          {...(callbackInfo.configuration as any)}
          tickLabelProps={tickLabelProps}
          tickFormat={tickFormat}
          tickValues={domain}
        />
      );
    }
    case 'AxisLeft': {
      const domain = callbackInfo.configuration.scale.domain();
      const lastItem = domain[domain.length - 1];
      return (
        <AxisLeft
          {...(callbackInfo.configuration as any)}
          tickValues={[lastItem]}
        />
      );
    }
  }
}

const DAY_IN_SECONDS = 24 * 60 * 60;
function formatLastDate(date: Date) {
  const days = Math.floor(
    (Date.now() / 1000 - date.valueOf() / 1000) / DAY_IN_SECONDS
  );

  if (days < 1) {
    return 'vandaag';
  }

  if (days < 2) {
    return 'gisteren';
  }

  return formatDateFromMilliseconds(date.getTime(), 'short');
}
