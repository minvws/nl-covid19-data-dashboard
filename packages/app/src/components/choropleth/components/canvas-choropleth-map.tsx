import Konva from 'konva';
import {
  memo,
  MouseEvent,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Group, Layer, Line, Stage } from 'react-konva';
import { isDefined, isPresent } from 'ts-is-present';
import { colors } from '~/style/theme';
import { useIsTouchDevice } from '~/utils/use-is-touch-device';
import { useUniqueId } from '~/utils/use-unique-id';
import { FeatureProps } from '../logic';
import { useHighlightedFeature } from '../logic/use-highlighted-feature';
import {
  ProjectedGeoInfo,
  useProjectedCoordinates,
} from '../logic/use-projected-coordinates';
import { AnchorEventHandler } from './choropleth-map';
import { GenericChoroplethMapProps } from './svg-choropleth-map';

Konva.pixelRatio =
  typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1;

/**
 * This is one transparent pixel encoded in a dataUrl. This is used for the image overlay on top of the canvas that
 * uses the area map to detect feature mouse overs
 */
const oneTransparentPixelImage =
  'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC';

export const CanvasChoroplethMap = (props: GenericChoroplethMapProps) => {
  const {
    containerRef,
    annotations,
    dataOptions,
    width,
    height,
    featureOverHandler,
    featureOutHandler,
    tooltipTrigger,
    mapProjection,
    choroplethFeatures,
    featureProps,
    fitExtent,
    anchorEventHandlers,
    isTabInteractive,
    getFeatureName,
  } = props;

  const [hover, setHover] = useState<[number, number][][]>();
  const [hoverCode, setHoverCode] = useState<string>();
  const [keyboardActive, setKeyboardActive] = useState(false);

  const [geoInfo, geoInfoLookup] = useProjectedCoordinates(
    choroplethFeatures.hover,
    mapProjection,
    fitExtent
  );

  const [outlineGeoInfo] = useProjectedCoordinates(
    choroplethFeatures.outline,
    mapProjection,
    fitExtent
  );

  const highlight = useHighlightedFeature(geoInfo, dataOptions);

  const selectFeature = useCallback(
    (code: string | undefined, isKeyboardAction = false) => {
      setKeyboardActive(isKeyboardAction);
      if (!isDefined(code)) {
        return;
      }

      setHoverCode(code);
      setHover(geoInfoLookup[code]);
    },
    [setHover, geoInfoLookup]
  );

  const handleMouseOver = useCallback(
    (evt: MouseEvent<HTMLElement>) => {
      const areaElm = evt.target as HTMLElement;
      const code = areaElm.getAttribute('data-id');
      if (!isPresent(code)) {
        setHover(undefined);
        setHoverCode(undefined);
        tooltipTrigger();
      } else {
        selectFeature(code);
        featureOverHandler(evt);
      }
    },
    [setHover, selectFeature, featureOverHandler, tooltipTrigger]
  );

  const hoveredRef = useRef<Konva.Group>(null);
  const stageRef = useRef<Konva.Stage>(null);

  useEffect(() => {
    if (!keyboardActive) {
      return;
    }

    tooltipTrigger();

    const { current } = hoveredRef;

    /**
     * Determine the center of the given feature and use that
     * as the left top coordinate for the tooltip to appear at.
     */
    if (isPresent(current) && isDefined(hoverCode)) {
      const box = current.getClientRect();
      const x = Math.round(box.x + box.width / 2);
      const y = Math.round(box.y + box.height / 2);
      tooltipTrigger({ code: hoverCode, x, y });
    }
  }, [hoverCode, hoveredRef, tooltipTrigger, keyboardActive]);

  const { getLink } = dataOptions;

  const mapId = useUniqueId();

  return (
    <>
      <AreaMap
        width={width}
        height={height}
        isTabInteractive={isTabInteractive}
        geoInfo={geoInfo}
        getLink={getLink}
        getFeatureName={getFeatureName}
        anchorEventHandlers={anchorEventHandlers}
        selectFeature={selectFeature}
        id={mapId}
        handleMouseOver={handleMouseOver}
      />
      <div
        ref={containerRef}
        style={{
          minHeight: height,
          maxHeight: '75vh',
          maxWidth: '100%',
          height: '100%',
          position: 'relative',
        }}
        onMouseOut={featureOutHandler}
        role="img"
        {...annotations.props}
      >
        <Stage
          listening={false}
          ref={stageRef}
          width={width}
          height={height}
          style={{
            overflow: 'hidden',
            position: 'absolute',
            left: 0,
            right: 0,
          }}
        >
          <Outlines geoInfo={outlineGeoInfo} featureProps={featureProps} />
          <Features geoInfo={geoInfo} featureProps={featureProps}>
            <HighlightedFeature
              feature={highlight}
              featureProps={featureProps}
              code={dataOptions.selectedCode}
              hoverCode={hoverCode}
            />
          </Features>
          <HoveredFeature
            hoveredRef={hoveredRef}
            hover={hover}
            hoverCode={hoverCode}
            featureProps={featureProps}
          />
        </Stage>
        <div style={{ position: 'absolute', left: 0, right: 0 }}>
          <img
            aria-hidden="true"
            src={oneTransparentPixelImage}
            width={width}
            height={height}
            useMap={`#${mapId}`}
          />
        </div>
      </div>
    </>
  );
};

type HighlightedFeatureProps = {
  feature: [number, number][][] | undefined;
  featureProps: FeatureProps;
  code: string | undefined;
  hoverCode: string | undefined;
};

