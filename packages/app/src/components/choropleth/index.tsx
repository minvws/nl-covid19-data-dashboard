import { KeysOfType } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { FocusEvent, memo, useMemo, useRef, useState } from 'react';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components/base';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import {
  AccessibilityDefinition,
  useAccessibilityAnnotations,
} from '~/utils/use-accessibility-annotations';
import { useIsTouchDevice } from '~/utils/use-is-touch-device';
import { useOnClickOutside } from '~/utils/use-on-click-outside';
import { useResizeObserver } from '~/utils/use-resize-observer';
import { useUniqueId } from '~/utils/use-unique-id';
import { MercatorGroup, MercatorHoverGroup } from './components';
import {
  CHOROPLETH_ASPECT_RATIO,
  DEFAULT_STROKE_WIDTH,
  FitExtent,
  MappedDataItem,
  MapType,
  Unpack,
  useChoroplethData,
  useChoroplethFeatures,
  useChoroplethTooltip,
  useDynamicSize,
  useFeatureName,
  useFeatureProps,
  useFillColor,
  useTabInteractiveButton,
} from './logic';
import { ChoroplethTooltipPlacement, Tooltip } from './tooltips';
import { TooltipFormatter, TooltipSettings } from './tooltips/types';

export const DEFAULT_HOVER_STROKE_WIDTH = 3;

export type DataOptions = {
  isPercentage?: boolean;
  getLink?: (code: string) => string;
  getFeatureName?: (code: string) => string;
  highlightSelection?: boolean;
  selectedCode?: string;
  tooltipVariables?: Record<string, Record<string, string> | string>;
};

type OptionalDataConfig<T> = {
  metricProperty: KeysOfType<T, number | null | boolean | undefined, true>;
  noDataFillColor?: string;
  hoverFill?: string;
  hoverStroke?: string;
  hoverStrokeWidth?: number;
  highlightStroke?: string;
  highlightStrokeWidth?: number;
  areaStroke?: string;
  areaStrokeWidth?: number;
};

export type DataConfig<T> = Required<OptionalDataConfig<T>>;

export type OptionalBoundingBoxPadding = {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
};

export type DynamicSizeConfiguration = {
  /**
   * If the container width is equal or larger than this value, use
   * the associated height and padding.
   */
  containerWidth: number;
  heightAndPadding: HeightAndPadding;
};

export type HeightAndPadding = {
  mapHeight: number;
  padding: OptionalBoundingBoxPadding;
};

/**
 * An arbitrary number of dynamic size configs, the last item is used as the default.
 * (So for the smallest container size)
 */
export type DynamicSizeConfigurations = [
  ...DynamicSizeConfiguration[],
  HeightAndPadding
];

export type BoundingBoxPadding = Required<OptionalBoundingBoxPadding>;

type UnpackedDataItem<T extends MapType> = Unpack<MappedDataItem<T>>;

type ChoroplethProps<T extends MapType, K extends UnpackedDataItem<T>> = {
  accessibility: AccessibilityDefinition;
  data: K[];
  dataConfig: OptionalDataConfig<K>;
  dataOptions: DataOptions;
  map: T;
  formatTooltip?: TooltipFormatter<K>;
  tooltipPlacement?: ChoroplethTooltipPlacement;
  minHeight?: number;
  /**
   * A default set of paddings to be used on the bounding box, if
   * more control is needed for different screen sizes, use the
   * dynamicSizeConfiguration instead.
   */
  boundingBoxPadding?: OptionalBoundingBoxPadding;
  /**
   * This defines an optional set of map heights and paddings based
   * on a set of given width break points
   */
  dynamicSizeConfiguration?: DynamicSizeConfigurations;
};

