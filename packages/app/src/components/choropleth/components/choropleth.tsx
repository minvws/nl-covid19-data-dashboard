import css from '@styled-system/css';
import { localPoint } from '@visx/event';
import Projection from '@visx/geo/lib/projections/Projection';
import { ProjectionPreset } from '@visx/geo/lib/types';
import { GeoProjection } from 'd3-geo';
import {
  Feature,
  FeatureCollection,
  Geometry,
  MultiPolygon,
  Polygon,
} from 'geojson';
import {
  memo,
  MutableRefObject,
  ReactNode,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ChoroplethTooltipPlacement,
  Tooltip,
} from '~/components/choropleth/tooltips';
import { colors } from '~/style/theme';
import {
  AccessibilityDefinition,
  useAccessibilityAnnotations,
} from '~/utils/use-accessibility-annotations';
import { useIsTouchDevice } from '~/utils/use-is-touch-device';
import { useOnClickOutside } from '~/utils/use-on-click-outside';
import { useResizeObserver } from '~/utils/use-resize-observer';
import { useUniqueId } from '~/utils/use-unique-id';
import { Path } from './path';

export enum CHOROPLETH_ASPECT_RATIO {
  nl = 1 / 1.2,
  in = 1 / 0.775,
}

export type TooltipSettings = {
  left: number;
  top: number;
  data: string;
};

type ChoroplethProps<FeatureProperties, HoverProperties, OutlineProperties> = {
  /**
   * An optional projection for the map rendering, defaults to 'mercator'
   */
  projection?: ProjectionPreset | (() => GeoProjection);
  /**
   * The mandatory AccessibilityDefinition provides a reference to annotate the
   * graph with a label and description.
   */
  accessibility: AccessibilityDefinition;
  initialWidth?: number;
  minHeight?: number;
  aspectRatio?: number;
  // This is the main feature collection that displays the features that will
  // be colored in as part of the choropleth
  featureCollection: FeatureCollection<
    MultiPolygon | Polygon,
    FeatureProperties
  >;
  // These are the outline superimposed over the main features.
  outlines?: FeatureCollection<MultiPolygon | Polygon, OutlineProperties>;
  // These are features that are used as as the hover features, these are
  // typically activated when the user mouse overs them.
  hovers?: FeatureCollection<MultiPolygon | Polygon, HoverProperties>;
  // The bounding box is calculated based on these features, this can be used to
  // zoom in on a specific part of the map upon initialization.
  boundingBox: FeatureCollection<MultiPolygon | Polygon>;
  // Add optional padding to the bounding box
  boudingBoxPadding?: {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
  };
  // This callback is invoked for each of the features in the featureCollection property.
  // This will usually return a <path/> element.
  renderFeature: (
    feature: Feature<MultiPolygon | Polygon, FeatureProperties>,
    path: string,
    index: number
  ) => ReactNode;

  renderHighlight?: (
    feature: Feature<MultiPolygon | Polygon, FeatureProperties>,
    path: string,
    index: number
  ) => ReactNode;
  // This callback is invoked for each of the features in the hovers property.
  // This will usually return a <path/> element.
  renderHover: (
    feature: Feature<MultiPolygon | Polygon, HoverProperties>,
    path: string,
    index: number
  ) => ReactNode;
  // This callback is invoked right before a tooltip is shown for one of the features in the featureCollection property.
  // The id is the value that is assigned to the data-id attribute in the renderFeature.
  getTooltipContent: (id: string) => ReactNode;
  tooltipPlacement?: ChoroplethTooltipPlacement;
  description?: string;
  showTooltipOnFocus?: boolean;
};

/**
 * Generic choropleth component that takes a feature collection that is considered the data layer
 * and another that is considered the interactive hover layer.
 *
 * It implements a click and mouseover/mouseout system where the value that is assigned to the
 * data-id attribute of a path is propagated to the injected onPatchClick and getTooltipContent
 * callbacks.
 *
 */

export function Choropleth<
  FeatureProperties,
  HoverProperties,
  OutlineProperties
>({
  getTooltipContent,
  tooltipPlacement,
  ...props
}: ChoroplethProps<FeatureProperties, HoverProperties, OutlineProperties>) {
  const [tooltip, setTooltip] = useState<TooltipSettings>();
  const isTouch = useIsTouchDevice();

  const hoverRef = useRef<SVGGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useOnClickOutside([tooltipRef, hoverRef], () => setTooltip(undefined));

  return (
    <>
      <ChoroplethMap {...props} setTooltip={setTooltip} hoverRef={hoverRef} />

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
          >
            {getTooltipContent(tooltip.data)}
          </Tooltip>
        </div>
      )}
    </>
  );
}

/**
 * Sets the projection’s scale and translate to fit the specified GeoJSON object in the center of the given extent.
 * The extent is specified as an array [[x₀, y₀], [x₁, y₁]], where x₀ is the left side of the bounding box,
 * y₀ is the top, x₁ is the right and y₁ is the bottom.
 *
 * (Description taken from ProjectionProps.fitExtent in @visx/Projection.d.ts)
 */
type FitExtent = [[[number, number], [number, number]], any];

type ChoroplethMapProps<FeatureProperties, HoverProperties, OutlineProperties> =
  Omit<
    ChoroplethProps<FeatureProperties, HoverProperties, OutlineProperties>,
    'getTooltipContent' | 'tooltipPlacement'
  > & {
    setTooltip: (tooltip: TooltipSettings | undefined) => void;
  };

