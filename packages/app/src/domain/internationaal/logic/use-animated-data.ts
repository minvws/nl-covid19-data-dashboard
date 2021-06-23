import { useRef, useState } from 'react';
import { FetchLoadingState, fetchWithRetry } from '~/utils/fetch-with-retry';

const DAY_IN_SECONDS = 24 * 60 * 60;
const isFetching = Symbol('data_is_fetching');

type IsFetching = typeof isFetching;

export function useAnimatedData<T>(
  initialData: T[],
  initialTimestamp: number,
  timestampCount: number,
  baseUrl = '/json/euro'
) {
  const playPosition = useRef(0);
  const playState = useRef(false);
  const timestampsData = useRef<Record<number, T[] | IsFetching>>({
    [initialTimestamp]: initialData,
  });
  const timestampList = useRef<number[]>(
    new Array(timestampCount)
      .fill(initialTimestamp)
      .map((x, index) => x + index * DAY_IN_SECONDS)
  );
  const [data, setData] = useState(initialData);
  const [loadingState, setLoadingState] = useState<FetchLoadingState>('idle');
  const [currentDate, setCurrentDate] = useState(initialTimestamp);

  async function play() {
    if (!playState.current) {
      playPosition.current = playPosition.current + 1;
      playState.current = true;

      continuePlay();
    }
  }

  async function skip(index: number) {
    playPosition.current = index;
    loadNext(index);
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
    setCurrentDate(timestamp);

    if (positionValue === isFetching) {
      return;
    } else if (isArray(positionValue)) {
      setData(positionValue);
    } else {
      timestampsData.current[timestamp] = isFetching;
      try {
        const fetchedData = await fetchWithRetry<T[]>(
          `${baseUrl}/${timestamp}.json`,
          setLoadingState
        );

        timestampsData.current[timestamp] = fetchedData;

        // We can't check currentDate here since we might be looking at older state
        // so we use this hack to compare the curried timestamp to the actual latest state
        // and update the Data state accordingly:
        setCurrentDate((d) => {
          if (d === timestamp) {
            setData(fetchedData);
          }
          return d;
        });
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
    const firstValue = timestampsData.current[timestampList.current[0]];
    if (isArray(firstValue)) {
      setData(firstValue);
    }
  }

  return [data, play, skip, stop, reset, loadingState, currentDate] as const;
}

function isArray<T>(item: IsFetching | T[]): item is T[] {
  return Array.isArray(item);
}
