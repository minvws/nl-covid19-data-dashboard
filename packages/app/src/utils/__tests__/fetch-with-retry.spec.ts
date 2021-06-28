import { enableFetchMocks, FetchMock } from 'jest-fetch-mock';
import { Dispatch, SetStateAction } from 'react';
import { FetchState, fetchWithRetry } from '../fetch-with-retry';

enableFetchMocks();

describe('Util: fetchWithRetry', () => {
  const setLoadingState: Dispatch<SetStateAction<FetchState>> = ((
    newState: FetchState
  ) => loadingStates.push(newState) as unknown) as Dispatch<
    SetStateAction<FetchState>
  >;
  let loadingStates: FetchState[] = [];

  beforeEach(() => {
    (fetch as FetchMock).resetMocks();
    loadingStates = [];
  });

  it('should download the given url when status is 200', async () => {
    (fetch as FetchMock).mockResponseOnce(
      JSON.stringify({ values: [1, 2, 3] })
    );

    const result = await fetchWithRetry<{ values: any[] }>(
      'https://mytestdomain.com/test.json',
      setLoadingState
    );

    expect(result.values).toEqual([1, 2, 3]);
  });

  it('should download the given url using retries', async () => {
    (fetch as FetchMock).mockResponses(
      () => Promise.resolve({ status: 408 }),
      () => Promise.resolve({ status: 408 }),
      () => Promise.resolve({ body: JSON.stringify({ values: [1, 2, 3] }) })
    );

    const result = await fetchWithRetry<{ values: any[] }>(
      'https://mytestdomain.com/test.json',
      setLoadingState
    );

    expect(result.values).toEqual([1, 2, 3]);
  });

  it('should error after 3 retries', async () => {
    (fetch as FetchMock).mockResponses(
      () => Promise.resolve({ status: 408 }),
      () => Promise.resolve({ status: 408 }),
      () => Promise.resolve({ status: 408 }),
      () => Promise.resolve({ status: 408 })
    );

    try {
      await fetchWithRetry(
        'https://mytestdomain.com/test.json',
        setLoadingState,
        3,
        1
      );
    } catch (e) {
      expect(e.message).toEqual('https://mytestdomain.com/test.json');
      expect(e.code).toEqual('408');
    }
  });

  it('should update the loading state when fetching succesfully', async () => {
    (fetch as FetchMock).mockResponseOnce(
      JSON.stringify({ values: [1, 2, 3] })
    );

    const result = await fetchWithRetry<{ values: any[] }>(
      'https://mytestdomain.com/test.json',
      setLoadingState
    );

    expect(loadingStates).toEqual(['loading', 'idle']);
  });

  it('should update the loading state when retrying succesfully', async () => {
    (fetch as FetchMock).mockResponses(
      () => Promise.resolve({ status: 408 }),
      () => Promise.resolve({ body: JSON.stringify({ values: [1, 2, 3] }) })
    );

    await fetchWithRetry<{ values: any[] }>(
      'https://mytestdomain.com/test.json',
      setLoadingState
    );

    expect(loadingStates).toEqual(['loading', 'retrying', 'loading', 'idle']);
  });

  it('should update the loading state when failing to fetch', async () => {
    (fetch as FetchMock).mockResponses(() => Promise.resolve({ status: 408 }));

    try {
      await fetchWithRetry<{ values: any[] }>(
        'https://mytestdomain.com/test.json',
        setLoadingState,
        0,
        0
      );
    } catch (e) {
      expect(loadingStates).toEqual(['loading', 'error']);
    }
  });
});
