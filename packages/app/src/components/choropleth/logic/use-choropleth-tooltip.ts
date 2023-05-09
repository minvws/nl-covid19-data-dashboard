import { assert, ChoroplethThresholdsValue } from '@corona-dashboard/common';
import { localPoint } from '@visx/event';
import { MutableRefObject, RefObject, useEffect, useMemo, useRef } from 'react';
import { isDefined, isPresent } from 'ts-is-present';
import { useIntl } from '~/intl';
import { IntlContextProps } from '~/intl/hooks/use-intl';
import { getMaximumNumberOfDecimals } from '~/utils/get-maximum-number-of-decimals';
import { useIsTouchDevice } from '~/utils/use-is-touch-device';
import { DataConfig, DataOptions } from '..';
import { TooltipSettings } from '../tooltips/types';
import { thresholds } from './thresholds';
import { ChoroplethDataItem, CodeProp, mapToCodeType, MapType } from './types';
import { useFeatureName } from './use-feature-name';
import { isCodedValueType } from './utils';

/**
 * Offset the tooltip slightly to prevent it from ending up underneath the mouse pointer
 */
const DEFAULT_TOOLTIP_OFFSET = 5;

export type ChoroplethTooltipHandlers = [
  ReturnType<typeof createFeatureMouseOverHandler>,
  ReturnType<typeof createFeatureMouseOutHandler>,
  ReturnType<typeof createTooltipTrigger>
];

/**
 * This hooks returns a toolset of functions that are used to display
 * a tooltip over a choropleth at the correct coordinates and with the
 * correct data displayed.
 *
 * @param map
 * @param data
 * @param dataConfig
 * @param dataOptions
 * @param showTooltipOnFocus
 * @param setTooltip
 * @param containerRef
 * @returns
 */
export function useChoroplethTooltip<T extends ChoroplethDataItem>(
  map: MapType,
  data: T[],
  dataConfig: DataConfig<T>,
  showTooltipOnFocus: boolean | undefined,
  setTooltip: (tooltip: TooltipSettings<T> | undefined) => void,
  containerRef: React.RefObject<HTMLDivElement>,
  dataOptions?: DataOptions
) {
  const timeout = useRef(-1);
  const isTouch = useIsTouchDevice();
  const intl = useIntl();

  const metricPropertyFormatter = useMetricPropertyFormatter(data, dataConfig, intl);

  const codeType = mapToCodeType[map];

  const getFeatureName = useFeatureName(map, dataOptions?.getFeatureName);

  const getItemByCode = useMemo(() => {
    return (code: CodeProp) => {
      const item = data
        .filter((x) => {
          const filterFn = isCodedValueType(codeType);
          return filterFn && filterFn(x);
        })
        .find((x) => (x as any)[codeType] === code);
      assert(item, `[${useChoroplethTooltip.name}:${getItemByCode.name}] No data item found for code ${code}`);
      return item;
    };
  }, [codeType, data]);

  const threshold = thresholds[map][dataConfig.metricProperty as string];
  assert(isDefined(threshold), `[${useChoroplethTooltip.name}] No threshold configured for map type ${map} and metric property ${dataConfig.metricProperty.toString()}`);

  useEffect(() => {
    if (!showTooltipOnFocus) {
      setTooltip(undefined);
      return;
    }

    const container = containerRef.current;
    if (!isPresent(container)) {
      return;
    }

    function handleBubbledFocusIn(event: FocusEvent) {
      const link = event.target as HTMLAnchorElement;
      if (!isDefined(link)) {
        return;
      }

      const code = link.getAttribute('data-id') as CodeProp;

      if (isPresent(code) && isPresent(container)) {
        const bboxContainer = container.getBoundingClientRect();
        const bboxLink = link.getBoundingClientRect();
        const left = bboxLink.left - bboxContainer.left;
        const top = bboxLink.top - bboxContainer.top;

        const dataItem = getItemByCode(code);

        setTooltip({
          left: left + bboxLink.width + DEFAULT_TOOLTIP_OFFSET,
          top,
          data: {
            code,
            dataItem,
            dataConfig,
            dataOptions,
            thresholdValues: threshold,
            featureName: getFeatureName(code),
            metricPropertyFormatter,
            map,
          },
        });
      }
    }

    function handleBubbledFocusOut() {
      setTooltip(undefined);
    }

    /**
     * `focusin` and `focusout` events bubble whereas `focus` doesn't work consistently
     */
    container.addEventListener('focusin', handleBubbledFocusIn);
    container.addEventListener('focusout', handleBubbledFocusOut);

    return () => {
      container.removeEventListener('focusin', handleBubbledFocusIn);
      container.removeEventListener('focusout', handleBubbledFocusOut);
    };
  }, [containerRef, setTooltip, showTooltipOnFocus, isTouch, getFeatureName, dataConfig, dataOptions, getItemByCode, threshold, map, metricPropertyFormatter]);

  return [
    createFeatureMouseOverHandler(timeout, setTooltip, containerRef, getItemByCode, dataConfig, threshold, getFeatureName, map, metricPropertyFormatter, dataOptions),
    createFeatureMouseOutHandler(timeout, setTooltip, isTouch),
    createTooltipTrigger(setTooltip, getItemByCode, dataConfig, threshold, getFeatureName, map, metricPropertyFormatter, dataOptions),
  ] as ChoroplethTooltipHandlers;
}

