import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { useHotkey } from '~/utils/hotkey/use-hotkey';
import { wrapAroundLength } from '~/utils/number';

export function useKeyboardNavigation(
  setPosition: Dispatch<SetStateAction<number>>,
  length: number,
  setIsTabInteractive: Dispatch<SetStateAction<boolean>>
) {
  const [isEnabled, setIsEnabled] = useState(false);

  useHotkey(
    ['right', 'shift+>'],
    () => setPosition((x) => wrapAroundLength(x + 1, length)),
    {
      isDisabled: !isEnabled,
      allowRepeat: true,
    }
  );

  useHotkey(
    ['left', 'shift+<'],
    () => setPosition((x) => wrapAroundLength(x - 1, length)),
    {
      isDisabled: !isEnabled,
      allowRepeat: true,
    }
  );

  useHotkey('home', () => setPosition(0), {
    isDisabled: !isEnabled,
    allowRepeat: true,
  });

  useHotkey('end', () => setPosition(length - 1), {
    isDisabled: !isEnabled,
    allowRepeat: true,
  });

  /**
   * page up/down or shift+left/right will move the index with steps of ~10%
   */
  const largeStep = Math.max(2, Math.round(length / 10));

  useHotkey(
    ['pageup', 'shift+left'],
    () => {
      setPosition((x) => (x - largeStep <= 0 ? 0 : x - largeStep));
    },
    {
      isDisabled: !isEnabled,
      allowRepeat: true,
    }
  );

  useHotkey(
    ['pagedown', 'shift+right'],
    () => {
      setPosition((x) =>
        x + largeStep >= length ? length - 1 : x + largeStep
      );
    },
    {
      isDisabled: !isEnabled,
      allowRepeat: true,
    }
  );

  useHotkey(['escape'], () => setIsTabInteractive(false), {
    isDisabled: !isEnabled,
    allowRepeat: true,
  });

  return useMemo(
    () => ({
      enable: () => setIsEnabled(true),
      disable: () => setIsEnabled(false),
    }),
    []
  );
}
