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
import { ChoroplethDataItem, mapToCodeType, MapType } from './types';
import { useFeatureName } from './use-feature-name';
import { isCodedValueType } from './utils';

/**
 * Offset the tooltip slightly to prevent it from ending up underneath the mouse pointer
 */
const DEFAULT_TOOLTIP_OFFSET = 5;

export function useChoroplethTooltip<T extends ChoroplethDataItem>(
  map: MapType,
  data: T[],
  dataConfig: DataConfig<T>,
  dataOptions: DataOptions,
  showTooltipOnFocus: boolean | undefined,
  setTooltip: (tooltip: TooltipSettings<T> | undefined) => void,
  containerRef: React.RefObject<HTMLDivElement>
) {
  const timeout = useRef(-1);
  const isTouch = useIsTouchDevice();
  const intl = useIntl();

  const metricPropertyFormatter = useMetricPropertyFormatter(
    data,
    dataConfig,
    intl
  );

  const codeType = mapToCodeType[map];

  const getFeatureName = useFeatureName(map, dataOptions.getFeatureName);

  const getItemByCode = useMemo(() => {
    return (code: string) => {
      const item = data
        .filter(isCodedValueType(codeType))
        .find((x) => (x as any)[codeType] === code);
      assert(item, `No data item found for code ${code}`);
      return item;
    };
  }, [codeType, data]);

  const threshold = thresholds[map][dataConfig.metricProperty as string];
  assert(
    isDefined(threshold),
    `No threshold configured for map type ${map} and metric property ${dataConfig.metricProperty}`
  );

  useEffect(() => {
    if (!showTooltipOnFocus) {
      setTooltip(undefined);
      return;
    }

    const container = containerRef.current;

    function handleBubbledFocusIn(event: FocusEvent) {
      const link = event.target as HTMLAnchorElement;
      if (!container || !link) {
        return;
      }

      const code = link.getAttribute('data-id');

      if (isPresent(code)) {
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
     * `focusin` and `focusout` events bubble whereas `focus` doesn't
     */
    container?.addEventListener('focusin', handleBubbledFocusIn);
    container?.addEventListener('focusout', handleBubbledFocusOut);

    return () => {
      container?.removeEventListener('focusin', handleBubbledFocusIn);
      container?.removeEventListener('focusout', handleBubbledFocusOut);
    };
  }, [
    containerRef,
    setTooltip,
    showTooltipOnFocus,
    isTouch,
    getFeatureName,
    dataConfig,
    dataOptions,
    getItemByCode,
    threshold,
    map,
    metricPropertyFormatter,
  ]);

  return [
    createSvgMouseOverHandler(
      timeout,
      setTooltip,
      containerRef,
      getItemByCode,
      dataConfig,
      dataOptions,
      threshold,
      getFeatureName,
      map,
      metricPropertyFormatter
    ),
    createSvgMouseOutHandler(timeout, setTooltip, isTouch),
  ] as const;
}

const createSvgMouseOverHandler = <T extends ChoroplethDataItem>(
  timeout: MutableRefObject<number>,
  setTooltip: (settings: TooltipSettings<T> | undefined) => void,
  ref: RefObject<HTMLElement>,
  getItemByCode: (code: string) => T,
  dataConfig: DataConfig<T>,
  dataOptions: DataOptions,
  threshold: ChoroplethThresholdsValue[],
  getFeatureName: (code: string) => string,
  map: MapType,
  metricPropertyFormatter: (value: number) => string
) => {
  return (event: React.MouseEvent) => {
    const elm = event.target as HTMLElement | SVGElement;
    const code = elm.getAttribute('data-id');

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

const createSvgMouseOutHandler = <T extends ChoroplethDataItem>(
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

function useMetricPropertyFormatter<T extends ChoroplethDataItem>(
  data: T[],
  dataConfig: DataConfig<T>,
  intl: IntlContextProps
) {
  return useMemo(() => {
    const values = data.map((x) => x[dataConfig.metricProperty]);
    const numberOfDecimals = getMaximumNumberOfDecimals(values);
    return (value: number) =>
      intl.formatPercentage(value, {
        minimumFractionDigits: numberOfDecimals,
        maximumFractionDigits: numberOfDecimals,
      });
  }, [data, dataConfig, intl]);
}