const ChoroplethMap: <FeatureProperties, HoverProperties, OutlineProperties>(
  props: ChoroplethMapProps<
    FeatureProperties,
    HoverProperties,
    OutlineProperties
  > & {
    hoverRef: React.RefObject<SVGGElement>;
  }
) => JSX.Element | null = memo((props) => {
  const {
    projection,
    accessibility,
    featureCollection,
    outlines,
    hovers,
    boundingBox,
    renderFeature,
    renderHover,
    setTooltip,
    hoverRef,
    renderHighlight,
    minHeight = 500,
    showTooltipOnFocus,
    boudingBoxPadding = {},
    aspectRatio = CHOROPLETH_ASPECT_RATIO.nl,
  } = props;

  const [
    containerRef,
    { width = minHeight * (1 / aspectRatio), height = minHeight },
  ] = useResizeObserver<HTMLDivElement>();

  const annotations = useAccessibilityAnnotations(accessibility);
  const clipPathId = useUniqueId();

  const timeout = useRef(-1);
  const isTouch = useIsTouchDevice();

  const fitExtent: FitExtent = [
    [
      [boudingBoxPadding.left ?? 0, boudingBoxPadding.top ?? 0],
      [
        width - (boudingBoxPadding.right ?? 0),
        height - (boudingBoxPadding.bottom ?? 0),
      ],
    ],
    boundingBox,
  ];

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

      const id = link.getAttribute('data-id');

      if (id) {
        const bboxContainer = container.getBoundingClientRect();
        const bboxLink = link.getBoundingClientRect();
        const left = bboxLink.left - bboxContainer.left;
        const top = bboxLink.top - bboxContainer.top;

        setTooltip({
          left: left + bboxLink.width + 5,
          top: top,
          data: id,
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

  return (
    <>
      {annotations.descriptionElement}
      <div
        ref={containerRef}
        style={{
          minHeight,
          maxHeight: '75vh',
          maxWidth: '100%',
        }}
      >
        <svg
          {...annotations.props}
          role="img"
          width={width}
          viewBox={`0 0 ${width} ${height}`}
          css={css({ display: 'block', bg: 'transparent', width: '100%' })}
          onMouseMove={createSvgMouseOverHandler(
            timeout,
            setTooltip,
            containerRef
          )}
          onMouseOut={
            isTouch ? undefined : createSvgMouseOutHandler(timeout, setTooltip)
          }
          data-cy="choropleth-map"
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
              projection={projection}
              data={featureCollection.features}
              render={renderFeature}
              fitExtent={fitExtent}
            />

            {outlines && (
              <g css={css({ pointerEvents: 'none' })}>
                <MercatorGroup
                  projection={projection}
                  data={outlines.features}
                  render={(_, path, index) => (
                    <Path
                      key={index}
                      pathData={path}
                      stroke={colors.silver}
                      strokeWidth={0.5}
                    />
                  )}
                  fitExtent={fitExtent}
                />
              </g>
            )}

            {hovers && (
              <g ref={hoverRef}>
                <MercatorGroup
                  projection={projection}
                  data={hovers.features}
                  render={renderHover}
                  fitExtent={fitExtent}
                />
              </g>
            )}

            {renderHighlight && (
              <MercatorGroup
                projection={projection}
                data={featureCollection.features}
                render={renderHighlight}
                fitExtent={fitExtent}
              />
            )}
          </g>
        </svg>
      </div>
    </>
  );
});

interface MercatorGroupProps<G extends Geometry, P> {
  projection?: ProjectionPreset | (() => GeoProjection);
  data: Feature<G, P>[];
  render: (
    feature: Feature<G, P>,
    path: string,
    index: number
  ) => React.ReactNode;
  fitExtent: FitExtent;
}

function MercatorGroup<G extends Geometry, P>(props: MercatorGroupProps<G, P>) {
  const { projection = 'mercator', data, fitExtent, render } = props;

  return (
    <Projection projection={projection} data={data} fitExtent={fitExtent}>
      {({ features }) => (
        <g>
          {features.map(
            ({ feature, path, index }) =>
              path &&
              render(
                feature,
                /**
                 * Cut off an unnecessary level of detail of the paths strings.
                 * A path value of `M177.08821511867188` becomes `M177`.
                 */
                path.replace(
                  /\d+\.\d+/g,
                  (x) => Math.round(parseFloat(x)) + ''
                ),
                index
              )
          )}
        </g>
      )}
    </Projection>
  );
}

const createSvgMouseOverHandler = (
  timeout: MutableRefObject<number>,
  setTooltip: (settings: TooltipSettings | undefined) => void,
  ref: RefObject<HTMLElement>
) => {
  return (event: React.MouseEvent) => {
    const elm = event.target as HTMLElement | SVGElement;
    const id = elm.getAttribute('data-id');

    if (id && ref.current) {
      if (timeout.current > -1) {
        clearTimeout(timeout.current);
        timeout.current = -1;
      }

      /**
       * Pass the DOM node to fix positioning in Firefox
       */
      const coords = localPoint(ref.current, event);

      if (coords) {
        setTooltip({
          left: coords.x + 5,
          top: coords.y + 5,
          data: id,
        });
      }
    }
  };
};

const createSvgMouseOutHandler = (
  timeout: MutableRefObject<number>,
  setTooltip: (settings: TooltipSettings | undefined) => void
) => {
  return () => {
    if (timeout.current < 0) {
      timeout.current = window.setTimeout(() => setTooltip(undefined), 10);
    }
  };
};
