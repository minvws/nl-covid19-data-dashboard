import { ChevronRight } from '@corona-dashboard/icons';
import css from '@styled-system/css';
import { m } from 'framer-motion';
import { isBoolean } from 'lodash';
import { cloneElement, MouseEvent, ReactElement, ReactNode, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Box, MotionBox } from '~/components/base';
import { IconButton } from '~/components/icon-button';
import { useUniqueId } from '~/utils/use-unique-id';

/**
 * Generic hook for collapsing content. Core features:
 *
 * - SSR will always display content
 * - a11y aria props are taken care of
 * - will animate out of the box
 *
 * Usage:
 *
 * The hook exposes the following:
 *
 * - `content(children: ReactNode)`
 *   - wrap the collapsible content with this function
 *
 * - `button(children?: ReactNode)`
 *   - wrap an element (probably a button) with this function which will set
 *     aria props and a click handler
 *   - the child is optional, when it's empty it will render a button with a
 *     chevron
 *
 * - `chevron`
 *   - a chevron-svg which will animate based on internal open/close state
 *
 * - `isOpen`
 *   - current open/close state
 */
export function useCollapsible(options: { isOpen?: boolean } = {}) {
  const id = useUniqueId();
  const [isOpen, setIsOpen] = useState(!!options.isOpen);

  useEffect(() => setIsOpen(!!options.isOpen), [options.isOpen]);

  const toggle = useCallback((value?: true | false | unknown) => setIsOpen((x) => (isBoolean(value) ? value : !x)), []);

  const chevron = (
    <Box as="span" display="inline-block" transform="rotate(90deg)" css={css({ '.has-no-js &': { display: 'none' } })}>
      <MotionChevron animate={{ rotateY: isOpen ? 180 : 0 }} />
    </Box>
  );

  const defaultButton = (
    <IconButton title="toggle content" size={18}>
      {chevron}
    </IconButton>
  );

  const button = (x: ReactElement = defaultButton) =>
    cloneElement(x, {
      'aria-controls': id,
      'aria-expanded': isOpen ? ('true' as const) : ('false' as const),
      style: {
        ...x.props.style,
        userSelect: 'none',
      },
      onClick: (evt: MouseEvent) => {
        evt.stopPropagation();
        setIsOpen((x) => !x);

        if (x?.props?.onClick) {
          return x.props.onClick(evt);
        }
      },
    });

  const content = (children: ReactNode) => (
    <MotionBox
      id={id}
      layout
      aria-hidden={isOpen ? 'false' : 'true'}
      width="100%"
      overflow={isOpen ? 'visible' : 'hidden'}
      animate={isOpen ? 'open' : 'rest'}
      transition={{
        duration: 0.2,
        ease: 'easeInOut',
      }}
      initial={options.isOpen ? 'open' : undefined}
      css={css({
        height: 0,
        opacity: 0,
        '.has-no-js &': {
          height: 'auto !important',
          maxHeight: 0,
          opacity: 0,
          animation: `show-menu 1s forwards`,
          animationDelay: '1s',
        },
        [`@keyframes show-menu`]: {
          from: {
            maxHeight: 0,
          },
          to: {
            opacity: 1,
            maxHeight: '99999px',
          },
        },
      })}
      variants={{
        rest: {
          opacity: 0,
          height: 0,
          transitionEnd: { display: 'none' },
        },
        open: {
          opacity: 1,
          height: 'auto',
          display: 'block',
        },
      }}
    >
      {children}
    </MotionBox>
  );

  return {
    button,
    content,
    chevron,
    toggle,
    isOpen,
  };
}

const MotionChevron = styled(m(ChevronRight))(
  css({
    backgroundSize: '1.4em 0.9em',
    backgroundPosition: '0 50%',
    backgroundRepeat: 'no-repeat',
    height: '0.9em',
    width: '1.5em',
    display: 'inline-block',
    color: 'blue8',
  })
);
