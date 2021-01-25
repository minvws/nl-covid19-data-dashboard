import { AxisBottom, AxisLeft, TickFormatter } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { ParentSize } from '@visx/responsive';
import { ReactNode } from 'react';
import { Box } from '~/components-styled/base';
import { LineChart } from '~/components-styled/line-chart';
import { ComponentCallbackInfo } from '~/components-styled/line-chart/components';
import { NumberProperty, Value } from '~/components-styled/line-chart/helpers';
import { Heading, Text } from '~/components-styled/typography';
import text from '~/locale';
import { formatNumber } from '~/utils/formatNumber';
import styled from 'styled-components';
import css from '@styled-system/css';

type MiniTrendTileProps<T extends Value> = {
  icon: JSX.Element;
  title: string;
  text: ReactNode;
  trendData: T[];
  metricProperty: NumberProperty<T>;
};

export function MiniTrendTile<T extends Value>(props: MiniTrendTileProps<T>) {
  const { icon, title, text, trendData, metricProperty } = props;

  const value = trendData[trendData.length - 1][metricProperty];

  return (
    <Box position="relative" pb={{ _: '1.5rem', md: 0 }}>
      <Box width="4rem" height="4rem" position="absolute" left={0} mr={1}>
        {icon}
      </Box>
      <Heading
        level={3}
        as="h2"
        py={2}
        pl="3.5rem"
        mb={2}
        lineHeight={{ md: 0, lg: 2 }}
      >
        {title}
      </Heading>
      <Text fontSize="2.75rem" fontWeight="bold" my={0} lineHeight={0} mb={2}>
        {formatNumber((value as unknown) as number)}
      </Text>

      <StyledDiv>{text}</StyledDiv>

      <ParentSize>
        {(parent) => (
          <LineChart
            width={parent.width}
            timeframe="5weeks"
            values={trendData}
            height={140}
            linesConfig={[{ metricProperty }]}
            componentCallback={componentCallback}
            showMarkerLine
            formatTooltip={(values) => formatNumber(values[0].__value)}
            padding={{
              left: 0,
            }}
          />
        )}
      </ParentSize>
    </Box>
  );
}

function componentCallback(callbackInfo: ComponentCallbackInfo) {
  switch (callbackInfo.type) {
    case 'GridRows': {
      const domain = callbackInfo.props.scale.domain();
      const lastItem = domain[domain.length - 1];
      return (
        <GridRows
          {...(callbackInfo.props as any)}
          tickValues={[0, lastItem / 2, lastItem]}
        />
      );
    }
    case 'AxisBottom': {
      const domain = callbackInfo.props.scale.domain();
      const defaultTickFormat = callbackInfo.props.tickFormat;
      const tickFormat = (d: Date) => {
        if (d === domain[0]) {
          return defaultTickFormat ? defaultTickFormat(d, 0, domain) : '';
        }
        return formatLastDate(d, defaultTickFormat);
      };

      const tickLabelProps = (value: Date, index: number) => {
        const labelProps = callbackInfo.props.tickLabelProps
          ? callbackInfo.props.tickLabelProps(value, index)
          : {};
        labelProps.textAnchor = value === domain[0] ? 'start' : 'end';
        labelProps.dx = 0;
        return labelProps;
      };

      return (
        <AxisBottom
          {...(callbackInfo.props as any)}
          tickLabelProps={tickLabelProps}
          tickFormat={tickFormat}
          tickValues={domain}
        />
      );
    }
    case 'AxisLeft': {
      const domain = callbackInfo.props.scale.domain();
      const lastItem = domain[domain.length - 1];

      const tickLabelProps = (value: Date, index: number) => {
        const labelProps = callbackInfo.props.tickLabelProps
          ? callbackInfo.props.tickLabelProps(value, index)
          : {};
        labelProps.textAnchor = 'start';
        labelProps.dx = 10;
        labelProps.dy = -6;
        return labelProps;
      };

      return (
        <AxisLeft
          {...(callbackInfo.props as any)}
          tickLabelProps={tickLabelProps}
          tickValues={[lastItem]}
        />
      );
    }
  }
}

const DAY_IN_SECONDS = 24 * 60 * 60;
function formatLastDate(date: Date, defaultFormat?: TickFormatter<any>) {
  const days = Math.floor(
    (Date.now() / 1000 - date.valueOf() / 1000) / DAY_IN_SECONDS
  );

  if (days < 1) {
    return text.common.vandaag;
  }

  if (days < 2) {
    return text.common.gisteren;
  }

  return defaultFormat ? defaultFormat(date, 0, []) : '';
}

const StyledDiv = styled.div(
  css({
    p: {
      marginTop: '0',
    },
  })
);
