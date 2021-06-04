import Tippy, { TippyProps, useSingleton } from '@tippyjs/react';
import { Instance } from 'tippy.js';
import { createContext, ReactNode, useContext } from 'react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';
import { assert } from '~/utils/assert';
import { isPresent } from 'ts-is-present';

const tooltipContext = createContext<TippyProps['singleton']>(undefined);

export function TooltipContext({ children }: { children: ReactNode }) {
  const [source, target] = useSingleton();

  return (
    <tooltipContext.Provider value={target}>
      {children}
      <Tippy
        singleton={source}
        theme="light"
        onMount={
          process.env.NODE_ENV !== 'production' ? reportIsFocusable : undefined
        }
      />
    </tooltipContext.Provider>
  );
}

/**
 * Currently we'll only support the `content` prop of the tippy tooltip, but a
 * lot more should be possible if necessary.
 */
type TooltipProps = Pick<TippyProps, 'children' | 'content'>;

export function WithTooltip({ children, content }: TooltipProps) {
  const target = useContext(tooltipContext);
  assert(target, 'missing TooltipContext in component tree');

  return (
    <Tippy singleton={target} content={content}>
      {children}
    </Tippy>
  );
}

const isFocusableSelector =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled]), details:not([disabled]), summary:not(:disabled)';

async function reportIsFocusable(tippyInstance: Instance) {
  const { triggerTarget } = tippyInstance.props;
  const triggerTargets = Array.isArray(triggerTarget)
    ? triggerTarget
    : [triggerTarget].filter(isPresent);

  const unfocusableTriggerTargets = triggerTargets.filter(
    (x) => !x.matches(isFocusableSelector)
  );

  if (triggerTargets.some((x) => !x.matches(isFocusableSelector))) {
    console.error({ tippyInstance, unfocusableTriggerTargets });
    throw new Error(
      `A tooltip has been wrapped around an element which cannot receive focus state. Please make it focusable for a11y by setting tabIndex={0}`
    );
  }
}
