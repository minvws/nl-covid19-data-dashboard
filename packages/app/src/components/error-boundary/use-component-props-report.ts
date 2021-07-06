import { isArray, isObject } from 'lodash';
import {
  MutableRefObject,
  ReactElement,
  ReactNode,
  useCallback,
  useRef,
} from 'react';
import { isDefined } from 'ts-is-present';
import { EuropeChoroplethProps } from '../choropleth/europe-choropleth';
import { GmChoroplethProps } from '../choropleth/municipality-choropleth';
import { VrChoroplethProps } from '../choropleth/safety-region-choropleth';
import { StackedChartProps } from '../stacked-chart';
import { TimeSeriesChartProps } from '../time-series-chart';
import { VerticalBarChartProps } from '../vertical-bar-chart';

type RenderPropsFunction = (renderProps: unknown) => ReactNode;

// I couldn't think of a neater way to typecheck the prop names in the chartPropsMap,
// any suggestions for a cleaner way are welcome...
function keyCheck<T>(keys: (keyof T)[]) {
  return keys;
}

const chartPropsMap = new Map<string, any[]>();
chartPropsMap.set(
  'TimeSeriesChart',
  keyCheck<TimeSeriesChartProps<any, any>>([
    'values',
    'dataOptions',
    'seriesConfig',
    'timeframe',
  ])
);
chartPropsMap.set(
  'SafetyRegionChoropleth',
  keyCheck<VrChoroplethProps<any, any>>([
    'data',
    'metricName',
    'metricProperty',
  ])
);
chartPropsMap.set(
  'MunicipalityChoropleth',
  keyCheck<GmChoroplethProps<any, any>>([
    'data',
    'metricName',
    'metricProperty',
  ])
);
chartPropsMap.set(
  'EuropeChoropleth',
  keyCheck<EuropeChoroplethProps<any>>(['data', 'metricProperty'])
);
chartPropsMap.set(
  'StackedChart',
  keyCheck<StackedChartProps<any>>(['values', 'config', 'timeframe'])
);
chartPropsMap.set(
  'VerticalBarChart',
  keyCheck<VerticalBarChartProps<any, any>>([
    'values',
    'seriesConfig',
    'timeframe',
    'dataOptions',
  ])
);

/**
 * This hook will return two methods. The first one accepts a components children
 * reference and will search through this children tree for components whose props
 * will be extracted and exposed using the second propsReportCallback method.
 *
 * The components that will be returned are defined by the chartPropsMap.
 *
 * This hook is used by the ErrorBoundary component in order to generate a richer
 * error report. This way the data and other interesting props that were configured
 * at the time of the crash will be reported as well.
 *
 */
export function useComponentPropsReport(
  additionalProps?: Record<string, unknown> | string | number | boolean
) {
  const propsReportRef = useRef<Record<string, unknown> | undefined>();

  const propsReportCallback = useCallback(() => {
    if (additionalProps) {
      if (isObject(additionalProps)) {
        return { ...additionalProps, ...propsReportRef.current };
      }
    }
    return { ...propsReportRef.current };
  }, [additionalProps, propsReportRef]);

  const extractPropsFromChildren = (
    children: ReactNode | RenderPropsFunction
  ) => {
    return extractPropsAndFillReport(children, propsReportRef);
  };

  return [extractPropsFromChildren, propsReportCallback] as const;
}

function isReactElement(value: ReactNode): value is ReactElement {
  return isObject(value) && 'type' in value;
}

function extractPropsAndFillReport(
  children: ReactNode | RenderPropsFunction,
  propsReportRef: MutableRefObject<Record<string, unknown> | undefined>
) {
  if (isReactElement(children)) {
    propsReportRef.current = extractChartProps(children);
  }
  return children;
}

function extractChartProps(
  reactNode: ReactElement
): Record<string, unknown> | undefined {
  const [element, type] = findChartNode(reactNode);
  if (element && type) {
    const propNames = chartPropsMap.get(type);
    return propNames
      ? Object.assign(
          Object.fromEntries(
            propNames
              .filter((x) => isDefined(element.props[x]))
              .map((x) => [x, element.props[x]])
          ),
          { componentName: type }
        )
      : undefined;
  }
}

function isKnownChartType(typeName: string) {
  return chartPropsMap.has(typeName);
}

function findChartNode(
  node: ReactNode
): [ReactElement | undefined, string | undefined] {
  if (isReactElement(node)) {
    if (
      isObject(node.type) &&
      'name' in node.type &&
      isKnownChartType(node.type.name)
    ) {
      return [node, node.type.name];
    } else if (isArray(node.props.children)) {
      for (let i = 0; i < node.props.children.length; i++) {
        const result = findChartNode(node.props.children[i]);
        if (isDefined(result[0])) {
          return result;
        }
      }
    }
  }
  return [undefined, undefined];
}
