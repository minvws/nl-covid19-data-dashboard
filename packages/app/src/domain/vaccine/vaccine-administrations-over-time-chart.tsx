import { NlVaccineAdministeredTotalValue } from '@corona-dashboard/common';
import { AxisBottom, AxisLeft, TickFormatter } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { LineChart } from '~/components-styled/line-chart';
import { ComponentCallbackInfo } from '~/components-styled/line-chart/components';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { useBreakpoints } from '~/utils/useBreakpoints';

export function VaccineAdministrationsOverTimeChart({
  values,
}: {
  values: NlVaccineAdministeredTotalValue[];
}) {
  const { formatNumber } = useIntl();

  const divergeIndex = values.findIndex((x) => x.estimated !== x.reported);
  const { sm } = useBreakpoints(true);

  return (
    <LineChart
      initialWidth={400}
      height={sm ? 180 : 140}
      timeframe="all"
      values={values.map((x, i) => ({
        ...x,
        reported: divergeIndex > i ? x.reported : null,
      }))}
      linesConfig={[
        {
          metricProperty: 'estimated',
          areaFillOpacity: 0.25,
          strokeWidth: 3,
          color: colors.data.primary,
        },
      ]}
      componentCallback={ComponentCallback}
      showMarkerLine
      formatTooltip={(values) => formatNumber(values[0].__value)}
      padding={{
        top: 13,
        left: 0,
        right: 0,
      }}
    />
  );

  function ComponentCallback(callbackInfo: ComponentCallbackInfo) {
    const { siteText } = useIntl();

    const DAY_IN_SECONDS = 24 * 60 * 60;
    function formatLastDate(date: Date, defaultFormat?: TickFormatter<any>) {
      const days = Math.floor(
        (Date.now() / 1000 - date.valueOf() / 1000) / DAY_IN_SECONDS
      );

      if (days < 1) {
        return siteText.common.vandaag;
      }

      if (days < 2) {
        return siteText.common.gisteren;
      }

      return defaultFormat ? defaultFormat(date, 0, []) : '';
    }

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
          labelProps.dy = -4;
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
          labelProps.dy = -9;
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
}
