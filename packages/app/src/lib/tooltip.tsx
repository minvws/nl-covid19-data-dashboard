import Tippy, { TippyProps } from '@tippyjs/react';
import { Instance } from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import styled from 'styled-components';
import css from '@styled-system/css';
import { useBreakpoints } from '~/utils/use-breakpoints';

import { isDefined } from 'ts-is-present';

let handleMount: undefined | ((tippyInstance: Instance) => void);

const StyledTippy = styled(Tippy)(
  css({
    backgroundColor: 'white',
    color: 'black',
    boxShadow:
      '0 0 20px 4px rgb(154 161 177 / 15%), 0 4px 80px -8px rgb(36 40 47 / 25%), 0 4px 4px -2px rgb(91 94 105 / 15%)',
    '.tippy-arrow': {
      color: 'white',
    },
  })
) as any;

/**
 * Usage:
 *     <WithTooltip content={<p>message</p>}><button>foo</button></WithTooltip>
 */

export function WithTooltip(props: TippyProps) {
  const breakpoints = useBreakpoints(true);

  if (!isDefined(props.content)) {
    return <>{props.children}</>;
  }

  return (
    <StyledTippy
      appendTo={getBody}
      onMount={handleMount}
      maxWidth={breakpoints.sm ? '285px' : '350px'}
      {...props}
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
