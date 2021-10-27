import css from '@styled-system/css';
import type { GeoProjection } from 'd3-geo';
import { MutableRefObject } from 'react';
import { isDefined } from 'ts-is-present';
import { AccessibilityAnnotations } from '~/utils/use-accessibility-annotations';
import { useUniqueId } from '~/utils/use-unique-id';
import { DataOptions } from '..';
import {
  ChoroplethFeatures,
  ChoroplethTooltipHandlers,
  FeatureProps,
  FitExtent,
} from '../logic';
import { AnchorEventHandler } from './choropleth-map';
import { MercatorGroup } from './mercator-group';
import { MercatorHoverGroup } from './mercator-hover-group';

export type GenericChoroplethMapProps = {
  containerRef: MutableRefObject<HTMLDivElement | null>;
  hoverRef: MutableRefObject<SVGGElement | null>;
  dataOptions: DataOptions;
  width: number;
  height: number;
  annotations: AccessibilityAnnotations;
  featureOverHandler: ChoroplethTooltipHandlers[0];
  featureOutHandler: ChoroplethTooltipHandlers[1];
  tooltipTrigger: ChoroplethTooltipHandlers[2];
  mapProjection: () => GeoProjection;
  choroplethFeatures: ChoroplethFeatures;
  featureProps: FeatureProps;
  fitExtent: FitExtent;
  anchorEventHandlers: AnchorEventHandler;
  isTabInteractive: boolean;
  getFeatureName: (code: string) => string;
};

export const SvgChoroplethMap = (props: GenericChoroplethMapProps) => {
  const {
    containerRef,
    hoverRef,
    dataOptions,
    width,
    height,
    annotations,
    featureOverHandler,
    featureOutHandler,
    mapProjection,
    choroplethFeatures,
    featureProps,
    fitExtent,
    anchorEventHandlers,
    isTabInteractive,
    getFeatureName,
  } = props;
  const clipPathId = useUniqueId();

  const { area, outline, hover } = featureProps;

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: height,
        maxHeight: '75vh',
        maxWidth: '100%',
      }}
    >
      <svg
        aria-labelledby={annotations.props['aria-describedby']}
        role="img"
        width={width}
        viewBox={`0 0 ${width} ${height}`}
        css={css({ display: 'block', bg: 'transparent', width: '100%' })}
        onMouseMove={featureOverHandler}
        onMouseOut={featureOutHandler}
      >
        <clipPath id={clipPathId}>
          <rect x={0} y={0} height={height} width={width} />
        </clipPath>
        <rect x={0} y={0} width={width} height={height} fill={'none'} rx={14} />
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
              getTitle={getFeatureName}
              getHref={dataOptions.getLink}
              {...anchorEventHandlers}
            />
          </g>
        </g>
      </svg>
    </div>
  );
};
