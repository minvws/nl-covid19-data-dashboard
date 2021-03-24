import React from 'react';
import { Callback, createContext, Options } from './hotkey';

type OptionsWithDisabled = Options & { isDisabled?: boolean };

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

  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  React.useEffect(() => {
    /**
     * We'll parse the serialized arguments to recreate the argument objects.
     */
    const hotkeyParsed: string | string[] = JSON.parse(hotkeySerialized);
    const { isDisabled, ...options }: OptionsWithDisabled = JSON.parse(
      optionsSerialized
    );

    hotkeyContextRef.current?.destroy();
    hotkeyContextRef.current = undefined;

    if (!isDisabled) {
      const hotkeyContext = createContext(options);
      hotkeyContextRef.current = hotkeyContext;

      const handler = () => callbackRef.current();
      hotkeyContext.register(hotkeyParsed, handler);

      return () => hotkeyContext.unregister(hotkeyParsed, handler);
    }
  }, [hotkeySerialized, optionsSerialized]);
}
