import Konva from 'konva';
import { KonvaEventObject } from 'konva/types/Node';
import { useRouter } from 'next/router';
import {
  memo,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { Group, Layer, Line, Rect, Stage } from 'react-konva';
import { isDefined, isPresent } from 'ts-is-present';
import { VisuallyHidden } from '~/components/visually-hidden';
import { FeatureProps } from '../logic';
import { useHighlightedFeature } from '../logic/use-highlighted-feature';
import {
  ProjectedGeoInfo,
  useProjectedCoordinates,
} from '../logic/use-projected-coordinates';
import { AnchorEventHandler } from './choropleth-map';
import { GenericChoroplethMapProps } from './svg-choropleth-map';

Konva.pixelRatio = 1;

export const CanvasChoroplethMap = (props: GenericChoroplethMapProps) => {
  const {
    containerRef,
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
    anchorsRef,
  } = props;

  const [hover, setHover] = useState<[number, number][][]>();
  const [hoverCode, setHoverCode] = useState<string>();
  const [keyboardActive, setKeyboardActive] = useState(false);

  const router = useRouter();

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
    [setHover, geoInfo]
  );

  const handleMouseOver = useCallback(
    (evt: KonvaEventObject<MouseEvent | TouchEvent>) => {
      evt.cancelBubble = true;

      if (!isDefined(evt.target.attrs.id)) {
        setHover(undefined);
        setHoverCode(undefined);
      }

      selectFeature(evt.target.attrs.id);

      featureOverHandler(evt);
    },
    [setHover, selectFeature, featureOverHandler]
  );

  const handleMouseClick = useCallback(
    (evt: KonvaEventObject<MouseEvent | TouchEvent>) => {
      evt.cancelBubble = true;
      if (isDefined(evt.target.attrs.id) && isDefined(dataOptions.getLink)) {
        const link = dataOptions.getLink(evt.target.attrs.id);
        router.push(link);
      }
    },
    [router, dataOptions]
  );

  const removeHover = useCallback(() => {
    setHover(undefined);
    setHoverCode(undefined);
    if (isDefined(featureOutHandler)) {
      featureOutHandler();
    }
    if (isPresent(stageRef.current)) {
      stageRef.current.container().style.cursor = 'default';
    }
  }, [setHover, setHoverCode, featureOutHandler]);

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

  const handleMouseEnter = useCallback(() => {
    if (isPresent(stageRef.current)) {
      stageRef.current.container().style.cursor = 'pointer';
    }
  }, [stageRef]);

  const { getLink } = dataOptions;

  return (
    <>
      {isDefined(getLink) && isPresent(anchorsRef.current) && (
        <>
          {createPortal(
            <AnchorLinks
              isTabInteractive={isTabInteractive}
              geoInfo={geoInfo}
              getLink={getLink}
              getFeatureName={getFeatureName}
              anchorEventHandlers={anchorEventHandlers}
              selectFeature={selectFeature}
            />,
            anchorsRef.current
          )}
        </>
      )}
      <div
        ref={containerRef}
        style={{
          minHeight: height,
          maxHeight: '75vh',
          maxWidth: '100%',
        }}
      >
        <Stage
          ref={stageRef}
          width={width}
          height={height}
          onMouseOut={featureOutHandler}
          role="img"
          style={{
            overflow: 'hidden',
          }}
        >
          <Outlines
            width={width}
            height={height}
            geoInfo={outlineGeoInfo}
            featureProps={featureProps}
          />
          <Features
            width={width}
            height={height}
            geoInfo={geoInfo}
            handleMouseOver={handleMouseOver}
            handleMouseClick={handleMouseClick}
            handleMouseEnter={handleMouseEnter}
            removeHover={removeHover}
            selectFeature={selectFeature}
            featureProps={featureProps}
          >
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
      <Group ref={hoveredRef}>
        {hover.map((x, i) => (
          <Line
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
  height: number;
  width: number;
};

const Outlines = memo((props: OutlinesProps) => {
  const { geoInfo, featureProps, height, width } = props;
  if (!geoInfo.length) {
    return null;
  }
  return (
    <Layer>
      {geoInfo.map((x, i) => (
        <Line
          perfectDrawEnabled={false}
          closed
          key={i}
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
  handleMouseOver: (evt: KonvaEventObject<MouseEvent | TouchEvent>) => void;
  handleMouseClick: (evt: KonvaEventObject<MouseEvent | TouchEvent>) => void;
  handleMouseEnter: (evt: KonvaEventObject<MouseEvent | TouchEvent>) => void;
  removeHover: (evt: KonvaEventObject<MouseEvent | TouchEvent>) => void;
  selectFeature: (code: string) => void;
  featureProps: FeatureProps;
  height: number;
  width: number;
  children: any;
};

const Features = memo((props: FeaturesProps) => {
  const {
    geoInfo,
    handleMouseOver,
    handleMouseClick,
    handleMouseEnter,
    removeHover: reset,
    featureProps,
    height,
    width,
    children,
  } = props;

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
        return 'white';
      }
      return featureProps.area.fill(code);
    },
    [featureProps.area, geoInfo]
  );

  return (
    <>
      <Layer>
        <Rect width={width} height={height} onTap={reset} />
        <Group
          onMouseOver={handleMouseOver}
          onClick={handleMouseClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={reset}
          onTap={handleMouseOver}
        >
          {geoInfo.map((x, i) => (
            <Line
              perfectDrawEnabled={false}
              closed
              id={geoInfo[i].code}
              key={i}
              x={0}
              y={0}
              strokeWidth={featureProps.area.strokeWidth(geoInfo[i].code)}
              points={x.coordinates.flat()}
              fill={getFillColor(geoInfo[i].code, i)}
              stroke={featureProps.area.stroke(geoInfo[i].code)}
            />
          ))}
        </Group>
        {children}
      </Layer>
    </>
  );
});

type AnchorLinksProps = {
  isTabInteractive: boolean;
  geoInfo: ProjectedGeoInfo[];
  getLink: (code: string) => string;
  getFeatureName: (code: string) => string;
  anchorEventHandlers: AnchorEventHandler;
  selectFeature: (code: string | undefined, isKeyboardAction?: boolean) => void;
};

function AnchorLinks(props: AnchorLinksProps) {
  const {
    isTabInteractive,
    geoInfo,
    getLink,
    getFeatureName,
    selectFeature,
    anchorEventHandlers,
  } = props;

  const anchorInfo = useMemo(() => {
    return geoInfo
      .slice()
      .filter((x, i, arr) => i === arr.findIndex((y) => x.code === y.code))
      .sort((a, b) =>
        getFeatureName(a.code).localeCompare(
          getFeatureName(b.code),
          undefined,
          { sensitivity: 'accent' }
        )
      );
  }, [geoInfo, getFeatureName]);

  return (
    <VisuallyHidden>
      <div tabIndex={isTabInteractive ? 0 : -1}>
        {anchorInfo.map((x, i) => (
          <a
            title={getFeatureName(x.code)}
            data-id={x.code}
            key={i}
            tabIndex={i + 1}
            href={getLink(x.code)}
            onFocus={(event) => {
              anchorEventHandlers.onFocus(event);
              selectFeature(x.code, true);
            }}
            onBlur={(event) => {
              anchorEventHandlers.onBlur(event);
              selectFeature(undefined, true);
            }}
          >
            {getFeatureName(x.code)}
          </a>
        ))}
      </div>
    </VisuallyHidden>
  );
}
