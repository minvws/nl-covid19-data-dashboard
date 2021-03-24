import css from '@styled-system/css';
import { localPoint } from '@visx/event';
import { Mercator } from '@visx/geo';
import { Feature, FeatureCollection, Geometry, MultiPolygon } from 'geojson';
import {
  memo,
  MutableRefObject,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useIsTouchDevice } from '~/utils/use-is-touch-device';
import { useOnClickOutside } from '~/utils/use-on-click-outside';
import { useChartDimensions } from './hooks/use-chart-dimensions';
import { Path } from './path';
import { Tooltip } from './tooltips/tooltip-container';
import { countryGeo } from './topology';
import { useUniqueId } from '~/utils/use-unique-id';
import { colors } from '~/style/theme';

export type TooltipSettings = {
  left: number;
  top: number;
  data: string;
};

type TProps<T1, T3> = {
  initialWidth?: number;
  // This is the main feature collection that displays the features that will
  // be colored in as part of the choropleth
  featureCollection: FeatureCollection<MultiPolygon, T1>;
  // These are features that are used as as the hover features, these are
  // typically activated when the user mouse overs them.
  hovers?: FeatureCollection<MultiPolygon, T3>;
  // The bounding box is calculated based on these features, this can be used to
  // zoom in on a specific part of the map upon initialization.
  boundingBox: FeatureCollection<MultiPolygon>;
  // This callback is invoked for each of the features in the featureCollection property.
  // This will usually return a <path/> element.
  renderFeature: (
    feature: Feature<MultiPolygon, T1>,
    path: string,
    index: number
  ) => ReactNode;

  renderHighlight?: (
    feature: Feature<MultiPolygon, T1>,
    path: string,
    index: number
  ) => ReactNode;
  // This callback is invoked for each of the features in the hovers property.
  // This will usually return a <path/> element.
  renderHover: (
    feature: Feature<MultiPolygon, T3>,
    path: string,
    index: number
  ) => ReactNode;
  // This callback is invoked right before a tooltip is shown for one of the features in the featureCollection property.
  // The id is the value that is assigned to the data-id attribute in the renderFeature.
  getTooltipContent: (id: string) => ReactNode;
  description?: string;
  showTooltipOnFocus?: boolean;
};

/**
 * Generic choropleth component that takes featurecollection that is considered the data layer
 * and another that is considered the interactive hover layer.
 * It implements a click and mouseover/mouseout system where the value that is assigned to the
 * data-id attribute of a path is propagated to the injected onPatchClick and getTooltipContent
 * callbacks.
 *
 * @param props
 */

export function Choropleth<T1, T3>({
  getTooltipContent,
  ...props
}: TProps<T1, T3>) {
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

type FitSize = [[number, number], any];

type ChoroplethMapProps<T1, T3> = Omit<TProps<T1, T3>, 'getTooltipContent'> & {
  setTooltip: (tooltip: TooltipSettings | undefined) => void;
};

const ChoroplethMap: <T1, T3>(
  props: ChoroplethMapProps<T1, T3> & {
    hoverRef: React.RefObject<SVGGElement>;
  }
) => JSX.Element | null = memo((props) => {
  const {
    featureCollection,
    hovers,
    boundingBox,
    renderFeature,
    renderHover,
    setTooltip,
    hoverRef,
    description,
    renderHighlight,
    initialWidth = 850,
    showTooltipOnFocus,
  } = props;

  const ratio = 1.2;
  const [ref, dimensions] = useChartDimensions<HTMLDivElement>(
    initialWidth,
    ratio
  );

  const clipPathId = useUniqueId();
  const dataDescriptionId = useUniqueId();

  const timeout = useRef(-1);
  const isTouch = useIsTouchDevice();

  const {
    width,
    height,
    marginLeft,
    marginTop,
    boundedWidth,
    boundedHeight,
  } = dimensions;

  const fitSize: FitSize = [[boundedWidth, boundedHeight], boundingBox];

  useEffect(() => {
    if (!showTooltipOnFocus) {
      setTooltip(undefined);
      return;
    }

    const container = ref.current;

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
  }, [ref, setTooltip, showTooltipOnFocus, isTouch]);

  return (
    <>
      <span id={dataDescriptionId} style={{ display: 'none' }}>
        {description}
      </span>
      <div ref={ref}>
        <svg
          width={width}
          viewBox={`0 0 ${width} ${height}`}
          css={css({ display: 'block', bg: 'transparent', width: '100%' })}
          onMouseMove={createSvgMouseOverHandler(timeout, setTooltip)}
          onMouseOut={
            isTouch ? undefined : createSvgMouseOutHandler(timeout, setTooltip)
          }
          data-cy="choropleth-map"
          aria-labelledby={dataDescriptionId}
        >
          <clipPath id={clipPathId}>
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
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill={'none'}
            rx={14}
          />
          <g
            transform={`translate(${marginLeft},${marginTop})`}
            clipPath={`url(#${clipPathId})`}
          >
            <MercatorGroup
              data={featureCollection.features}
              render={renderFeature}
              fitSize={fitSize}
            />

            <Country fitSize={fitSize} />

            {hovers && (
              <g ref={hoverRef}>
                <MercatorGroup
                  data={hovers.features}
                  render={renderHover}
                  fitSize={fitSize}
                />
              </g>
            )}

            {renderHighlight && (
              <MercatorGroup
                data={featureCollection.features}
                render={renderHighlight}
                fitSize={fitSize}
              />
            )}
          </g>
        </svg>
      </div>
    </>
  );
});

function Country({ fitSize }: { fitSize: FitSize }) {
  return (
    <g css={css({ pointerEvents: 'none' })}>
      <MercatorGroup
        data={countryGeo.features}
        render={(_, path, index) => (
          <Path
            key={index}
            pathData={path}
            stroke={colors.silver}
            strokeWidth={0.5}
          />
        )}
        fitSize={fitSize}
      />
    </g>
  );
}

interface MercatorGroupProps<G extends Geometry, P> {
  data: Feature<G, P>[];
  render: (
    feature: Feature<G, P>,
    path: string,
    index: number
  ) => React.ReactNode;
  fitSize: FitSize;
}

function MercatorGroup<G extends Geometry, P>(props: MercatorGroupProps<G, P>) {
  const { data, fitSize, render } = props;

  return (
    <Mercator data={data} fitSize={fitSize}>
      {({ features }) => (
        <g>
          {features.map(
            ({ feature, path, index }) => path && render(feature, path, index)
          )}
        </g>
      )}
    </Mercator>
  );
}

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

      const coords = localPoint(event);

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
      timeout.current = window.setTimeout(() => setTooltip(undefined), 500);
    }
  };
};
