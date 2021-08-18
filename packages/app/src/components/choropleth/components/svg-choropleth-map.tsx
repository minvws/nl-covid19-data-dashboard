import css from '@styled-system/css';
import { geoConicConformal } from 'd3-geo';
import { FocusEvent, memo, useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { colors } from '~/style/theme';
import { useAccessibilityAnnotations } from '~/utils/use-accessibility-annotations';
import { useResizeObserver } from '~/utils/use-resize-observer';
import { useUniqueId } from '~/utils/use-unique-id';
import { ChoroplethProps, UnpackedDataItem } from '..';
import {
  CHOROPLETH_ASPECT_RATIO,
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
import { MercatorGroup } from './mercator-group';
import { MercatorHoverGroup } from './mercator-hover-group';

export const DEFAULT_HOVER_STROKE_WIDTH = 3;

type SvgChoroplethMapProps<
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

export const SvgChoroplethMap: <
  T extends MapType,
  K extends UnpackedDataItem<T>
>(
  props: SvgChoroplethMapProps<T, K>
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
  const mapProjection = isDefined(dataOptions.projection)
    ? dataOptions.projection
    : map === 'in'
    ? geoConicConformal
    : 'mercator';

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
    return <div>Loading...</div>;
  }

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
          aria-labelledby={annotations.props.ariaDescribedby}
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
