import Tippy, { TippyProps, useSingleton } from '@tippyjs/react';
import { Instance } from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';

let handleMount: undefined | ((tippyInstance: Instance) => void);

type TooltipProps =
  /**
   * props for regular tooltips without singleton construction
   */
  | ({
      singletonTarget?: undefined;
      singletonSource?: undefined;
    } & TippyProps)

  /**
   * props for the singleton tooltip target component
   */
  | {
      singletonTarget: ReturnType<typeof useSingleton>[number];
      content?: TippyProps['content'];
      children?: TippyProps['children'];
    }

  /**
   * props for the singleton tooltip source component
   */
  | ({
      singletonSource: ReturnType<typeof useSingleton>[number];
    } & Omit<TippyProps, 'singleton' | 'children'>);

/**
 * Currently we'll only support the `content` prop of the tippy tooltip, but a
 * lot more should be possible if necessary.
 *
 * Usage:
 *
 *     <WithTooltip content={<p>message</p>}><button>foo</button></WithTooltip>
 */

export function WithTooltip(props: TooltipProps) {
  if ('singletonTarget' in props && props.singletonTarget) {
    return (
      <Tippy singleton={props.singletonTarget} content={props.content}>
        {props.children}
      </Tippy>
    );
  }

  const { singletonSource, content, ...tippyProps } = props;

  if (singletonSource) {
    return (
      <Tippy
        theme="light"
        appendTo={getBody}
        singleton={singletonSource}
        {...tippyProps}
      />
    );
  }

  return (
    <Tippy
      theme="light"
      appendTo={getBody}
      onMount={handleMount}
      content={content}
      {...tippyProps}
    />
  );
}

function getBody() {
  return document.body;
}

if (process.env.NODE_ENV !== 'production') {
  /**
   * This entire block won't be part of a production build
   */
  const isFocusableSelector =
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled]), details:not([disabled]), summary:not(:disabled)';

  handleMount = function reportIsFocusable(tippyInstance: Instance) {
    const { reference } = tippyInstance;

    if (!reference.matches(isFocusableSelector)) {
      console.error({ tippyInstance, reference });
      throw new Error(
        `A tooltip has been wrapped around an element which cannot receive focus state. Please make it focusable for a11y by setting tabIndex={0}`
      );
    }
  };
}