const HighlightedFeature = memo((props: HighlightedFeatureProps) => {
  const { feature, featureProps, code, hoverCode } = props;
  if (!isDefined(feature) || !isDefined(code) || hoverCode === code) {
    return null;
  }

  return (
    <Group listening={false}>
      {feature.map((x, i) => (
        <Line
          listening={false}
          key={i}
          x={0}
          y={0}
          points={x.flat()}
          strokeWidth={featureProps.hover.strokeWidth(code, true)}
          closed
          stroke={featureProps.hover.stroke(code, false)}
        />
      ))}
    </Group>
  );
});

type HoveredFeatureProps = {
  hoveredRef: RefObject<Konva.Group>;
  hover: [number, number][][] | undefined;
  hoverCode: string | undefined;
  featureProps: FeatureProps;
};

const HoveredFeature = memo((props: HoveredFeatureProps) => {
  const { hoveredRef, hover, hoverCode, featureProps } = props;

  if (!isDefined(hoverCode) || !isDefined(hover)) {
    return null;
  }

  return (
    <Layer listening={false}>
      <Group ref={hoveredRef} listening={false}>
        {hover.map((x, i) => (
          <Line
            listening={false}
            key={i}
            x={0}
            y={0}
            points={x.flat()}
            strokeWidth={featureProps.hover.strokeWidth(hoverCode, true)}
            closed
            stroke={featureProps.hover.stroke(hoverCode, true)}
          />
        ))}
      </Group>
    </Layer>
  );
});

type OutlinesProps = {
  geoInfo: ProjectedGeoInfo[];
  featureProps: FeatureProps;
};

const Outlines = memo((props: OutlinesProps) => {
  const { geoInfo, featureProps } = props;
  if (!geoInfo.length) {
    return null;
  }
  return (
    <Layer listening={false}>
      {geoInfo.map((x, i) => (
        <Line
          listening={false}
          perfectDrawEnabled={false}
          closed
          key={`${x.code}_${i}`}
          x={0}
          y={0}
          strokeWidth={featureProps.outline.strokeWidth('')}
          points={x.coordinates.flat()}
          stroke={featureProps.outline.stroke('')}
        />
      ))}
    </Layer>
  );
});

type FeaturesProps = {
  geoInfo: ProjectedGeoInfo[];
  featureProps: FeatureProps;
  children: any;
};

const Features = memo((props: FeaturesProps) => {
  const { geoInfo, featureProps, children } = props;

  const getFillColor = useCallback(
    (code: string, index: number) => {
      /**
       * So, this is a hack. For some reason, parts of the waters of Zeeland are treated
       * as features on the safety region map and would therefore get colored in, which is incorrect.
       *
       * It happens somewhere in the logic where we convert the geojson into streams of simple
       * cartesian coordinates, but unfortunately I haven't been able to figure out what the mistake is.
       *
       * This manually checks whether the feature is a piece of land or water. (The indexes
       * were determined by investigating the converted data manually)
       */
      if (code === 'VR19') {
        const vr19s = geoInfo.filter((x) => x.code === 'VR19');
        const idx = vr19s.indexOf(geoInfo[index]);
        if (idx === 5 || idx === 0) {
          return featureProps.area.fill(code);
        }
        return colors.white;
      }
      return featureProps.area.fill(code);
    },
    [featureProps.area, geoInfo]
  );

  return (
    <>
      <Layer listening={false}>
        <Group listening={false}>
          {geoInfo.map((x, i) => (
            <Line
              key={`${x.code}_${i}`}
              listening={false}
              perfectDrawEnabled={false}
              closed
              id={x.code}
              x={0}
              y={0}
              strokeWidth={featureProps.area.strokeWidth(x.code)}
              points={x.coordinates.flat()}
              fill={getFillColor(x.code, i)}
              stroke={featureProps.area.stroke(x.code)}
            />
          ))}
        </Group>
        {children}
      </Layer>
    </>
  );
});

type AreaMapProps = {
  isTabInteractive: boolean;
  geoInfo: ProjectedGeoInfo[];
  getLink?: (code: string) => string;
  getFeatureName: (code: string) => string;
  anchorEventHandlers: AnchorEventHandler;
  selectFeature: (code: string | undefined, isKeyboardAction?: boolean) => void;
  id: string;
  handleMouseOver: (event: MouseEvent<HTMLElement>) => void;
  height: number;
  width: number;
};

function AreaMap(props: AreaMapProps) {
  const {
    isTabInteractive,
    geoInfo,
    getLink,
    getFeatureName,
    selectFeature,
    anchorEventHandlers,
    id,
    handleMouseOver,
    height,
    width,
  } = props;

  const isTouch = useIsTouchDevice();

  return (
    <map
      name={id}
      tabIndex={isTabInteractive ? 0 : -1}
      onMouseMove={handleMouseOver}
    >
      {geoInfo.map((x, i) => (
        <area
          style={{
            cursor: 'pointer',
          }}
          tabIndex={2}
          aria-label={getFeatureName(x.code)}
          key={`${x.code}_${i}`}
          data-id={x.code}
          shape="poly"
          coords={x.coordinates.flat().join(',')}
          href={!isTouch && isDefined(getLink) ? getLink(x.code) : undefined}
          onFocus={(event) => {
            anchorEventHandlers.onFocus(event);
            selectFeature(x.code, true);
          }}
          onBlur={(event) => {
            anchorEventHandlers.onBlur(event);
            selectFeature(undefined, true);
          }}
        />
      ))}
      <area
        shape="rect"
        coords={`0,0,${width},${height}`}
        onMouseEnter={handleMouseOver}
      />
    </map>
  );
}
