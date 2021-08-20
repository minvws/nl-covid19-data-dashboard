import { geoConicConformal, geoMercator } from 'd3-geo';
import { FocusEvent, memo, useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { colors } from '~/style/theme';
import { useAccessibilityAnnotations } from '~/utils/use-accessibility-annotations';
import { useResizeObserver } from '~/utils/use-resize-observer';
import { ChoroplethProps, UnpackedDataItem } from '..';
import {
  CHOROPLETH_ASPECT_RATIO,
  DEFAULT_HOVER_STROKE_WIDTH,
  DEFAULT_STROKE_WIDTH,
  FitExtent,
  MapType,
  useChoroplethData,
  useChoroplethFeatures,
  useChoroplethTooltip,
  useDynamicSize,
  useFeatureName,
  useFeatureProps,
  useFillColor,
} from '../logic';
import { TooltipSettings } from '../tooltips/types';
import { CanvasChoroplethMap } from './canvas-choropleth-map';
import { SvgChoroplethMap } from './svg-choropleth-map';

export type AnchorEventHandler = {
  onFocus: (evt: FocusEvent<HTMLAnchorElement>) => void;
  onBlur: (evt: FocusEvent<HTMLAnchorElement>) => void;
};

type ChoroplethMapProps<
  T extends MapType,
  K extends UnpackedDataItem<T>
> = Omit<ChoroplethProps<T, K>, 'formatTooltip' | 'tooltipPlacement'> & {
  hoverRef: React.RefObject<SVGGElement | HTMLElement>;
  anchorsRef: React.RefObject<HTMLDivElement>;
  setTooltip: (tooltip: TooltipSettings<K> | undefined) => void;
  isTabInteractive: boolean;
  anchorEventHandlers: AnchorEventHandler;
};

export const ChoroplethMap: <T extends MapType, K extends UnpackedDataItem<T>>(
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
    anchorsRef,
    setTooltip,
    accessibility,
    isTabInteractive,
    anchorEventHandlers,
    dynamicSizeConfiguration,
    renderTarget = 'svg',
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

  const mapProjection = isDefined(dataOptions.projection)
    ? dataOptions.projection
    : map === 'in'
    ? geoConicConformal
    : geoMercator;

  const annotations = useAccessibilityAnnotations(accessibility);
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

  const featureProps = useFeatureProps(
    map,
    getFillColor,
    dataOptions,
    dataConfig
  );

  const [featureOverHandler, featureOutHandler, tooltipTrigger] =
    useChoroplethTooltip(
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
      choroplethFeatures?.boundingBox,
    ],
    [
      width,
      mapHeight,
      padding.left,
      padding.right,
      padding.top,
      padding.bottom,
      choroplethFeatures?.boundingBox,
    ]
  );

  if (!isDefined(choroplethFeatures)) {
    return <div>Loading data...</div>;
  }

  const RenderComponent =
    renderTarget === 'svg' ? SvgChoroplethMap : CanvasChoroplethMap;

  return (
    <>
      {annotations.descriptionElement}
      <RenderComponent
        containerRef={containerRef}
        hoverRef={hoverRef}
        anchorsRef={anchorsRef}
        dataOptions={dataOptions}
        width={width}
        height={mapHeight}
        annotations={annotations}
        featureOverHandler={featureOverHandler}
        featureOutHandler={featureOutHandler}
        tooltipTrigger={tooltipTrigger}
        mapProjection={mapProjection}
        choroplethFeatures={choroplethFeatures}
        featureProps={featureProps}
        fitExtent={fitExtent}
        anchorEventHandlers={anchorEventHandlers}
        isTabInteractive={isTabInteractive}
        getFeatureName={getFeatureName}
      />
    </>
  );
});
