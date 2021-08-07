import { assert, ChoroplethThresholdsValue } from '@corona-dashboard/common';
import { localPoint } from '@visx/event';
import {
  MutableRefObject,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { isDefined, isPresent } from 'ts-is-present';
import { useIsTouchDevice } from '~/utils/use-is-touch-device';
import { DataConfig, DataOptions } from '..';
import { TooltipSettings } from '../tooltips/types';
import { thresholds } from './thresholds';
import { ChoroplethDataItem, mapToCodeType, MapType } from './types';
import { useFeatureName } from './use-feature-name';
import { isCodedValueType } from './utils';

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
  }, [map, codeType]);

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

        setTooltip({
          left: left + bboxLink.width + 5,
          top,
          data: {
            code,
            dataItem: getItemByCode(code),
            dataConfig,
            dataOptions,
            thresholdValues: threshold,
            featureName: getFeatureName(code),
            metricPropertyFormatter: (value: number) => value.toString(),
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
  }, [containerRef, setTooltip, showTooltipOnFocus, isTouch]);

  return [
    createSvgMouseOverHandler(
      timeout,
      setTooltip,
      containerRef,
      getItemByCode,
      dataConfig,
      dataOptions,
      threshold,
      getFeatureName
    ),
    isTouch ? undefined : createSvgMouseOutHandler(timeout, setTooltip),
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
  getFeatureName: (code: string) => string
) => {
  return useCallback(
    (event: React.MouseEvent) => {
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
            left: coords.x + 5,
            top: coords.y + 5,
            data: {
              code,
              dataItem: getItemByCode(code),
              dataConfig,
              dataOptions,
              thresholdValues: threshold,
              featureName: getFeatureName(code),
              metricPropertyFormatter: (value: number) => value.toString(),
            },
          });
        }
      }
    },
    [
      timeout,
      setTooltip,
      ref,
      getItemByCode,
      dataConfig,
      dataOptions,
      threshold,
      getFeatureName,
    ]
  );
};

const createSvgMouseOutHandler = <T extends ChoroplethDataItem>(
  timeout: MutableRefObject<number>,
  setTooltip: (settings: TooltipSettings<T> | undefined) => void
) => {
  return useCallback(() => {
    if (timeout.current < 0) {
      timeout.current = window.setTimeout(() => setTooltip(undefined), 10);
    }
  }, [timeout, setTooltip]);
};