type HoverInfo = { code: CodeProp; x: number; y: number };

const createTooltipTrigger = <T extends ChoroplethDataItem>(
  setTooltip: (settings: TooltipSettings<T> | undefined) => void,
  getItemByCode: (code: CodeProp) => T,
  dataConfig: DataConfig<T>,
  threshold: ChoroplethThresholdsValue[],
  getFeatureName: (code: string) => string,
  map: MapType,
  metricPropertyFormatter: (value: number) => string,
  dataOptions?: DataOptions
) => {
  return (hoverInfo?: HoverInfo) => {
    if (!isDefined(hoverInfo)) {
      return setTooltip(undefined);
    }

    const { code, x, y } = hoverInfo;
    setTooltip({
      left: x,
      top: y,
      data: {
        code,
        dataItem: getItemByCode(code),
        dataConfig,
        dataOptions,
        thresholdValues: threshold,
        featureName: getFeatureName(code),
        metricPropertyFormatter,
        map,
      },
    });
  };
};

const createFeatureMouseOverHandler = <T extends ChoroplethDataItem>(
  timeout: MutableRefObject<number>,
  setTooltip: (settings: TooltipSettings<T> | undefined) => void,
  ref: RefObject<HTMLElement>,
  getItemByCode: (code: CodeProp) => T,
  dataConfig: DataConfig<T>,
  threshold: ChoroplethThresholdsValue[],
  getFeatureName: (code: string) => string,
  map: MapType,
  metricPropertyFormatter: (value: number) => string,
  dataOptions?: DataOptions
) => {
  return (event: React.MouseEvent<HTMLElement>) => {
    const elm = event.target as HTMLElement;
    const code = elm.getAttribute('data-id') as CodeProp;

    if (isPresent(code) && ref.current) {
      if (timeout.current > -1) {
        clearTimeout(timeout.current);
        timeout.current = -1;
      }

      /**
       * Pass the DOM node to fix positioning in Firefox
       */
      const coords = localPoint(ref.current, event);

      if (isPresent(coords)) {
        setTooltip({
          left: coords.x + DEFAULT_TOOLTIP_OFFSET,
          top: coords.y + DEFAULT_TOOLTIP_OFFSET,
          data: {
            code,
            dataItem: getItemByCode(code),
            dataConfig,
            dataOptions,
            thresholdValues: threshold,
            featureName: getFeatureName(code),
            metricPropertyFormatter,
            map,
          },
        });
      }
    }
  };
};

const createFeatureMouseOutHandler = <T extends ChoroplethDataItem>(
  timeout: MutableRefObject<number>,
  setTooltip: (settings: TooltipSettings<T> | undefined) => void,
  isTouch: boolean
) => {
  return isTouch
    ? undefined
    : () => {
        if (timeout.current < 0) {
          timeout.current = window.setTimeout(() => setTooltip(undefined), 10);
        }
      };
};

function useMetricPropertyFormatter<T extends ChoroplethDataItem>(data: T[], dataConfig: DataConfig<T>, intl: IntlContextProps) {
  return useMemo(() => {
    const values = data.map((value) => {
      const valueEntry = value[dataConfig.metricProperty];
      return typeof valueEntry === 'number' ? valueEntry : 0;
    });
    const numberOfDecimals = getMaximumNumberOfDecimals(values);
    return (value: number) =>
      intl.formatPercentage(value, {
        minimumFractionDigits: numberOfDecimals,
        maximumFractionDigits: numberOfDecimals,
      });
  }, [data, dataConfig, intl]);
}
