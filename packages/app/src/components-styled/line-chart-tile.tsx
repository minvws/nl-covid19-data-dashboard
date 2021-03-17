import { TimestampedValue } from '@corona-dashboard/common';
import { ParentSize } from '@visx/responsive';
import slugify from 'slugify';
import { AxisBottom } from '@visx/axis';
import {
  LineChart,
  LineChartProps,
} from '~/components-styled/line-chart/line-chart';
import { assert } from '~/utils/assert';
import { TimeframeOption } from '~/utils/timeframe';
import { ChartTileWithTimeframe } from './chart-tile';
import {
  ComponentCallbackFunction,
  ComponentCallbackInfo,
} from '~/components-styled/line-chart/components';
import { MetadataProps } from './metadata';
interface LineChartTileProps<T extends TimestampedValue>
  extends LineChartProps<T> {
  title: string;
  metadata: MetadataProps;
  description?: string;
  timeframeOptions?: TimeframeOption[];
  timeframeInitialValue?: TimeframeOption;
  footer?: React.ReactNode;
  ariaDescription?: string;
}

export function LineChartTile<T extends TimestampedValue>({
  metadata,
  title,
  description,
  timeframeOptions = ['all', '5weeks', 'week'],
  timeframeInitialValue = 'all',
  footer,
  ariaDescription,
  ...chartProps
}: LineChartTileProps<T>) {
  assert(
    description || ariaDescription,
    `This graph doesn't include a valid description nor an ariaDescription, please add one of them.`
  );
  const ariaLabelledBy = slugify(title);

  return (
    <ChartTileWithTimeframe
      title={title}
      description={description}
      metadata={metadata}
      timeframeOptions={timeframeOptions}
      timeframeInitialValue={timeframeInitialValue}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescription={ariaDescription}
    >
      {(timeframe) => (
        <>
          <ParentSize>
            {(parent) => (
              <LineChart
                {...chartProps}
                width={parent.width}
                timeframe={timeframe}
                ariaLabelledBy={ariaLabelledBy}
                componentCallback={createComponentCallback(
                  chartProps.componentCallback
                )}
              />
            )}
          </ParentSize>
          {footer}
        </>
      )}
    </ChartTileWithTimeframe>
  );
}

/*
 * @TODO: This setup does not allow passing a componentCallback for the
 * AxisBottom to the LineChartTile.
 */
function createComponentCallback(suppliedCallback?: ComponentCallbackFunction) {
  return function (callbackInfo: ComponentCallbackInfo) {
    switch (callbackInfo.type) {
      case 'AxisBottom': {
        const domain = callbackInfo.props.scale.domain();
        const tickFormat = callbackInfo.props.tickFormat;

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
    }

    // Provide components for all possible spots except AxisBottom
    if (suppliedCallback) {
      return suppliedCallback(callbackInfo);
    }
  };
}
