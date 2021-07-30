import { useCallback, useEffect, useRef, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { useCallbackRef } from 'use-callback-ref';

type Size = {
  width?: number;
  height?: number;
};

export function useResizeObserver<T extends HTMLElement | SVGElement>() {
  const [size, setSize] = useState<Size>({});

  const [node, setNode] = useState<T | null>(null);
  const ref = useCallbackRef<T>(null, (node) => setNode(node));

  const observer = useRef<ResizeObserver>();

  const disconnect = useCallback(() => observer.current?.disconnect(), []);
  const connect = useCallback(
    () =>
      (observer.current = new ResizeObserver(
        ([entry]: ResizeObserverEntry[]) => {
          setSize({
            width: Math.round(entry.contentRect.width),
            height: Math.round(entry.contentRect.height),
          });
        }
      )),
    []
  );

  const observe = useCallback(() => {
    connect();
    if (node) observer.current?.observe(node);
  }, [connect, node]);

  useEffect(() => {
    observe();
    return () => disconnect();
  }, [disconnect, observe]);

  return [ref, size] as const;
}
