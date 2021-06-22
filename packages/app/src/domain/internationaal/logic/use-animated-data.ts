import { useRef, useState } from 'react';
import { isDefined } from 'ts-is-present';
import { FetchLoadingState, fetchWithRetry } from '~/utils/fetch-with-retry';

const DAY_IN_SECONDS = 24 * 60 * 60;
const isLoading = Symbol('data_is_loading');

type IsLoading = typeof isLoading;

export function useAnimatedData<T>(
  initialData: T[],
  startPosition: number,
  baseUrl = '/json/euro'
) {
  const playPosition = useRef(startPosition);
  const playState = useRef(false);
  const positions = useRef<Record<number, T[] | IsLoading>>({
    [startPosition]: initialData,
  });
  const [data, setData] = useState(initialData);
  const [loadingState, setLoadingState] = useState<FetchLoadingState>('idle');

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
    if (positionValue === isLoading) {
      return;
    } else if (isRecord(positionValue)) {
      setData(positionValue);
    } else {
      positions.current[date] = isLoading;
      try {
        const remoteData = await fetchWithRetry<T[]>(
          `${baseUrl}/${date}.json`,
          setLoadingState
        );
        const mergedData = initialData.map((x, idx) => ({
          ...x,
          ...remoteData[idx],
        }));
        setData((positions.current[date] = mergedData));
      } catch (e) {
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

  return [data, play, stop, reset, loadingState] as const;
}

function isRecord<T>(item: any): item is Record<string, T[]> {
  return isDefined(item);
}
