import { KonvaEventObject } from 'konva/lib/Node';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Layer, Line, Rect, Stage } from 'react-konva';
import { Html } from 'react-konva-utils';
import { isDefined } from 'ts-is-present';
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

  const [hover, setHover] = useState<[number, number][][] | undefined>();

  const [geoInfo, projectedCoordinates] = useProjectedCoordinates(
    choroplethFeatures.area,
    mapProjection,
    width,
    height
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
    },
    [setHover, geoInfo, projectedCoordinates]
  );

  const handleMove = useCallback(
    (evt: KonvaEventObject<MouseEvent>) => {
      evt.cancelBubble = true;

      if (!isDefined(evt.target.attrs.id)) {
        setHover(undefined);
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

  const reset = useCallback(
    (evt: KonvaEventObject<MouseEvent>) => {
      setHover(undefined);
      if (isDefined(mouseOutHandler)) {
        mouseOutHandler();
      }
    },
    [setHover]
  );

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
        geoInfo={geoInfo}
        projectedCoordinates={projectedCoordinates}
        handleMove={handleMove}
        handleClick={handleClick}
        reset={reset}
        selectFeature={selectFeature}
      />
      <Layer listening={false}>
        {hover?.map((x, i) => (
          <Line
            key={i}
            x={0}
            y={0}
            points={x.flat()}
            tension={1.5}
            closed
            stroke="white"
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
};

const Features = memo((props: FeaturesProps) => {
  const {
    projectedCoordinates,
    geoInfo,
    handleMove,
    reset,
    handleClick,
    selectFeature,
  } = props;

  return (
    <Layer>
      <Rect width={500} height={500} onMouseOver={reset} />

      {projectedCoordinates.map((x, i) => (
        <Line
          id={geoInfo[i].code}
          key={i}
          x={0}
          y={0}
          points={x.flat()}
          tension={0.5}
          closed
          fill={'blue'}
          stroke="gray"
          onMouseOver={handleMove}
          onClick={handleClick}
        />
      ))}
      <Html
        divProps={{
          position: 'relative',
        }}
      >
        <div
          style={{ position: 'absolute', left: '-5000px', width: '200px' }}
          tabIndex={0}
        >
          {geoInfo
            .filter(
              (x, i, arr) => i === arr.findIndex((y) => x.code === y.code)
            )
            .map((x, i) => (
              <a
                key={i}
                tabIndex={i + 1}
                href={`/gemeente/${x.code}`}
                onFocus={() => {
                  selectFeature(x.code);
                }}
              >
                Link naar gemeente {x.code}
              </a>
            ))}
        </div>
      </Html>
    </Layer>
  );
});
