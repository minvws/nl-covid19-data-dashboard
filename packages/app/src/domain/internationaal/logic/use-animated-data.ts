import { useRef, useState } from 'react';
import { isDefined } from 'ts-is-present';

const DAY_IN_SECONDS = 24 * 60 * 60;

export function useAnimatedData<T>(
  initialData: T[],
  startPosition: number,
  baseUrl = '/json/euro'
) {
  const playPosition = useRef(startPosition);
  const playState = useRef(false);
  const positions = useRef<Record<number, T[] | Promise<Response>>>({
    [startPosition]: initialData,
  });
  const [data, setData] = useState(initialData);

  async function play() {
    if (!playState.current) {
      playPosition.current = +playPosition.current + +DAY_IN_SECONDS;
      playState.current = true;

      continuePlay();
    }
  }

  async function continuePlay() {
    await loadNext(playPosition.current);
    setTimeout(() => {
      if (playState.current) {
        playPosition.current = +playPosition.current + +DAY_IN_SECONDS;
        continuePlay();
      }
    }, 1000);
  }

  async function loadNext(date: number) {
    const positionValue = positions.current[date];
    if (isPromise(positionValue)) {
      return;
    } else if (isRecord(positionValue)) {
      setData(positionValue);
    } else {
      positions.current[date] = fetch(`${baseUrl}/${date}.json`);
      const response = await (positions.current[date] as Promise<Response>);
      if (response.ok) {
        const remoteData = await response.json();
        const mergedData = initialData.map((x, idx) => ({
          ...x,
          ...remoteData[idx],
        }));
        setData((positions.current[date] = mergedData));
      } else {
        playState.current = false;
      }
    }
  }

  function stop() {
    playState.current = false;
  }

  function reset() {
    stop();
    playPosition.current = startPosition;
    setData(positions.current[startPosition] as T[]);
  }

  return [data, play, stop, reset] as const;
}

function isPromise(item: any): item is Promise<Response> {
  return isDefined(item) && 'then' in item;
}

function isRecord<T>(item: any): item is Record<string, T[]> {
  return isDefined(item);
}
