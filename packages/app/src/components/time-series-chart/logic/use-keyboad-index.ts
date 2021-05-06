import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { useHotkey } from '~/utils/hotkey/use-hotkey';

export function useKeyboardIndex(
  setIndex: Dispatch<SetStateAction<number>>,
  maxIndex: number
) {
  const [isEnabled, setIsEnabled] = useState(false);

  useHotkey('right', () => setIndex((x) => rotate(maxIndex, x + 1)), {
    isDisabled: !isEnabled,
    allowRepeat: true,
  });

  useHotkey('left', () => setIndex((x) => rotate(maxIndex, x - 1)), {
    isDisabled: !isEnabled,
    allowRepeat: true,
  });

  useHotkey('home', () => setIndex(0), {
    isDisabled: !isEnabled,
    allowRepeat: true,
  });

  useHotkey('end', () => setIndex(maxIndex - 1), {
    isDisabled: !isEnabled,
    allowRepeat: true,
  });

  /**
   * page up/down or shift+left/right will move the index with steps of ~10%
   */
  const largeStep = Math.max(2, Math.round(maxIndex / 10));

  useHotkey(
    ['pageup', 'shift+left'],
    () => {
      setIndex((x) => (x - largeStep <= 0 ? 0 : x - largeStep));
    },
    {
      isDisabled: !isEnabled,
      allowRepeat: true,
    }
  );

  useHotkey(
    ['pagedown', 'shift+right'],
    () => {
      setIndex((x) =>
        x + largeStep >= maxIndex ? maxIndex - 1 : x + largeStep
      );
    },
    {
      isDisabled: !isEnabled,
      allowRepeat: true,
    }
  );

  return useMemo(
    () => ({
      enable: () => setIsEnabled(true),
      disable: () => setIsEnabled(false),
    }),
    []
  );

  // return [isEnabled ? index : undefined, modifiers] as const;
}

function rotate(maxIndex: number, index: number) {
  return index >= maxIndex ? 0 : index < 0 ? maxIndex - 1 : index;
}
