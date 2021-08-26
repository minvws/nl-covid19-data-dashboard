import { geoConicConformal, geoMercator } from 'd3-geo';
import { FocusEvent, memo, useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { useAccessibilityAnnotations } from '~/utils/use-accessibility-annotations';
import { useResizeObserver } from '~/utils/use-resize-observer';
import { ChoroplethProps, UnpackedDataItem } from '..';
import {
  CHOROPLETH_ASPECT_RATIO,
  FitExtent,
  MapType,
  useChoroplethData,
  useChoroplethFeatures,
  useChoroplethTooltip,
  useFeatureName,
  useFeatureProps,
  useFillColor,
  useResponsiveSize,
} from '../logic';
import { createDataConfig } from '../logic/create-data-config';
import { TooltipSettings } from '../tooltips/types';
import { CanvasChoroplethMap } from './canvas-choropleth-map';
import { SvgChoroplethMap } from './svg-choropleth-map';

export type AnchorEventHandler = {
  onFocus: (evt: FocusEvent<HTMLElement>) => void;
  onBlur: (evt: FocusEvent<HTMLElement>) => void;
};

type ChoroplethMapProps<
  T extends MapType,
  K extends UnpackedDataItem<T>
> = Omit<ChoroplethProps<T, K>, 'formatTooltip' | 'tooltipPlacement'> & {
  hoverRef: React.RefObject<SVGGElement | null>;
  anchorsRef: React.RefObject<HTMLDivElement | null>;
  setTooltip: (tooltip: TooltipSettings<K> | undefined) => void;
  isTabInteractive: boolean;
  anchorEventHandlers: AnchorEventHandler;
};

export const ChoroplethMap: <T extends MapType, K extends UnpackedDataItem<T>>(
  props: ChoroplethMapProps<T, K>
) => JSX.Element | null = memo((props) => {
  const {
    data: originalData,
    dataConfig: partialDataConfig,
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
    responsiveSizeConfiguration: dynamicSizeConfiguration,
    renderTarget = 'svg',
  } = props;

  const dataConfig = createDataConfig(partialDataConfig);

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

  const [mapHeight, padding] = useResponsiveSize(
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
