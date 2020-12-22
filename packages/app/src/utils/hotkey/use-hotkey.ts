import React from 'react';
import { Callback, createContext, Options } from './hotkey';

type OptionsWithDisabled = Options & { disabled?: boolean };

export function useHotkey(
  hotkey: string | string[],
  callback: Callback,
  options: OptionsWithDisabled = {}
) {
  const optionsStr = JSON.stringify(options);
  const hotkeyStr = JSON.stringify(hotkey);

  const hotkeyContextRef = React.useRef<ReturnType<typeof createContext>>();
  const callbackRef = React.useRef(callback);

  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  React.useEffect(() => {
    const hotkey: string | string[] = JSON.parse(hotkeyStr);
    const { disabled, ...options }: OptionsWithDisabled = JSON.parse(
      optionsStr
    );

    hotkeyContextRef.current?.destroy();
    hotkeyContextRef.current = undefined;

    if (!disabled) {
      const hotkeyContext = createContext(options);
      hotkeyContextRef.current = hotkeyContext;

      const handler = () => callbackRef.current();
      hotkeyContext.register(hotkey, handler);

      return () => hotkeyContext.unregister(hotkey, handler);
    }
  }, [hotkeyStr, optionsStr]);
}
