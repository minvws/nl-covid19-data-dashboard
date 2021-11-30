import React, { useEffect } from 'react';
import { Callback, createContext, Options } from './hotkey';

type OptionsWithDisabled = Options & { isDisabled?: boolean };

/**
 * General hook to handle a keydown operation. The operation may be
 * triggered by one more more keys/key combinations.
 * This hook will automatically clean up after unmount.
 *
 * @param hotkey one or more keys, combinations like 'control+z' are allowed as well
 * @param callback The callback which will be called after the key(s) have been pressed
 * @param options Options to tweak the behavior of the key press handling
 */
export function useHotkey(
  hotkey: string | string[],
  callback: Callback,
  options: OptionsWithDisabled = {}
) {
  /**
   * We'll serialize the incoming arguments for our effects dependencies
   * shallow comparison.
   */
  const optionsSerialized = JSON.stringify(options);
  const hotkeySerialized = JSON.stringify(hotkey);

  const hotkeyContextRef = React.useRef<ReturnType<typeof createContext>>();
  const callbackRef = React.useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    /**
     * We'll parse the serialized arguments to recreate the argument objects.
     */
    const hotkeyParsed: string | string[] = JSON.parse(hotkeySerialized);
    const { isDisabled, ...options }: OptionsWithDisabled =
      JSON.parse(optionsSerialized);

    hotkeyContextRef.current?.destroy();
    hotkeyContextRef.current = undefined;

    if (!isDisabled) {
      const hotkeyContext = createContext(options);
      hotkeyContextRef.current = hotkeyContext;

      const handler = () => callbackRef.current();
      hotkeyContext.register(hotkeyParsed, handler);

      return () => {
        hotkeyContext.unregister(hotkeyParsed, handler);
        hotkeyContext.destroy();
      };
    }
  }, [hotkeySerialized, optionsSerialized]);
}
