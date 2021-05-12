import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { useCallbackRef } from 'use-callback-ref';
import { Box } from '~/components/base';

/**
 * Hook returning a component which will fill to available width and height of
 * the parent container.
 * Additionally it returns the measured width and height of the component.
 *
 * @param initialWidth the initial width will be used server-side. Client side
 * this will be set to the available width defined by the parent.
 * @param minHeight the min height will define a minimal height of the
 * container. Client side this may become larger when the parent component gives
 * more height.
 */
export function useResponsiveContainer(initialWidth: number, minHeight = 0) {
  const {
    height: measuredHeight = minHeight,
    width: measuredWidth = initialWidth,
    ref,
  } = useResizeObserver<HTMLDivElement>();

  const width = Math.floor(measuredWidth);
  const height = Math.floor(Math.max(measuredHeight, minHeight));

  const ResponsiveContainer = useCallback(
    ({
      children,
      height = '100%',
    }: {
      children: ReactNode;
      height?: string | number;
    }) => (
      <Box ref={ref} height="100%" minHeight={minHeight} position="relative">
        <Box position="absolute" width="100%" style={{ height }}>
          {children}
        </Box>
      </Box>
    ),
    [ref, minHeight]
  );

  return { width, height, ResponsiveContainer, ref };
}

type Size = {
  width: number;
  height: number;
};

function useResizeObserver<T extends HTMLElement | SVGSVGElement>() {
  const [size, setSize] = useState<Size>();

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

  return { ...size, ref };
}
