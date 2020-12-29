import { useRef, useState } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';
import { useHotkey } from '~/utils/hotkey/use-hotkey';

export function useHitSelection({
  numberOfHits,
  onSelectHit,
}: {
  numberOfHits: number;
  onSelectHit: (index: number, openInNewWindow: boolean) => void;
}) {
  const [focusIndex, setFocusIndex] = useState(0);
  const focusRef = useRef<HTMLAnchorElement>(null);

  useHotkey(
    'up',
    () => {
      const nextIndex = focusIndex - 1 < 0 ? numberOfHits - 1 : focusIndex - 1;
      setFocusIndex(nextIndex);
      maybeScrollIntoView(focusRef.current);
    },
    { allowRepeat: true }
  );

  useHotkey(
    'down',
    () => {
      const nextIndex = focusIndex + 1 < numberOfHits ? focusIndex + 1 : 0;

      setFocusIndex(nextIndex);
      maybeScrollIntoView(focusRef.current);
    },
    { allowRepeat: true }
  );

  useHotkey(
    'enter',
    () => {
      focusRef.current && onSelectHit(focusIndex, false);
    },
    { allowRepeat: true }
  );

  useHotkey(
    'command+enter',
    () => {
      focusRef.current && onSelectHit(focusIndex, true);
    },
    { allowRepeat: true }
  );

  useHotkey(
    'control+enter',
    () => {
      focusRef.current && onSelectHit(focusIndex, true);
    },
    { allowRepeat: true }
  );

  return { focusIndex, setFocusIndex, focusRef };
}

function maybeScrollIntoView<T extends Element>(el: T | null | undefined) {
  if (el) {
    scrollIntoView(el, {
      behavior: 'smooth',
      scrollMode: 'if-needed',
      block: 'nearest',
      inline: 'nearest',
    });
  }
}
