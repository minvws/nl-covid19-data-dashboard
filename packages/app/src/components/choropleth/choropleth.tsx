import css from '@styled-system/css';
import { localPoint } from '@visx/event';
import { Mercator } from '@visx/geo';
import { Feature, FeatureCollection, Geometry, MultiPolygon } from 'geojson';
import {
  memo,
  MutableRefObject,
  ReactNode,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import { colors } from '~/style/theme';
import { useIsTouchDevice } from '~/utils/use-is-touch-device';
import { useOnClickOutside } from '~/utils/use-on-click-outside';
import { useResponsiveContainer } from '~/utils/use-responsive-container';
import { useUniqueId } from '~/utils/use-unique-id';
import {
  AccessibilityDefinition,
  useAccessibilityAnnotations,
} from '~/utils/use-accessibility-annotations';
import { Path } from './path';
import {
  ChoroplethTooltipPlacement,
  Tooltip,
} from './tooltips/tooltip-container';
import { countryGeo } from './topology';

export type TooltipSettings = {
  left: number;
  top: number;
  data: string;
};

type TProps<T1, T3> = {
  /**
   * The mandatory AccessibilityDefinition provides a reference to annotate the
   * graph with a label and description.
   */
  accessibility: AccessibilityDefinition;
  initialWidth?: number;
  minHeight?: number;
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
  tooltipPlacement?: ChoroplethTooltipPlacement;
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
  tooltipPlacement,
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

type FitSize = [[number, number], any];

type ChoroplethMapProps<T1, T3> = Omit<
  TProps<T1, T3>,
  'getTooltipContent' | 'tooltipPlacement'
> & {
  setTooltip: (tooltip: TooltipSettings | undefined) => void;
};

const ChoroplethMap: <T1, T3>(
  props: ChoroplethMapProps<T1, T3> & {
    hoverRef: React.RefObject<SVGGElement>;
  }
) => JSX.Element | null = memo((props) => {
  const {
    accessibility,
    featureCollection,
    hovers,
    boundingBox,
    renderFeature,
    renderHover,
    setTooltip,
    hoverRef,
    renderHighlight,
    minHeight = 500,
    initialWidth = 0.9 * minHeight,
    showTooltipOnFocus,
  } = props;

  const ratio = 1.2;

  const { ResponsiveContainer, ...responsive } = useResponsiveContainer(
    initialWidth,
    minHeight
  );

  const annotations = useAccessibilityAnnotations(accessibility);

  const width = responsive.width;
  const height = Math.min(responsive.height, width * ratio);

  const clipPathId = useUniqueId();

  const timeout = useRef(-1);
  const isTouch = useIsTouchDevice();

  const fitSize: FitSize = [[width, height], boundingBox];

  useEffect(() => {
    if (!showTooltipOnFocus) {
      setTooltip(undefined);
      return;
    }

    const container = responsive.ref.current;

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
  }, [responsive.ref, setTooltip, showTooltipOnFocus, isTouch]);

  return (
    <>
      {annotations.descriptionElement}
      <ResponsiveContainer height={height}>
        <svg
          {...annotations.props}
          role="img"
          width={width}
          viewBox={`0 0 ${width} ${height}`}
          css={css({ display: 'block', bg: 'transparent', width: '100%' })}
          onMouseMove={createSvgMouseOverHandler(
            timeout,
            setTooltip,
            responsive.ref
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
      </ResponsiveContainer>
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
