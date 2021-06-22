import { useRef, useState } from 'react';
import { isDefined } from 'ts-is-present';
import { FetchLoadingState, fetchWithRetry } from '~/utils/fetch-with-retry';

const DAY_IN_SECONDS = 24 * 60 * 60;
const isLoading = Symbol('data_is_loading');

type IsLoading = typeof isLoading;

export function useAnimatedData<T>(
  initialData: T[],
  initialTimestamp: number,
  timestampCount: number,
  baseUrl = '/json/euro'
) {
  const playPosition = useRef(0);
  const playState = useRef(false);
  const timestampsData = useRef<Record<number, T[] | IsLoading>>({
    [initialTimestamp]: initialData,
  });
  const timestampList = useRef<number[]>(
    new Array(timestampCount)
      .fill(initialTimestamp)
      .map((x, index) => x + index * DAY_IN_SECONDS)
  );
  const [data, setData] = useState(initialData);
  const [loadingState, setLoadingState] = useState<FetchLoadingState>('idle');

  async function play() {
    if (!playState.current) {
      playPosition.current = playPosition.current + 1;
      playState.current = true;

      continuePlay();
    }
  }

  async function skip(index: number) {
    playPosition.current = index;
    if (!playState.current) {
      play();
    }
  }

  async function continuePlay() {
    await loadNext(playPosition.current);
    setTimeout(() => {
      if (playState.current) {
        playPosition.current = playPosition.current + 1;
        continuePlay();
      }
    }, 1000);
  }

  async function loadNext(index: number) {
    if (index > timestampList.current.length - 1) {
      playPosition.current = timestampList.current.length - 1;
      playState.current = false;
      return;
    }

    const timestamp = timestampList.current[index];
    const positionValue = timestampsData.current[timestamp];

    if (positionValue === isLoading) {
      return;
    } else if (isRecord(positionValue)) {
      setData(positionValue);
    } else {
      timestampsData.current[timestamp] = isLoading;
      try {
        const remoteData = await fetchWithRetry<T[]>(
          `${baseUrl}/${timestamp}.json`,
          setLoadingState
        );
        const mergedData = initialData.map((x, idx) => ({
          ...x,
          ...remoteData[idx],
        }));
        setData((timestampsData.current[timestamp] = mergedData));
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
    playPosition.current = 0;
    setData(timestampsData.current[timestampList.current[0]] as T[]);
  }

  return [data, play, skip, stop, reset, loadingState] as const;
}

function isRecord<T>(item: any): item is Record<string, T[]> {
  return isDefined(item);
}
