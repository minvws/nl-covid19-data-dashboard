import { geoConicConformal, geoMercator } from 'd3-geo';
import { FocusEvent, MouseEvent, memo, useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components/base';
import { useAccessibilityAnnotations } from '~/utils/use-accessibility-annotations';
import { useResizeObserver } from '~/utils/use-resize-observer';
import { ChoroplethProps } from '..';
import {
  ChoroplethDataItem,
  FitExtent,
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

export type AnchorEventHandler = {
  onFocus: (evt: FocusEvent<HTMLElement> | MouseEvent<HTMLElement>) => void;
  onBlur: (evt: FocusEvent<HTMLElement>) => void;
};

type ChoroplethMapProps<T extends ChoroplethDataItem> = Omit<ChoroplethProps<T>, 'formatTooltip' | 'tooltipPlacement' | 'dataFormatters'> & {
  setTooltip: (tooltip: TooltipSettings<T> | undefined) => void;
  isTabInteractive: boolean;
  anchorEventHandlers: AnchorEventHandler;
};

export const ChoroplethMap: <T extends ChoroplethDataItem>(props: ChoroplethMapProps<T>) => JSX.Element | null = memo((props) => {
  const {
    data: originalData,
    dataConfig: partialDataConfig,
    dataOptions,
    map,
    thresholdMap = map,
    minHeight = 500,
    boundingBoxPadding = {},
    setTooltip,
    accessibility,
    isTabInteractive,
    anchorEventHandlers,
    responsiveSizeConfiguration,
  } = props;

  const dataConfig = createDataConfig(partialDataConfig);

  const mapProjection = isDefined(dataOptions?.projection) ? geoConicConformal : geoMercator;

  const annotations = useAccessibilityAnnotations(accessibility);
  const data = useChoroplethData(originalData, map, dataOptions?.selectedCode);

  const [containerRef, { width = 0, height = minHeight }] = useResizeObserver<HTMLDivElement>();

  const [mapHeight, padding] = useResponsiveSize(width, height, boundingBoxPadding, responsiveSizeConfiguration);

  const choroplethFeatures = useChoroplethFeatures(map, data, dataOptions?.selectedCode);

  const getFillColor = useFillColor(data, map, dataConfig, thresholdMap);

  const featureProps = useFeatureProps(map, getFillColor, dataConfig, dataOptions);

  const [featureOverHandler, featureOutHandler, tooltipTrigger] = useChoroplethTooltip(map, data, dataConfig, isTabInteractive, setTooltip, containerRef, dataOptions);

  const getFeatureName = useFeatureName(map, dataOptions?.getFeatureName);

  const fitExtent: FitExtent = useMemo(
    () => [
      [
        [padding.left, padding.top],
        [width - padding.right, mapHeight - padding.bottom],
      ],
      choroplethFeatures?.boundingBox,
    ],
    [width, mapHeight, padding.left, padding.right, padding.top, padding.bottom, choroplethFeatures?.boundingBox]
  );

  const correctedHeight = Math.max(height, minHeight);

  return (
    <Box ref={containerRef} width="100%" height="100%">
      {!isDefined(choroplethFeatures) ? (
        <img src={`/api/choropleth/${map}/${dataConfig.metricName.toString()}/${dataConfig.metricProperty.toString()}/${minHeight}`} loading="lazy" />
      ) : (
        <>
          {annotations.descriptionElement}
          <CanvasChoroplethMap
            dataOptions={dataOptions}
            width={width}
            height={correctedHeight}
            minHeight={minHeight}
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
            containerRef={containerRef}
          />
        </>
      )}
    </Box>
  );
});
