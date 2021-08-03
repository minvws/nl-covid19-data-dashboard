import { isArray, isObject } from 'lodash';
import {
  MutableRefObject,
  ReactElement,
  ReactNode,
  useCallback,
  useRef,
} from 'react';
import { isDefined } from 'ts-is-present';
import { GmChoropleth } from '~/components/choropleth/gm-choropleth';
import { InChoropleth } from '~/components/choropleth/in-choropleth';
import { VrChoropleth } from '~/components/choropleth/vr-choropleth';
import { StackedChart } from '~/components/stacked-chart';
import { TimeSeriesChart } from '~/components/time-series-chart';

type RenderPropsFunction = (renderProps: unknown) => ReactNode;

// I couldn't think of a neater way to type check the prop names in the relevantComponentProps map,
// any suggestions for a cleaner way are welcome...
function keyCheck<T>(keys: (keyof T)[]) {
  return keys;
}

type FunctionComponentProps<T extends (...args: any) => any> = Parameters<T>[0];

const relevantComponentProps = new Map<(...args: any) => any, string[]>();
relevantComponentProps.set(
  TimeSeriesChart,
  keyCheck<FunctionComponentProps<typeof TimeSeriesChart>>([
    'values',
    'dataOptions',
    'seriesConfig',
    'timeframe',
  ])
);
relevantComponentProps.set(
  VrChoropleth,
  keyCheck<FunctionComponentProps<typeof VrChoropleth>>([
    'data',
    'metricName',
    'metricProperty',
  ])
);
relevantComponentProps.set(
  GmChoropleth,
  keyCheck<FunctionComponentProps<typeof GmChoropleth>>([
    'data',
    'metricName',
    'metricProperty',
  ])
);
relevantComponentProps.set(
  InChoropleth,
  keyCheck<FunctionComponentProps<typeof InChoropleth>>([
    'data',
    'metricProperty',
  ])
);
relevantComponentProps.set(
  StackedChart,
  keyCheck<FunctionComponentProps<typeof StackedChart>>([
    'values',
    'config',
    'timeframe',
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
    try {
      return extractPropsAndFillReport(children, propsReportRef);
    } catch (e) {
      return children;
    }
  };

  return [extractPropsFromChildren, propsReportCallback] as const;
}

function isReactElement(value: ReactNode): value is ReactElement {
  return isObject(value) && 'type' in value;
}

function isReactElementArray(value: ReactNode): value is ReactNode[] {
  return Array.isArray(value);
}

function extractPropsAndFillReport(
  children: ReactNode | RenderPropsFunction,
  propsReportRef: MutableRefObject<Record<string, unknown> | undefined>
) {
  if (isReactElement(children)) {
    propsReportRef.current = extractComponentProps(children);
  } else if (isReactElementArray(children)) {
    propsReportRef.current = extractComponentProps(children);
  }
  return children;
}

function extractComponentProps(
  reactNode: ReactElement | ReactNode[]
): Record<string, unknown> | undefined {
  const [element, type] = findComponentNode(reactNode);
  if (element && type) {
    const propNames = relevantComponentProps.get(type);
    return propNames
      ? Object.assign(
          Object.fromEntries(
            propNames
              .filter((x) => isDefined(element.props[x]))
              .map((x) => [x, element.props[x]])
          ),
          { componentName: type.name }
        )
      : undefined;
  }
}

function isKnownComponentType(type: any) {
  return relevantComponentProps.has(type);
}

function findComponentNode(
  node: ReactNode | ReactNode[]
): [ReactElement | undefined, any] {
  if (isReactElement(node)) {
    if (
      isObject(node.type) &&
      'name' in node.type &&
      isKnownComponentType(node.type)
    ) {
      return [node, node.type];
    } else if (isArray(node.props.children)) {
      for (let i = 0; i < node.props.children.length; i++) {
        const result = findComponentNode(node.props.children[i]);
        if (isDefined(result[0])) {
          return result;
        }
      }
    }
  } else if (isReactElementArray(node)) {
    const elementArray = node as ReactNode[];
    const element = elementArray
      .filter(isReactElement)
      .find(
        (x) =>
          isObject(x.type) && 'name' in x.type && isKnownComponentType(x.type)
      );
    if (isDefined(element)) {
      return findComponentNode(element);
    }
  }
  return [undefined, undefined];
}