/**
 * This is a (semi) generic choropleth component that supports a Dutch map of municipalities or safetyregions
 * and a European map.
 *
 * The type of map that will be rendered can be set using the `map` property, setting this prop will automatically
 * narrow the allowed types for the data prop to just those that are applicable to the specified map type.
 *
 * Using the `dataConfig` prop the metric that is shown can be specified, along with optional settings for the
 * stroke, fills and strokeWidths of the rendered features.
 *
 * The `dataOptions` prop allows for some extra functional tweaks.
 *
 * Most of the choropleths will work using the generic tooltip, but if something custom is required the `formatTooltip`
 * prop is there to help out.
 */
export function Choropleth<T extends MapType, K extends UnpackedDataItem<T>>({
  formatTooltip,
  tooltipPlacement,
  ...props
}: ChoroplethProps<T, K>) {
  const [tooltip, setTooltip] = useState<TooltipSettings<K>>();
  const isTouch = useIsTouchDevice();
  const { siteText } = useIntl();
  const hoverRef = useRef<SVGGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useOnClickOutside([tooltipRef, hoverRef], () => setTooltip(undefined));

  const { isTabInteractive, tabInteractiveButton, anchorEventHandlers } =
    useTabInteractiveButton(
      replaceVariablesInText(siteText.choropleth.a11y.tab_navigatie_button, {
        subject: siteText.choropleth[props.map].plural,
      })
    );

  return (
    <Box position="relative" height="100%">
      {tabInteractiveButton}
      <div
        css={css({ bg: 'transparent', position: 'relative', height: '100%' })}
      >
        <ChoroplethMap
          {...props}
          setTooltip={setTooltip}
          hoverRef={hoverRef}
          isTabInteractive={isTabInteractive}
          anchorEventHandlers={anchorEventHandlers}
        />

        {tooltip && (
          <div
            ref={tooltipRef}
            style={{ pointerEvents: isTouch ? 'all' : 'none' }}
          >
            <Tooltip
              placement={tooltipPlacement}
              left={tooltip.left}
              top={tooltip.top}
              setTooltip={setTooltip}
              formatTooltip={formatTooltip}
              data={tooltip.data}
            />
          </div>
        )}
      </div>
    </Box>
  );
}

type ChoroplethMapProps<
  T extends MapType,
  K extends UnpackedDataItem<T>
> = Omit<ChoroplethProps<T, K>, 'formatTooltip' | 'tooltipPlacement'> & {
  hoverRef: React.RefObject<SVGGElement>;
  setTooltip: (tooltip: TooltipSettings<K> | undefined) => void;
  isTabInteractive: boolean;
  anchorEventHandlers: {
    onFocus: (evt: FocusEvent<HTMLAnchorElement>) => void;
    onBlur: (evt: FocusEvent<HTMLAnchorElement>) => void;
  };
};

