import { debounce, defaults, isEqual } from 'lodash';
import { isDefined } from 'ts-is-present';
import { assert } from '../assert';

/**
 * Based on https://medium.com/better-programming/full-featured-hotkeys-library-in-200-lines-of-javascript-code-81a74e3138cc
 */

const KEY_MAP: Record<string, string> = {
  esc: 'escape',
  '+': 'plus',
  ' ': 'space',
  command: 'meta',
  control: 'ctrl',
  left: 'arrowleft',
  right: 'arrowright',
  up: 'arrowup',
  down: 'arrowdown',
};

const MODIFIER_KEYS = ['ctrl', 'shift', 'alt', 'meta'];

export type Callback = () => void;

export interface Options {
  /**
   * duration (ms) to detect key sequences
   *
   * default: 500
   */
  debounceTime?: number;
  /**
   * disable hotkey trigger while focus is on a textarea or input[type=text]
   *
   * default: false
   */
  disableTextInputs?: boolean;
  /**
   * allow repeated callback triggers during long press of keys
   *
   * default: false
   */
  allowRepeat?: boolean;
  /**
   * prevent default when hotkey is matched
   *
   * default: true
   */
  preventDefault?: boolean;
}

interface Hotkey {
  [key: string]: boolean;
}

interface Listener {
  hotkey: Hotkey[];
  callback: Callback;
}

const defaultOptions: Options = {
  debounceTime: 500,
  disableTextInputs: false,
  allowRepeat: false,
  preventDefault: true,
};

/**
 * Returns an object that allows to register and unregister handlers
 * for separate keys/key combinations and a destroy method for
 * cleaning up the document listener.
 */
export function createContext(options: Options = {}) {
  const listeners: Listener[] = [];
  const keydownHandler = createKeyListener(
    listeners,
    defaults({}, options, defaultOptions)
  );

  /**
   * must be keydown event, a keyup event won't work with keycombinations like
   * command+e
   */
  document.addEventListener('keydown', keydownHandler);

  return {
    register: createListenersFn(listeners, registerListener),
    unregister: createListenersFn(listeners, unregisterListener),
    destroy: () => document.removeEventListener('keydown', keydownHandler),
  };
}

function createListenersFn(
  listeners: Listener[],
  fn: typeof registerListener | typeof unregisterListener
) {
  return (hotkey: string | string[], callback: Callback) => {
    const hotkeys: string[] = [];
    hotkeys.concat(hotkey).forEach((x) => fn(listeners, x, callback));
  };
}

function unregisterListener(
  listeners: Listener[],
  hotkeyStr: string,
  callback: Callback
) {
  const hotkey = normalizeHotkey(hotkeyStr);

  const index = listeners.findIndex(
    (x) => x.callback === callback && isEqual(hotkey, x.hotkey)
  );

  if (index !== -1) {
    listeners.splice(index, 1);
  }
}

function registerListener(
  listeners: Listener[],
  hotkey: string,
  callback: Callback
) {
  listeners.push({ hotkey: normalizeHotkey(hotkey), callback });
}

function createKeyListener(listeners: Listener[], options: Options) {
  let buffer: Hotkey[] = [];
  const clearBuffer = debounce(() => {
    buffer = [];
  }, options.debounceTime);

  return (evt: KeyboardEvent) => {
    if (!options.allowRepeat && evt.repeat) {
      return;
    }

    if (options.disableTextInputs && hasFocusOnTextInput()) {
      return;
    }

    /**
     * @TODO figure out whether it is useful to support single modifier hotkeys
     */
    // if (evt.getModifierState(evt.key)) {
    //   return;
    // }

    clearBuffer();

    const hotkey: Hotkey = {
      [getMappedKey(evt.key)]: true,
    };

    MODIFIER_KEYS.map((key) => ({
      key,
      eventKey: `${key}Key` as 'ctrlKey' | 'shiftKey' | 'altKey' | 'metaKey',
    })).forEach(({ key, eventKey }) => {
      if (evt[eventKey]) {
        hotkey[key] = true;
      }
    });

    buffer.push(hotkey);

    const listener = listeners.find((x) => matchHotkey(buffer, x.hotkey));

    if (listener) {
      options.preventDefault && evt.preventDefault();
      return listener.callback();
    }
  };
}

function getMappedKey(key: string) {
  key = key.toLowerCase();
  return KEY_MAP[key] || key;
}

function matchHotkey(buffer: Hotkey[], hotkey: Hotkey[]) {
  if (buffer.length < hotkey.length) {
    return false;
  }

  const indexDiff = buffer.length - hotkey.length;

  for (let i = hotkey.length - 1; i >= 0; i -= 1) {
    if (!isEqual(buffer[indexDiff + i], hotkey[i])) {
      return false;
    }
  }

  return true;
}

function createHotkey(keys: string[]): Hotkey {
  return keys.reduce((obj, key) => ({ ...obj, [key]: true }), {});
}

function normalizeHotkey(hotkey: string) {
  return hotkey.split(/ +/g).map((part) => {
    const keys = part.split('+').filter(isDefined).map(getMappedKey);
    const result = createHotkey(keys);

    assert(
      Object.keys(result).length >= keys.length,
      `[${normalizeHotkey.name}] Hotkey combination has duplicates "${hotkey}"`
    );

    return result;
  });
}

function hasFocusOnTextInput() {
  const element = document.activeElement;
  const tagName = element?.tagName.toLowerCase();

  if (tagName === 'textarea') {
    return true;
  }

  if (tagName === 'input') {
    return ['text', 'email', 'password', 'search', 'tel', 'url'].includes(
      (element as HTMLInputElement).type
    );
  }

  return false;
}
