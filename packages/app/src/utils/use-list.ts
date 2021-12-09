import { useCallback, useMemo, useState } from 'react';

/**
 * Creates a stateful list and an accompanying API to mutate this list.
 *
 * @param initialValue The initial list
 * @returns The list and its API
 */
export function useList<T>(initialValue: T[] = []) {
  const [list, setList] = useState<T[]>(initialValue);

  const add = useCallback((item: T) => {
    setList((items) => items.concat(item));
  }, []);

  const remove = useCallback((item: T) => {
    setList((items) => items.filter((x) => x !== item));
  }, []);

  const toggle = useCallback(
    (item: T) => {
      list.includes(item) ? remove(item) : add(item);
    },
    [add, remove, list]
  );

  const clear = useCallback(() => setList([]), []);

  return useMemo(
    () => ({
      list,
      add,
      remove,
      toggle,
      clear,
    }),
    [list, add, remove, toggle, clear]
  );
}
