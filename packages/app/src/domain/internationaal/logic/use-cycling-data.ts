import { useRef, useState } from 'react';
import { FetchState, fetchWithRetry } from '~/utils/fetch-with-retry';

const DAY_IN_SECONDS = 24 * 60 * 60;
const isFetching = Symbol('data_is_fetching');

type IsFetching = typeof isFetching;

/**
 * This hook will load data per the given interval from the given url
 * and return so-called playback controls and a stateful data object.
 *
 * Playback controls:
 * play - starts the cycle
 * stop - stops the cycle
 * reset - restarts the cycle from the beginning
 * skip - set the current play position to the given index
 *
 * Two additional stateful objects are returned as well:
 * loadingState - This indicates whether any data is being fetched or not, and whether an error occurred during fetching
 * currentTimestamp - The timestamp of the current active data
 *
 * The firstTimestamp and timestampCount parameters are being used to construct
 * a list of available data files. This hook assumes that each file has a url
 * like this: <baseUrl>/<timestamp>.json.
 * With each timestamp being exactly one day apart. So for each timestamp count
 * one day is added starting from the firstTimestamp.
 */
export function useCyclingData<T>(
  initialData: T[],
  firstTimestamp: number,
  timestampCount: number,
  baseUrl = '/json/euro',
  interval = 1000
) {
  // This represents the index in the timestampList
  const playPosition = useRef(0);
  // true == playing, false == stopped
  const playState = useRef(false);
  // A timestamp->data lookup which holds all of the fetched data
  const timestampsData = useRef<Record<number, T[] | IsFetching>>({
    [firstTimestamp]: initialData,
  });
  // An array of available timestamps, each timestamp represents a data file that
  // is fetched remotely
  const timestampList = useRef<number[]>(
    new Array(timestampCount)
      .fill(firstTimestamp)
      .map((x, index) => x + index * DAY_IN_SECONDS)
  );

  // The currently displayed data set
  const [data, setData] = useState(initialData);
  // Indicates whether any data is currently being fetched or if an error occured
  const [loadingState, setLoadingState] = useState<FetchState>('idle');
  // The timestamp of the currently displayed data
  const [currentTimestamp, setCurrentTimestamp] = useState(firstTimestamp);

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
    }, interval);
  }

  async function loadNext(index: number) {
    if (index > timestampList.current.length - 1 || index < 0) {
      playPosition.current = timestampList.current.length - 1;
      playState.current = false;
      return;
    }

    const timestamp = timestampList.current[index];
    const positionValue = timestampsData.current[timestamp];
    setCurrentTimestamp(timestamp);

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
        setCurrentTimestamp((d) => {
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

  return [
    data,
    play,
    skip,
    stop,
    reset,
    loadingState,
    currentTimestamp,
  ] as const;
}

function isArray<T>(item: IsFetching | T[]): item is T[] {
  return Array.isArray(item);
}
