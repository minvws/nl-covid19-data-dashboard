import css from '@styled-system/css';
import { localPoint } from '@vx/event';
import { Mercator } from '@vx/geo';
import { GeoPermissibleObjects } from 'd3-geo';
import { Feature, FeatureCollection, Geometry, MultiPolygon } from 'geojson';
import { memo, MutableRefObject, ReactNode, useRef, useState } from 'react';
import { useIsTouchDevice } from '~/utils/use-is-touch-device';
import { TCombinedChartDimensions } from './hooks/use-chart-dimensions';
import { Tooltip } from './tooltips/tooltipContainer';

export type TooltipSettings = {
  left: number;
  top: number;
  data: string;
};

export type TRenderCallback = (
  feature: Feature<any, any>,
  path: string,
  index: number
) => ReactNode;

export type TProps<TFeatureProperties> = {
  // This is the main feature collection that displays the features that will
  // be colored in as part of the choropleth
  featureCollection: FeatureCollection<MultiPolygon, TFeatureProperties>;
  // These are features that are used as an overlay, overlays have no interactions
  // they are simply there to beautify the map or emphasize certain parts.
  overlays: FeatureCollection<MultiPolygon>;
  // These are features that are used as as the hover features, these are
  // typically activated when the user mouse overs them.
  hovers?: FeatureCollection<MultiPolygon, TFeatureProperties>;
  // The bounding box is calculated based on these features, this can be used to
  // zoom in on a specific part of the map upon initialization.
  boundingBox: FeatureCollection<MultiPolygon>;
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
    feature: Feature<MultiPolygon, TFeatureProperties>,
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
 * Generic choropleth component that takes featurecollection that is considered the data layer
 * and another that is considered the overlay layer.
 * It implements a click and mouseover/mouseout system where the value that is assigned to the
 * data-id attribute of a path is propagated to the injected onPatchClick and getTooltipContent
 * callbacks.
 *
 * @param props
 */

export function Choropleth<T>({ getTooltipContent, ...props }: TProps<T>) {
  const [tooltip, setTooltip] = useState<TooltipSettings>();
  const isTouch = useIsTouchDevice();
  return (
    <>
      <ChoroplethMap {...props} setTooltip={setTooltip} />

      {tooltip && (
        <div style={{ pointerEvents: isTouch ? 'all' : 'none' }}>
          <Tooltip
            left={tooltip.left}
            top={tooltip.top}
            setTooltip={setTooltip}
          >
            {getTooltipContent(tooltip.data)}
          </Tooltip>
        </div>
      )}
    </>
  );
}

type ChoroplethMapProps<T> = Omit<TProps<T>, 'getTooltipContent'> & {
  setTooltip: (tooltip: TooltipSettings | undefined) => void;
};

const ChoroplethMap: <T>(
  props: ChoroplethMapProps<T>
) => JSX.Element | null = memo((props) => {
  const {
    featureCollection,
    overlays,
    hovers,
    boundingBox,
    dimensions,
    featureCallback,
    overlayCallback,
    hoverCallback,
    onPathClick,
    setTooltip,
  } = props;

  const clipPathId = useRef(`_${Math.random().toString(36).substring(2, 15)}`);
  const timeout = useRef(-1);
  const isTouch = useIsTouchDevice();

  const {
    width = 0,
    height = 0,
    marginLeft,
    marginTop,
    boundedWidth,
    boundedHeight,
  } = dimensions;

  const sizeToFit: [[number, number], any] = [
    [boundedWidth, boundedHeight],
    boundingBox,
  ];

  return (
    <>
      <svg
        width={width}
        height={height}
        css={css({ display: 'block', bg: 'transparent' })}
        onMouseMove={createSvgMouseOverHandler(timeout, setTooltip)}
        onMouseOut={
          isTouch ? undefined : createSvgMouseOutHandler(timeout, setTooltip)
        }
        onClick={createSvgClickHandler(onPathClick, setTooltip, isTouch)}
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
          <MercatorGroup
            data={featureCollection.features}
            render={featureCallback}
            fitSize={sizeToFit}
          />

          <MercatorGroup
            data={overlays.features}
            render={overlayCallback}
            fitSize={sizeToFit}
          />

          {hovers && (
            <MercatorGroup
              data={hovers.features}
              render={hoverCallback}
              fitSize={sizeToFit}
            />
          )}
        </g>
      </svg>
    </>
  );
});

interface MercatorGroupProps<G extends Geometry, P> {
  data: Array<Feature<G, P>>;
  render: any;
  fitSize: [[number, number], any];
}

function MercatorGroup<G extends Geometry, P>(props: MercatorGroupProps<G, P>) {
  const { data, fitSize, render } = props;

  return (
    <Mercator
      /**
       * @TODO It looks like there are some discrepancies between types coming
       * from geojson and d3-geo.
       * Our data uses geojson, the Mercator component depends on d3-geo.
       */
      data={(data as unknown) as GeoPermissibleObjects[]}
      fitSize={fitSize}
    >
      {({ features }) => (
        <g data-cy="choropleth-features">
          {features.map(
            ({ feature, path, index }) => path && render(feature, path, index)
          )}
        </g>
      )}
    </Mercator>
  );
}

const createSvgClickHandler = (
  onPathClick: (id: string) => void,
  setTooltip: (settings: TooltipSettings | undefined) => void,
  isTouch: boolean
) => {
  return (event: React.MouseEvent) => {
    const elm = event.target as HTMLElement | SVGElement;
    const id = elm.getAttribute('data-id');

    if (id) {
      if (isTouch) {
        positionTooltip(event, setTooltip, id);
      } else {
        onPathClick(id);
      }
    }
  };
};

const createSvgMouseOverHandler = (
  timeout: MutableRefObject<number>,
  setTooltip: (settings: TooltipSettings | undefined) => void
) => {
  return (event: React.MouseEvent) => {
    const elm = event.target as HTMLElement | SVGElement;
    const id = elm.getAttribute('data-id');

    if (id) {
      if (timeout.current > -1) {
        clearTimeout(timeout.current);
        timeout.current = -1;
      }

      positionTooltip(event, setTooltip, id);
    }
  };
};

const positionTooltip = (
  event: React.MouseEvent,
  setTooltip: (settings: TooltipSettings | undefined) => void,
  id: string
) => {
  const coords = localPoint(event);

  if (coords) {
    setTooltip({
      left: coords.x + 5,
      top: coords.y + 5,
      data: id,
    });
  }
};

const createSvgMouseOutHandler = (
  timeout: MutableRefObject<number>,
  setTooltip: (settings: TooltipSettings | undefined) => void
) => {
  return () => {
    if (timeout.current < 0) {
      timeout.current = window.setTimeout(() => setTooltip(undefined), 500);
    }
  };
};
