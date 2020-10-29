import { Mercator } from '@vx/geo';
import { Feature, FeatureCollection, MultiPolygon } from 'geojson';
import { ReactNode, useRef, useState } from 'react';
import { debounce } from 'lodash';

import create, { UseStore } from 'zustand';

import { TCombinedChartDimensions } from './hooks/useChartDimensions';

import styles from './choropleth.module.scss';
import { localPoint } from '@vx/event';

import { Tooltip } from './tooltips/tooltipContainer';

export type TooltipState = {
  isEnabled: boolean;
  enable: () => void;
  disable: () => void;

  tooltip: TooltipSettings | null;
  update: (tooltip: TooltipSettings | null) => void;
  clear: () => void;
};

export type TooltipSettings = {
  left: number;
  top: number;
  data: any;
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

  /**
   * Some maps like the gemeente selection map needs different path styling
   */
  isSelectorMap?: boolean;
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
export function Choropleth<T>(props: TProps<T>) {
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
    getTooltipContent,
    isSelectorMap,
  } = props;

  const tooltipStoreRef = useRef<UseStore<TooltipState>>(
    create<TooltipState>((set, get) => ({
      isEnabled: false,
      enable: () => set({ isEnabled: true }),
      disable: () => set({ isEnabled: false }),

      tooltip: null,
      clear: () => set({ tooltip: null }),
      update: debounce(
        (tooltip: TooltipSettings | null) =>
          get().isEnabled && set({ tooltip }),
        120
      ),
    }))
  );

  const clipPathId = useRef(`_${Math.random().toString(36).substring(2, 15)}`);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

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

  const tooltipStore = tooltipStoreRef.current();

  return (
    <>
      <svg
        width={width}
        height={height}
        className={`${styles.svgMap} ${
          isSelectorMap ? styles.selectorMap : ''
        }`}
        onTouchStart={() => setIsTouchDevice(true)}
        onMouseEnter={tooltipStore.enable}
        onMouseOver={createSvgMouseOverHandler(tooltipStore)}
        onClick={createSvgClickHandler(
          tooltipStore,
          onPathClick,
          isTouchDevice
        )}
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
            {renderFeature(featureCallback, 'choropleth-features')}
          </Mercator>
          <Mercator data={overlays.features} fitSize={sizeToFit}>
            {renderFeature(overlayCallback, 'choropleth-overlays')}
          </Mercator>
          {hovers && (
            <Mercator data={hovers.features} fitSize={sizeToFit}>
              {renderFeature(hoverCallback, 'choropleth-hovers')}
            </Mercator>
          )}
        </g>
      </svg>
      {tooltipStore.isEnabled && (
        <Tooltip
          tooltipStore={tooltipStoreRef.current}
          getTooltipContent={getTooltipContent}
          disablePointerEvents={!isTouchDevice}
        />
      )}
    </>
  );
}

const renderFeature = (callback: TRenderCallback, dataCy: string) => {
  return (mercator: any) => (
    <g data-cy={dataCy}>
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

const createSvgClickHandler = (
  tooltipStore: TooltipState,
  onPathClick: (id: string) => void,
  isTouchDevice: boolean
) => {
  return (event: any) => {
    const elm = event.target as HTMLElement;
    const id = elm.getAttribute('data-id') as string | undefined;

    if (!id) return;

    if (isTouchDevice) {
      if (!tooltipStore.isEnabled) tooltipStore.enable();
      tooltipStore.update(positionTooltip(event, elm, id));
    } else {
      onPathClick(id);
    }
  };
};

const createSvgMouseOverHandler = (tooltipStore: TooltipState) => {
  return (event: React.MouseEvent) => {
    const elm = event.target as HTMLElement;

    if (elm.tagName.toLowerCase() === 'svg') {
      return tooltipStore.disable();
    }

    const id = elm.getAttribute('data-id') as string | undefined;

    if (id) {
      if (!tooltipStore.isEnabled) tooltipStore.enable();
      tooltipStore.update(positionTooltip(event, elm, id));
    }
  };
};

const positionTooltip = (event: any, element: any, id: string) => {
  const coords = localPoint(element.ownerSVGElement, event);

  if (!coords) return null;

  return {
    left: coords.x + 5,
    top: coords.y + 5,
    data: id,
  };
};
