import { Mercator } from '@vx/geo';
import { Feature, FeatureCollection, MultiPolygon } from 'geojson';
import { MutableRefObject, ReactNode, useMemo, useRef } from 'react';

import { TCombinedChartDimensions } from './hooks/useChartDimensions';

import styles from './chloropleth.module.scss';
import { localPoint } from '@vx/event';
import { Tooltip, useTooltip } from '@vx/tooltip';

export type TRenderCallback = (
  feature: Feature<any, any>,
  path: string,
  index: number
) => ReactNode;

export type TProps<TFeatureProperties> = {
  // This is the main feature collection that displays the features that will
  // be colored in as part of the chloropleth
  featureCollection: FeatureCollection<MultiPolygon, TFeatureProperties>;
  // These are features that are used as an overlay, overlays have no interactions
  // they are simply there to beautify the map or emphasise certain parts.
  overlays: FeatureCollection<MultiPolygon>;
  // These are features that are used as as the hover features, these are
  // typically activated when the user mouse overs them.
  hovers?: FeatureCollection<MultiPolygon, TFeatureProperties>;
  // The boundingbox is calculated based on these features, this can be used to
  // zoom in on a specific part of the map upon initialisation.
  boundingbox: FeatureCollection<MultiPolygon>;
  // Height, width, etc
  dimensions: TCombinedChartDimensions;
  // This callback is invoked for each of the features in the featureCollection property.
  // This will usually return a <path/> element.
  featureCallback: (
    feature: Feature<MultiPolygon, TFeatureProperties>,
    path: string,
    index: number
  ) => ReactNode;
  // This callback is invoked for each of the features in the overlays property.
  // This will usually return a <path/> element.
  overlayCallback: (
    feature: Feature<MultiPolygon>,
    path: string,
    index: number
  ) => ReactNode;
  // This callback is invoked for each of the features in the hovers property.
  // This will usually return a <path/> element.
  hoverCallback: (
    feature: Feature<MultiPolygon, TFeatureProperties>,
    path: string,
    index: number
  ) => ReactNode;
  // This callback is invoked after a click was received on one of the features in the featureCollection property.
  // The id is the value that is assigned to the data-id attribute in the featureCallback.
  onPathClick: (id: string) => void;
  // This callback is invoked right before a tooltip is shown for one of the features in the featureCollection property.
  // The id is the value that is assigned to the data-id attribute in the featureCallback.
  getTooltipContent: (id: string) => ReactNode;
};

/**
 * Generic chloropleth component that takes featurecollection that is considered the data layer
 * and another that is considered the overlay layer.
 * It implements a click and mouseover/mouseout system where the value that is assigned to the
 * data-id attribute of a path is propagated to the injected onPatchClick and getTooltipContent
 * callbacks.
 *
 * @param props
 */
export default function Chloropleth<T>(props: TProps<T>) {
  const {
    featureCollection,
    overlays,
    hovers,
    boundingbox,
    dimensions,
    featureCallback,
    overlayCallback,
    hoverCallback,
    onPathClick,
    getTooltipContent,
  } = props;

  const clipPathId = useRef(`_${Math.random().toString(36).substring(2, 15)}`);
  const timout = useRef<any>(-1);

  const {
    width = 0,
    height = 0,
    marginLeft,
    marginTop,
    boundedWidth,
    boundedHeight,
  } = dimensions;

  const sizeToFit: [[number, number], FeatureCollection] = useMemo(() => {
    return [[boundedWidth, boundedHeight], boundingbox];
  }, [boundedWidth, boundedHeight, boundingbox]);

  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip<string>();

  return (
    <>
      <svg
        width={width}
        height={height}
        className={styles.svgMap}
        onMouseOver={svgMouseOver(timout, showTooltip)}
        onMouseOut={svgMouseOut(timout, hideTooltip)}
        onClick={svgClick(onPathClick)}
      >
        <clipPath id={clipPathId.current}>
          <rect
            x={dimensions.marginLeft}
            y={0}
            height={dimensions.boundedHeight}
            width={
              (dimensions.boundedWidth ?? 0) -
              (dimensions.marginLeft ?? 0) -
              (dimensions.marginRight ?? 0)
            }
          />
        </clipPath>
        <rect x={0} y={0} width={width} height={height} fill={'none'} rx={14} />
        <g
          transform={`translate(${marginLeft},${marginTop})`}
          clipPath={`url(#${clipPathId.current})`}
        >
          <Mercator data={featureCollection.features} fitSize={sizeToFit}>
            {renderFeature(featureCallback)}
          </Mercator>
          <Mercator data={overlays.features} fitSize={sizeToFit}>
            {renderFeature(overlayCallback)}
          </Mercator>
          {hovers && (
            <Mercator data={hovers.features} fitSize={sizeToFit}>
              {renderFeature(hoverCallback)}
            </Mercator>
          )}
        </g>
      </svg>
      {tooltipOpen && tooltipData && getTooltipContent && (
        <Tooltip
          left={tooltipLeft}
          top={tooltipTop}
          className={styles.tooltipBase}
          style={{}}
        >
          {getTooltipContent(tooltipData)}
        </Tooltip>
      )}
    </>
  );
}

const renderFeature = (callback: TRenderCallback) => {
  return (mercator: any) => (
    <g>
      {mercator.features.map(
        (
          { feature, path }: { feature: Feature; path: string },
          index: number
        ) => {
          if (path) {
            return callback(feature, path, index);
          }
        }
      )}
    </g>
  );
};

const svgClick = (onPathClick: any) => {
  return (event: any) => {
    const elm = event.target;
    if (elm.attributes['data-id']) {
      onPathClick(elm.attributes['data-id'].value);
    }
  };
};

const svgMouseOver = (timout: MutableRefObject<any>, showTooltip: any) => {
  return (event: any) => {
    const elm = event.target;

    if (elm.attributes['data-id']) {
      if (timout.current > -1) {
        clearTimeout(timout.current);
        timout.current = -1;
      }

      const coords = localPoint(event.target.ownerSVGElement, event);

      if (coords) {
        showTooltip({
          tooltipLeft: coords.x + 5,
          tooltipTop: coords.y + 5,
          tooltipData: elm.attributes['data-id'].value,
        });
      }
    }
  };
};

const svgMouseOut = (timout: MutableRefObject<any>, hideTooltip: any) => {
  return () => {
    if (timout.current < 0) {
      timout.current = setTimeout(() => {
        hideTooltip();
      }, 500);
    }
  };
};
