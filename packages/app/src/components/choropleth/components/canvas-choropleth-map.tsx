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
import { DataOptions } from '..';
import { FeatureProps } from '../logic';
import { useHighlightedFeature } from '../logic/use-highlighted-feature';
import {
  GeoInfo,
  useProjectedCoordinates,
} from '../logic/use-projected-coordinates';
import { AnchorEventHandler } from './choropleth-map';
import { GenericChoroplethMapProps } from './svg-choropleth-map';

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

  const [geoInfo, projectedCoordinates] = useProjectedCoordinates(
    choroplethFeatures.hover,
    mapProjection,
    fitExtent
  );

  const highlight = useHighlightedFeature(
    geoInfo,
    projectedCoordinates,
    dataOptions
  );

  const selectFeature = useCallback(
    (code: string | undefined, isKeyboardAction = false) => {
      setKeyboardActive(isKeyboardAction);
      if (!isDefined(code)) {
        return;
      }

      const featureIndexes = geoInfo
        .map((x, i) => (x.code === code ? i : undefined))
        .filter(isDefined);
      const newValues = projectedCoordinates.filter((_x, i) =>
        featureIndexes.includes(i)
      );

      setHoverCode(code);
      setHover(newValues);
    },
    [setHover, geoInfo, projectedCoordinates]
  );

  const handleMove = useCallback(
    (evt: KonvaEventObject<MouseEvent>) => {
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

  const handleClick = useCallback(
    (evt: KonvaEventObject<MouseEvent>) => {
      evt.cancelBubble = true;
      if (isDefined(evt.target.attrs.id) && isDefined(dataOptions.getLink)) {
        const link = dataOptions.getLink(evt.target.attrs.id);
        router.push(link);
      }
    },
    [router, dataOptions]
  );

  const reset = useCallback(() => {
    setHover(undefined);
    setHoverCode(undefined);
    if (isDefined(featureOutHandler)) {
      featureOutHandler();
    }
  }, [setHover, setHoverCode, featureOutHandler]);

  const hoveredRef = useRef<Konva.Group>(null);

  useEffect(() => {
    if (!keyboardActive) {
      return;
    }
    const { current } = hoveredRef;
    tooltipTrigger();
    if (isPresent(current) && isDefined(hoverCode)) {
      const box = current.getClientRect();
      const x = Math.round(box.x + box.width / 2);
      const y = Math.round(box.y + box.height / 2);
      tooltipTrigger({ code: hoverCode, x, y });
    }
  }, [hoverCode, hoveredRef, tooltipTrigger, keyboardActive]);

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
          width={width}
          height={height}
          onMouseOut={featureOutHandler}
          role="img"
          style={{
            overflow: 'hidden',
            border: '1px solid black',
          }}
        >
          <Features
            width={width}
            height={height}
            geoInfo={geoInfo}
            projectedCoordinates={projectedCoordinates}
            handleMove={handleMove}
            handleClick={handleClick}
            reset={reset}
            selectFeature={selectFeature}
            featureProps={featureProps}
            dataOptions={dataOptions}
          >
            <HighlightedFeature
              feature={highlight}
              featureProps={featureProps}
              code={dataOptions.selectedCode}
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
};

const HighlightedFeature = memo((props: HighlightedFeatureProps) => {
  const { feature, featureProps, code } = props;
  if (!isDefined(feature) || !isDefined(code)) {
    return null;
  }

  return (
    <Group>
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

type FeaturesProps = {
  projectedCoordinates: [number, number][][];
  geoInfo: GeoInfo[];
  handleMove: any;
  handleClick: any;
  reset: any;
  selectFeature: (code: string) => void;
  featureProps: FeatureProps;
  height: number;
  width: number;
  dataOptions: DataOptions;
  children: any;
};

const Features = memo((props: FeaturesProps) => {
  const {
    projectedCoordinates,
    geoInfo,
    handleMove,
    handleClick,
    reset,
    featureProps,
    height,
    width,
    dataOptions,
    children,
  } = props;

  const getFillColor = useCallback(
    (code: string, index: number) => {
      /**
       * So, this is a hack. For some reason, parts of the waters of Zeeland are treated
       * as features on the safety region map and would therefore get colored in, which is incorrect.
       * This manually checks whether the feature is a piece of land or water. (The indexes
       * were determined by investigating the converted data)
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

  const getStroke = useCallback(
    (code: string) => {
      dataOptions.selectedCode;
      return featureProps.area.stroke(code);
    },
    [dataOptions, featureProps.area]
  );

  return (
    <>
      <Layer>
        <Rect width={width} height={height} onMouseOver={reset} />
        <Group onMouseOver={handleMove} onClick={handleClick}>
          {projectedCoordinates.map((x, i) => (
            <Line
              closed
              id={geoInfo[i].code}
              key={i}
              x={0}
              y={0}
              strokeWidth={featureProps.area.strokeWidth(geoInfo[i].code)}
              points={x.flat()}
              fill={getFillColor(geoInfo[i].code, i)}
              stroke={getStroke(geoInfo[i].code)}
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
  geoInfo: GeoInfo[];
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
