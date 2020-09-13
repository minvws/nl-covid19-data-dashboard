import { Mercator } from '@vx/geo';
import { Feature, FeatureCollection, MultiPolygon } from 'geojson';
import { MutableRefObject, ReactNode, useMemo, useRef } from 'react';

import { TCombinedChartDimensions } from './hooks/useChartDimensions';

import styles from './chloropleth.module.scss';
import { localPoint } from '@vx/event';
import { TooltipWithBounds, useTooltip } from '@vx/tooltip';

export type TProps<TFeatureProperties> = {
  featureCollection: FeatureCollection<MultiPolygon, TFeatureProperties>;
  overlays: FeatureCollection<MultiPolygon>;
  boundingbox: FeatureCollection<MultiPolygon>;
  dimensions: TCombinedChartDimensions;
  featureCallback: (
    feature: Feature<MultiPolygon, TFeatureProperties>,
    path: string,
    index: number
  ) => ReactNode;
  overlayCallback: (
    feature: Feature<MultiPolygon>,
    path: string,
    index: number
  ) => ReactNode;
  onPathClick: (id: string) => void;
  getTooltipContent: (id: string) => ReactNode;
};

export default function Chloropleth<T>(props: TProps<T>) {
  const {
    featureCollection,
    overlays,
    boundingbox,
    dimensions,
    featureCallback,
    overlayCallback,
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

  const sizeToFit: any = useMemo(() => {
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

  return width < 10 ? null : (
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
        </g>
      </svg>
      {tooltipOpen && tooltipData && getTooltipContent && (
        <TooltipWithBounds
          key={Math.random()}
          left={tooltipLeft}
          top={tooltipTop}
          className={styles.toolTip}
        >
          {getTooltipContent(tooltipData)}
        </TooltipWithBounds>
      )}
    </>
  );
}

const renderFeature = (callback: any) => {
  return (mercator: any) => (
    <g>
      {mercator.features.map(
        ({ feature, path }: { feature: any; path: any }, index: number) => {
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
    if (elm.id) {
      onPathClick(elm.id);
    }
  };
};

const svgMouseOver = (timout: MutableRefObject<any>, showTooltip: any) => {
  return (event: any) => {
    const elm = event.target;

    if (elm.id) {
      if (timout.current > -1) {
        clearTimeout(timout.current);
        timout.current = -1;
      }

      const coords = localPoint(event.target.ownerSVGElement, event);

      if (coords) {
        showTooltip({
          tooltipLeft: coords.x + 5,
          tooltipTop: coords.y + 5,
          tooltipData: elm.id,
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