const ChoroplethMap: <T extends MapType, K extends UnpackedDataItem<T>>(
  props: ChoroplethMapProps<T, K>
) => JSX.Element | null = memo((props) => {
  const {
    data: originalData,
    dataConfig: originalDataConfig,
    dataOptions,
    map,
    minHeight = 500,
    boundingBoxPadding = {},
    hoverRef,
    setTooltip,
    accessibility,
    isTabInteractive,
    anchorEventHandlers,
    dynamicSizeConfiguration,
  } = props;

  const dataConfig = {
    metricProperty: originalDataConfig.metricProperty,
    noDataFillColor:
      originalDataConfig.noDataFillColor ?? colors.choroplethNoData,
    hoverFill: originalDataConfig.hoverFill ?? 'none',
    hoverStroke:
      originalDataConfig.hoverStroke ?? colors.choroplethFeatureStroke,
    hoverStrokeWidth:
      originalDataConfig.hoverStrokeWidth ?? DEFAULT_HOVER_STROKE_WIDTH,
    highlightStroke:
      originalDataConfig.highlightStroke ?? colors.choroplethHighlightStroke,
    highlightStrokeWidth:
      originalDataConfig.highlightStrokeWidth ?? DEFAULT_HOVER_STROKE_WIDTH,
    areaStroke: originalDataConfig.areaStroke ?? colors.choroplethFeatureStroke,
    areaStrokeWidth: originalDataConfig.areaStrokeWidth ?? DEFAULT_STROKE_WIDTH,
  };

  const aspectRatio =
    map === 'in' ? CHOROPLETH_ASPECT_RATIO.in : CHOROPLETH_ASPECT_RATIO.nl;
  const mapProjection = map === 'in' ? 'mercator' : 'mercator';

  const annotations = useAccessibilityAnnotations(accessibility);
  const clipPathId = useUniqueId();
  const data = useChoroplethData(originalData, map, dataOptions.selectedCode);

  const [
    containerRef,
    { width = minHeight * (1 / aspectRatio), height = minHeight },
  ] = useResizeObserver<HTMLDivElement>();

  const [mapHeight, padding] = useDynamicSize(
    width,
    height,
    boundingBoxPadding,
    dynamicSizeConfiguration
  );

  const choroplethFeatures = useChoroplethFeatures(
    map,
    data,
    dataOptions.selectedCode
  );

  const getFillColor = useFillColor(data, map, dataConfig);

  const { area, outline, hover } = useFeatureProps(
    map,
    getFillColor,
    dataOptions,
    dataConfig
  );

  const [mouseOverHandler, mouseOutHandler] = useChoroplethTooltip(
    map,
    data,
    dataConfig,
    dataOptions,
    isTabInteractive,
    setTooltip,
    containerRef
  );

  const getFeatureName = useFeatureName(map, dataOptions.getFeatureName);

  const fitExtent: FitExtent = useMemo(
    () => [
      [
        [padding.left, padding.top],
        [width - padding.right, mapHeight - padding.bottom],
      ],
      choroplethFeatures.boundingBox,
    ],
    [
      width,
      mapHeight,
      padding.left,
      padding.right,
      padding.top,
      padding.bottom,
      choroplethFeatures.boundingBox,
    ]
  );

  return (
    <>
      {annotations.descriptionElement}
      <div
        ref={containerRef}
        style={{
          minHeight: mapHeight,
          maxHeight: '75vh',
          maxWidth: '100%',
        }}
      >
        <svg
          role="img"
          width={width}
          viewBox={`0 0 ${width} ${mapHeight}`}
          css={css({ display: 'block', bg: 'transparent', width: '100%' })}
          onMouseMove={mouseOverHandler}
          onMouseOut={mouseOutHandler}
        >
          <clipPath id={clipPathId}>
            <rect x={0} y={0} height={height} width={width} />
          </clipPath>
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill={'none'}
            rx={14}
          />
          <g transform={`translate(0,0)`} clipPath={`url(#${clipPathId})`}>
            <MercatorGroup
              projection={mapProjection}
              data={choroplethFeatures.area.features}
              fillMethod={area.fill}
              strokeMethod={area.stroke}
              strokeWidthMethod={area.strokeWidth}
              fitExtent={fitExtent}
            />
            {isDefined(choroplethFeatures.outline) && (
              <g css={css({ pointerEvents: 'none' })}>
                <MercatorGroup
                  projection={mapProjection}
                  data={choroplethFeatures.outline.features}
                  fillMethod={outline.fill}
                  strokeMethod={outline.stroke}
                  strokeWidthMethod={outline.strokeWidth}
                  fitExtent={fitExtent}
                />
              </g>
            )}
            <g ref={hoverRef}>
              <MercatorHoverGroup
                projection={mapProjection}
                data={choroplethFeatures.hover.features}
                fillMethod={hover.fill}
                strokeMethod={hover.stroke}
                strokeWidthMethod={hover.strokeWidth}
                fitExtent={fitExtent}
                isTabInteractive={isTabInteractive}
                getTitle={getFeatureName}
                getHref={dataOptions.getLink}
                {...anchorEventHandlers}
              />
            </g>
          </g>
        </svg>
      </div>
    </>
  );
});
