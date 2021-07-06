import { isArray, isObject } from 'lodash';
import {
  MutableRefObject,
  ReactElement,
  ReactNode,
  useCallback,
  useRef,
} from 'react';
import { isDefined } from 'ts-is-present';

type RenderPropsFunction = (renderProps: unknown) => ReactNode;

const chartPropsMap = new Map<string, string[]>();
chartPropsMap.set('TimeSeriesChart', ['values', 'dataOptions', 'seriesConfig']);
chartPropsMap.set('SafetyRegionChoropleth', ['data', 'metricProperty']);

export function usePropsReport(
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

  return [propsReportCallback, extractPropsFromChildren] as const;
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
      ? Object.fromEntries(propNames.map((name) => [name, element.props[name]]))
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
