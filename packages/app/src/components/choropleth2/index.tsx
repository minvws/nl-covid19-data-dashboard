import { KeysOfType } from '@corona-dashboard/common';
import css from '@styled-system/css';
import Projection, {
  ParsedFeature,
} from '@visx/geo/lib/projections/Projection';
import { ProjectionPreset } from '@visx/geo/lib/types';
import { GeoProjection } from 'd3-geo';
import { Feature, MultiPolygon, Polygon } from 'geojson';
import { FocusEvent, memo, ReactNode, useRef } from 'react';
import { isDefined, isPresent } from 'ts-is-present';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useResizeObserver } from '~/utils/use-resize-observer';
import { useUniqueId } from '~/utils/use-unique-id';
import { Box } from '../base';
import { HoverPathLink, Path } from './components/path';
import {
  ChoroplethDataItem,
  CHOROPLETH_ASPECT_RATIO,
  CodedGeoProperties,
  FitExtent,
  InferredDataItem,
  MapType,
  useChoroplethData,
  useChoroplethFeatures,
  useFeatureProps,
  useFillColor,
  useTabInteractiveButton,
} from './logic';
import { ChoroplethTooltipPlacement } from './tooltips';

export type DataOptions = {
  isPercentage?: boolean;
  getLink?: (code: string) => string;
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
  tooltipContent: (context: InferredDataItem<T>) => ReactNode;
  tooltipPlacement?: ChoroplethTooltipPlacement;
  minHeight?: number;
  boudingBoxPadding?: OptionalBoundingBoxPadding;
};

export function Choropleth<T extends MapType, K extends InferredDataItem<T>>(
  props: ChoroplethProps<T, K>
) {
  return (
    <>
      <ChoroplethMap {...props} />
    </>
  );
}

const ChoroplethMap: <T extends MapType, K extends InferredDataItem<T>>(
  props: ChoroplethProps<T, K>
) => JSX.Element | null = memo((props) => {
  const {
    data: originalData,
    dataConfig: originalDataConfig,
    dataOptions,
    map,
    minHeight = 500,
    tooltipContent,
    tooltipPlacement,
    boudingBoxPadding: originalPadding = {},
  } = props;

  const dataConfig = {
    metricProperty: originalDataConfig.metricProperty,
    noDataFillColor: originalDataConfig.noDataFillColor ?? 'white',
    hoverStroke: originalDataConfig.hoverStroke ?? colors.silver,
    hoverStrokeWidth: originalDataConfig.hoverStrokeWidth ?? 3,
    highlightStroke: originalDataConfig.highlightStroke ?? 'black',
    highlightStrokeWidth: originalDataConfig.highlightStrokeWidth ?? 3,
  };

  const boudingBoxPadding: BoundingBoxPadding = {
    left: originalPadding.left ?? 0,
    right: originalPadding.right ?? 0,
    top: originalPadding.top ?? 0,
    bottom: originalPadding.bottom ?? 0,
  };

  const data = useChoroplethData(originalData, map, dataOptions.selectedCode);

  const aspectRatio =
    map === 'in' ? CHOROPLETH_ASPECT_RATIO.in : CHOROPLETH_ASPECT_RATIO.nl;
  const mapProjection = map === 'in' ? 'mercator' : 'mercator';

  const { siteText } = useIntl();
  const hoverRef = useRef<SVGGElement>(null);
  const clipPathId = useUniqueId();

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

  const fitExtent: FitExtent = [
    [
      [boudingBoxPadding.left, boudingBoxPadding.top],
      [width - boudingBoxPadding.right, height - boudingBoxPadding.bottom],
    ],
    choroplethFeatures.boundingBox,
  ];

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

type MercatorGroupProps = {
  projection?: ProjectionPreset | (() => GeoProjection);
  data: Feature<MultiPolygon | Polygon, CodedGeoProperties>[];
  fitExtent: FitExtent;
  fillMethod: (code: string) => string;
  strokeMethod: (code: string) => string;
  strokeWidthMethod: (code: string) => number;
};

function MercatorGroup(props: MercatorGroupProps) {
  const {
    projection = 'mercator',
    data,
    fitExtent,
    fillMethod,
    strokeMethod,
    strokeWidthMethod,
  } = props;

  return (
    <Projection projection={projection} data={data} fitExtent={fitExtent}>
      {({ features }) => (
        <g>
          {features
            .filter(hasPath)
            .map((x) => ({
              ...x,
              path: x.path.replace(
                /\d+\.\d+/g,
                (x) => Math.round(parseFloat(x)) + ''
              ),
            }))
            .map(({ feature, path, index }) => {
              return isPresent(path) ? (
                <Path
                  key={`${feature.properties.code}_${index}`}
                  pathData={path}
                  fill={fillMethod(feature.properties.code)}
                  stroke={strokeMethod(feature.properties.code)}
                  strokeWidth={strokeWidthMethod(feature.properties.code)}
                />
              ) : null;
            })}
        </g>
      )}
    </Projection>
  );
}

type MercatorHoverGroupProps = {
  getHref?: (code: string) => string;
  getTitle: (code: string) => string;
  onFocus: (evt: FocusEvent<HTMLAnchorElement>) => void;
  onBlur: (evt: FocusEvent<HTMLAnchorElement>) => void;
  isTabInteractive: boolean;
} & MercatorGroupProps;

function MercatorHoverGroup(props: MercatorHoverGroupProps) {
  const {
    projection = 'mercator',
    data,
    fitExtent,
    fillMethod,
    strokeMethod,
    strokeWidthMethod,
    onFocus,
    onBlur,
    isTabInteractive,
    getHref,
    getTitle,
  } = props;

  return (
    <Projection projection={projection} data={data} fitExtent={fitExtent}>
      {({ features }) => (
        <g>
          {features
            .filter(hasPath)
            .map((x) => ({
              ...x,
              path: x.path.replace(
                /\d+\.\d+/g,
                (x) => Math.round(parseFloat(x)) + ''
              ),
            }))
            .map(({ feature, path, index }) => {
              const { code } = feature.properties;
              return isPresent(path) ? (
                <HoverPathLink
                  id={code}
                  key={`${code}_${index}`}
                  pathData={path}
                  fill={fillMethod(code)}
                  stroke={strokeMethod(code)}
                  strokeWidth={strokeWidthMethod(code)}
                  isTabInteractive={isTabInteractive}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  title={getTitle(code)}
                  href={getHref ? getHref(code) : undefined}
                />
              ) : null;
            })}
        </g>
      )}
    </Projection>
  );
}

function hasPath(
  value: ParsedFeature<Feature<MultiPolygon | Polygon, CodedGeoProperties>>
): value is ParsedFeatureWithPath {
  return isPresent(value.path);
}

type ParsedFeatureWithPath = Omit<
  ParsedFeature<Feature<MultiPolygon | Polygon, CodedGeoProperties>>,
  'path'
> & { path: string };
