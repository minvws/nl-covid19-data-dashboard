import { KeysOfType } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { memo, useMemo, useRef, useState } from 'react';
import { isDefined } from 'ts-is-present';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useIsTouchDevice } from '~/utils/use-is-touch-device';
import { useOnClickOutside } from '~/utils/use-on-click-outside';
import { useResizeObserver } from '~/utils/use-resize-observer';
import { useUniqueId } from '~/utils/use-unique-id';
import { Box } from '../base';
import { MercatorGroup } from './components/mercator-group';
import { MercatorHoverGroup } from './components/mercator-hover-group';
import {
  ChoroplethDataItem,
  CHOROPLETH_ASPECT_RATIO,
  FitExtent,
  InferredDataItem,
  MapType,
  useChoroplethData,
  useChoroplethFeatures,
  useFeatureProps,
  useFillColor,
  useTabInteractiveButton,
} from './logic';
import { useChoroplethTooltip } from './logic/use-choropleth-tooltip';
import { ChoroplethTooltipPlacement, Tooltip } from './tooltips';
import { TooltipFormatter, TooltipSettings } from './tooltips/types';

const DEFAULT_HOVER_STROKE_WIDTH = 3;

export type DataOptions = {
  isPercentage?: boolean;
  getLink?: (code: string) => string;
  getFeatureName?: (code: string) => string;
  highlightSelection?: boolean;
  selectedCode?: string;
};

type OptionalDataConfig<T extends ChoroplethDataItem> = {
  metricProperty: KeysOfType<T, number, true>;
  noDataFillColor?: string;
  hoverStroke?: string;
  hoverStrokeWidth?: number;
  highlightStroke?: string;
  highlightStrokeWidth?: number;
};

export type DataConfig<T extends ChoroplethDataItem> = Required<
  OptionalDataConfig<T>
>;

type OptionalBoundingBoxPadding = {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
};

type BoundingBoxPadding = Required<OptionalBoundingBoxPadding>;

type ChoroplethProps<T extends MapType, K extends InferredDataItem<T>> = {
  data: K[];
  dataConfig: OptionalDataConfig<K>;
  dataOptions: DataOptions;
  map: T;
  formatTooltip?: TooltipFormatter<K>;
  tooltipPlacement?: ChoroplethTooltipPlacement;
  minHeight?: number;
  boudingBoxPadding?: OptionalBoundingBoxPadding;
  showTooltipOnFocus?: boolean;
};

export function Choropleth<T extends MapType, K extends InferredDataItem<T>>({
  formatTooltip,
  tooltipPlacement,
  ...props
}: ChoroplethProps<T, K>) {
  const [tooltip, setTooltip] = useState<TooltipSettings<K>>();
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
            formatTooltip={formatTooltip}
            data={tooltip.data}
          />
        </div>
      )}
    </>
  );
}

const ChoroplethMap: <T extends MapType, K extends InferredDataItem<T>>(
  props: Omit<ChoroplethProps<T, K>, 'formatTooltip' | 'tooltipPlacement'> & {
    hoverRef: React.RefObject<SVGGElement>;
    setTooltip: (tooltip: TooltipSettings<K> | undefined) => void;
  }
) => JSX.Element | null = memo((props) => {
  const {
    data: originalData,
    dataConfig: originalDataConfig,
    dataOptions,
    map,
    minHeight = 500,
    boudingBoxPadding: originalPadding = {},
    hoverRef,
    setTooltip,
    showTooltipOnFocus,
  } = props;

  const dataConfig = {
    metricProperty: originalDataConfig.metricProperty,
    noDataFillColor:
      originalDataConfig.noDataFillColor ?? colors.choroplethNoData,
    hoverStroke:
      originalDataConfig.hoverStroke ?? colors.choroplethFeatureStroke,
    hoverStrokeWidth:
      originalDataConfig.hoverStrokeWidth ?? DEFAULT_HOVER_STROKE_WIDTH,
    highlightStroke:
      originalDataConfig.highlightStroke ?? colors.choroplethHighlightStroke,
    highlightStrokeWidth:
      originalDataConfig.highlightStrokeWidth ?? DEFAULT_HOVER_STROKE_WIDTH,
  };

  const boudingBoxPadding: BoundingBoxPadding = {
    left: originalPadding.left ?? 0,
    right: originalPadding.right ?? 0,
    top: originalPadding.top ?? 0,
    bottom: originalPadding.bottom ?? 0,
  };

  const aspectRatio =
    map === 'in' ? CHOROPLETH_ASPECT_RATIO.in : CHOROPLETH_ASPECT_RATIO.nl;
  const mapProjection = map === 'in' ? 'mercator' : 'mercator';

  const { siteText } = useIntl();
  const clipPathId = useUniqueId();
  const data = useChoroplethData(originalData, map, dataOptions.selectedCode);

  const [
    containerRef,
    { width = minHeight * (1 / aspectRatio), height = minHeight },
  ] = useResizeObserver<HTMLDivElement>();

  const choroplethFeatures = useChoroplethFeatures(
    map,
    dataOptions.selectedCode
  );

  const { isTabInteractive, tabInteractiveButton, anchorEventHandlers } =
    useTabInteractiveButton(
      replaceVariablesInText(siteText.choropleth.a11y.tab_navigatie_button, {
        subject: siteText.choropleth.gm.plural,
      })
    );

  const getFillColor = useFillColor(
    data,
    map,
    dataConfig.metricProperty,
    dataConfig
  );

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
    showTooltipOnFocus,
    setTooltip,
    containerRef
  );

  const fitExtent: FitExtent = useMemo(
    () => [
      [
        [boudingBoxPadding.left, boudingBoxPadding.top],
        [width - boudingBoxPadding.right, height - boudingBoxPadding.bottom],
      ],
      choroplethFeatures.boundingBox,
    ],
    [
      width,
      height,
      boudingBoxPadding.left,
      boudingBoxPadding.right,
      boudingBoxPadding.top,
      boudingBoxPadding.bottom,
      choroplethFeatures.boundingBox,
    ]
  );

  return (
    <Box position="relative" height="100%">
      {tabInteractiveButton}
      <div
        css={css({ bg: 'transparent', position: 'relative', height: '100%' })}
      >
        <div
          ref={containerRef}
          style={{
            minHeight,
            maxHeight: '75vh',
            maxWidth: '100%',
          }}
        >
          <svg
            role="img"
            width={width}
            viewBox={`0 0 ${width} ${height}`}
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
                  getTitle={() => 'title'}
                  getHref={dataOptions.getLink}
                  {...anchorEventHandlers}
                />
              </g>
            </g>
          </svg>
        </div>
      </div>
    </Box>
  );
});
