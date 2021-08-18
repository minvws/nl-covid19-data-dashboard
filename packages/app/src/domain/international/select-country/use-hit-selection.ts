import { useRef, useState } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';
import { useHotkey } from '~/utils/hotkey/use-hotkey';
import { positiveModulo } from '~/utils/positive-modulo';
/**
 * This hook controls the currently selected search result index.
 * It allows the index to be controlled by the keyboard using arrow-navigation.
 *
 * Additionally:
 * - it will set focus on the corresponding DOM element while navigating with
 *   the arrow-keys.
 */
export function useHitSelection({
  isEnabled = false,
  maxPossibleItems = 0,
  onSelectHit,
  handleOnClose,
}: {
  isEnabled: boolean;
  maxPossibleItems: number;
  onSelectHit: (index: number, openInNewWindow?: boolean) => void;
  handleOnClose: () => void;
}) {
  const [focusIndex, setFocusIndex] = useState(0);
  const focusRef = useRef<HTMLLIElement>(null);

  useHotkey(
    'up',
    () => {
      const nextIndex = focusIndex - 1;
      setFocusIndex(positiveModulo(nextIndex, maxPossibleItems));
      maybeScrollIntoView(focusRef.current);
    },
    {
      allowRepeat: true,
      isDisabled: !isEnabled,
    }
  );

  useHotkey(
    'down',
    () => {
      const nextIndex = focusIndex + 1;
      setFocusIndex(positiveModulo(nextIndex, maxPossibleItems));
      maybeScrollIntoView(focusRef.current);
    },
    {
      allowRepeat: true,
      isDisabled: !isEnabled,
    }
  );

  useHotkey(
    'enter',
    () => {
      if (maxPossibleItems === 0) return;

      onSelectHit(focusIndex);
    },
    { allowRepeat: true, isDisabled: !isEnabled }
  );

  useHotkey(
    'home',
    () => {
      setFocusIndex(0);
      maybeScrollIntoView(focusRef.current);
    },
    { allowRepeat: true, isDisabled: !isEnabled }
  );

  useHotkey(
    'end',
    () => {
      setFocusIndex(maxPossibleItems - 1);
      maybeScrollIntoView(focusRef.current);
    },
    { allowRepeat: true, isDisabled: !isEnabled }
  );

  useHotkey(
    'escape',
    () => {
      handleOnClose();
    },
    { allowRepeat: true, isDisabled: !isEnabled }
  );

  return {
    focusIndex,
    focusRef,
    setFocusIndex,
  };
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
