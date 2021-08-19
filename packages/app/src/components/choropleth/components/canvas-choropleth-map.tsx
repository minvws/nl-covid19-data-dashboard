import { KonvaEventObject } from 'konva/lib/Node';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Layer, Line, Rect, Stage } from 'react-konva';
import { Html } from 'react-konva-utils';
import { isDefined } from 'ts-is-present';
import { VisuallyHidden } from '~/components/visually-hidden';
import { DataOptions } from '..';
import { FeatureProps } from '../logic';
import {
  GeoInfo,
  useProjectedCoordinates,
} from '../logic/use-projected-coordinates';
import { GenericChoroplethMapProps } from './svg-choropleth-map';

export const CanvasChoroplethMap = (props: GenericChoroplethMapProps) => {
  const {
    containerRef,
    hoverRef,
    dataOptions,
    width,
    height,
    annotations,
    mouseOverHandler,
    mouseOutHandler,
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

  const [geoInfo, projectedCoordinates] = useProjectedCoordinates(
    choroplethFeatures.area,
    mapProjection,
    fitExtent
  );

  const selectFeature = useCallback(
    (code: string) => {
      const featureIndexes = geoInfo
        .map((x, i) => (x.code === code ? i : undefined))
        .filter(isDefined);
      const newValues = projectedCoordinates.filter((_x, i) =>
        featureIndexes.includes(i)
      );

      setHover(newValues);
      setHoverCode(code);
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

      mouseOverHandler(evt);
    },
    [setHover]
  );

  const handleClick = useCallback((evt: KonvaEventObject<MouseEvent>) => {
    evt.cancelBubble = true;
    if (isDefined(evt.target.attrs.id) && isDefined(dataOptions.getLink)) {
      dataOptions.getLink(evt.target.attrs.id);
    }
  }, []);

  const reset = useCallback(() => {
    setHover(undefined);
    setHoverCode(undefined);
    if (isDefined(mouseOutHandler)) {
      mouseOutHandler();
    }
  }, [setHover]);

  const localContainerRef = useRef<any>(null);

  useEffect(() => {
    containerRef.current = localContainerRef.current?.content;
  }, []);

  return (
    <Stage
      width={width}
      height={height}
      ref={localContainerRef}
      onMouseOut={mouseOutHandler}
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
        isTabInteractive={isTabInteractive}
        getFeatureName={getFeatureName}
        dataOptions={dataOptions}
      />
      <Layer listening={false}>
        {isDefined(hoverCode) &&
          hover?.map((x, i) => (
            <Line
              key={i}
              x={0}
              y={0}
              points={x.flat()}
              tension={0.5}
              strokeWidth={featureProps.hover.strokeWidth(hoverCode, true)}
              closed
              stroke={featureProps.hover.stroke(hoverCode, true)}
            />
          ))}
      </Layer>
    </Stage>
  );
};

type FeaturesProps = {
  projectedCoordinates: [number, number][][];
  geoInfo: GeoInfo[];
  handleMove: any;
  handleClick: any;
  reset: any;
  selectFeature: (code: string) => void;
  featureProps: FeatureProps;
  width: number;
  height: number;
  isTabInteractive: boolean;
  getFeatureName: (code: string) => string;
  dataOptions: DataOptions;
};

const Features = memo((props: FeaturesProps) => {
  const {
    projectedCoordinates,
    geoInfo,
    handleMove,
    reset,
    handleClick,
    selectFeature,
    featureProps,
    height,
    width,
    isTabInteractive,
    getFeatureName,
    dataOptions,
  } = props;

  const getFillColor = useCallback((code: string, index: number) => {
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
  }, []);

  const { getLink } = dataOptions;

  return (
    <Layer>
      <Rect width={width} height={height} onMouseOver={reset} />

      {projectedCoordinates.map((x, i) => (
        <Line
          closed
          id={geoInfo[i].code}
          key={i}
          x={0}
          y={0}
          tension={0.5}
          lineJoin={'round'}
          strokeWidth={featureProps.area.strokeWidth(geoInfo[i].code)}
          points={x.flat()}
          fill={getFillColor(geoInfo[i].code, i)}
          stroke={featureProps.area.stroke(geoInfo[i].code)}
          onMouseOver={handleMove}
          onClick={handleClick}
        />
      ))}
      {isDefined(getLink) && (
        <Html
          divProps={{
            position: 'relative',
          }}
        >
          <VisuallyHidden>
            <div tabIndex={isTabInteractive ? 0 : -1}>
              {geoInfo
                .filter(
                  (x, i, arr) => i === arr.findIndex((y) => x.code === y.code)
                )
                .map((x, i) => (
                  <a
                    key={i}
                    tabIndex={isTabInteractive ? i + 1 : -1}
                    href={getLink(x.code)}
                    onFocus={() => {
                      selectFeature(x.code);
                    }}
                  >
                    {getFeatureName(x.code)}
                  </a>
                ))}
            </div>
          </VisuallyHidden>
        </Html>
      )}
    </Layer>
  );
});
