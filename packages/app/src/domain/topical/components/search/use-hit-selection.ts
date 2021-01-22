import { useRef, useState } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';
import { useHotkey } from '~/utils/hotkey/use-hotkey';

/**
 * This hook controls the currently selected search result index.
 * It allows the index to be controlled by the keyboard using arrow-navigation.
 *
 * Additionally:
 * - it will set focus on the corresponding DOM element while navigating with
 *   the arrow-keys.
 * - it will capture "selection"-events triggered with the return-key. These
 *   events can be triggered in combination with a command/control-modifier key
 *   which means the user would like to open the result in a new window.
 */
export function useHitSelection({
  numberOfHits,
  onSelectHit,
  isEnabled = false,
}: {
  numberOfHits: number;
  onSelectHit: (index: number, openInNewWindow: boolean) => void;
  isEnabled: boolean;
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
    { allowRepeat: true, disabled: !isEnabled }
  );

  useHotkey(
    'down',
    () => {
      const nextIndex = focusIndex + 1 < numberOfHits ? focusIndex + 1 : 0;

      setFocusIndex(nextIndex);
      maybeScrollIntoView(focusRef.current);
    },
    { allowRepeat: true, disabled: !isEnabled }
  );

  useHotkey(
    'enter',
    () => {
      focusRef.current && onSelectHit(focusIndex, false);
    },
    { allowRepeat: true, disabled: !isEnabled }
  );

  useHotkey(
    'command+enter',
    () => {
      focusRef.current && onSelectHit(focusIndex, true);
    },
    { allowRepeat: true, disabled: !isEnabled }
  );

  useHotkey(
    'control+enter',
    () => {
      focusRef.current && onSelectHit(focusIndex, true);
    },
    { allowRepeat: true, disabled: !isEnabled }
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
